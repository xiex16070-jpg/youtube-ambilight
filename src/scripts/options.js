import { storage } from './libs/storage';
import { syncStorage } from './libs/sync-storage';
import { getFeedbackFormLink, getPrivacyPolicyLink } from './libs/utils';
import SettingsConfig from './libs/settings-config';
import { on } from './libs/generic';

document.querySelector('#feedbackFormLink').href = getFeedbackFormLink();
document.querySelector('#privacyPolicyLink').href = getPrivacyPolicyLink();

const toggles = document.querySelectorAll('.expandable__toggle');
for (const elem of toggles) {
  on(elem, 'click', () => {
    elem.closest('.expandable').classList.toggle('expanded');
  });
}

if (!chrome?.storage?.local?.onChanged) {
  const synchronizationWarning = document.createElement('div');
  synchronizationWarning.textContent =
    '无法将崩溃报告设置同步到已打开的 YouTube 页面。更改选项后，请刷新已打开的 YouTube 页面。';
  synchronizationWarning.classList.add('warning');
  document
    .querySelector('.warnings-container')
    .appendChild(synchronizationWarning);
}

const importExportStatus = document.querySelector('#importExportStatus');
const importExportStatusDetails = document.querySelector(
  '#importExportStatusDetails'
);
let importWarnings = [];
const importSettings = async (storageName, importJson) => {
  try {
    importExportStatus.textContent = '';
    importExportStatus.classList.remove('has-error');
    importExportStatusDetails.textContent = '';
    importExportStatusDetails.scrollTo(0, 0);

    const jsonString = await importJson();
    if (!jsonString) throw new Error('没有找到可导入的设置');

    let importedObject = JSON.parse(jsonString);
    if (typeof importedObject !== 'object')
      throw new Error('没有找到可导入的设置');

    // Temporarely import the setting blur as blur2
    // https://github.com/WesselKroos/youtube-ambilight/issues/191#issuecomment-1703792823
    if ('blur' in importedObject) {
      importedObject.blur2 = importedObject.blur;
      delete importedObject.blur;
    }

    importedObject = Object.keys(importedObject)
      .sort()
      .reduce((obj, key) => ((obj[key] = importedObject[key]), obj), {});

    const settings = {};
    for (const name in importedObject) {
      let value = importedObject[name];

      const setting = SettingsConfig.find((setting) => setting.name === name);
      if (!setting) {
        importWarnings.push(
          `已跳过“${name}”：${JSON.stringify(
            value
          )}。该设置可能已在更新后移除或更名。`
        );
        continue;
      }

      const { type, min = 0, step = 0.1, max } = setting;
      if (type === 'checkbox' || type === 'section') {
        if (typeof value !== 'boolean') {
          importWarnings.push(
            `已跳过“${name}”：${JSON.stringify(value)} 不是布尔值。`
          );
          continue;
        }
      } else if (type === 'list') {
        if (typeof value !== 'number') {
          importWarnings.push(
            `已跳过“${name}”：${JSON.stringify(value)} 不是数字。`
          );
          continue;
        }
        const valueRoundingLeft = ((value - min) * 1000) % (step * 1000);
        if (valueRoundingLeft !== 0) {
          importWarnings.push(
            `已向下取整“${name}”：${JSON.stringify(
              value
            )} 不符合步长 ${step}${
              min === undefined ? '' : `（起始值 ${min}）`
            }。`
          );
          value = Math.round(value * 1000 - valueRoundingLeft) / 1000;
        }
        if (min !== undefined && value < min) {
          importWarnings.push(
            `已调整“${name}”：${JSON.stringify(
              value
            )} 低于最小值 ${min}。`
          );
          value = min;
        }
        if (max !== undefined && value > max) {
          importWarnings.push(
            `已调整“${name}”：${JSON.stringify(
              value
            )} 高于最大值 ${max}。`
          );
          value = max;
        }
      }

      settings[`setting-${name}`] = value;
    }

    if (!Object.keys(settings).length)
      throw new Error('没有找到可导入的设置');

    await storage.set(settings);

    importExportStatus.textContent = `已从${storageName || '文件'}导入 ${
      Object.keys(settings).length
    } 项设置。
（请刷新已打开的 YouTube 页面以应用新设置。）${
      importWarnings.length
        ? `\n\n共 ${importWarnings.length} 条提示：\n- ${importWarnings.join(
            '\n- '
          )}`
        : ''
    }`;
    if (importWarnings.length) {
      importExportStatus.classList.add('has-error');
    }
    importWarnings = [];

    importExportStatusDetails.textContent = `查看已导入的设置（点击展开）\n说明：blur 设置会在内部转换为 blur2\n\n${Object.keys(
      settings
    )
      .map(
        (key) =>
          `${key.substring('setting-'.length)}: ${JSON.stringify(
            settings[key]
          )}`
      )
      .join('\n')}`;
  } catch (ex) {
    console.error('导入设置失败', ex);
    importExportStatus.classList.add('has-error');
    const errorMessage =
      ex instanceof SyntaxError
        ? '设置数据格式无效，请选择有效的 JSON 数据。'
        : ex?.message;
    importExportStatus.textContent = `导入设置失败：\n${errorMessage}`;
  }
};
const exportSettings = async (storageName, exportJson) => {
  try {
    importExportStatus.textContent = '';
    importExportStatus.classList.remove('has-error');
    importExportStatusDetails.textContent = '';
    importExportStatusDetails.scrollTo(0, 0);

    const storageData = await storage.get(null);

    let exportObject = {};
    const settings = Object.keys(storageData).filter((key) =>
      key.startsWith('setting-')
    );
    for (const key of settings) {
      const name = key.substring('setting-'.length);
      const existsInConfig = SettingsConfig.some(
        (setting) => setting.name === name
      );
      if (!existsInConfig) continue;

      exportObject[name] = storageData[key];
    }
    if (!Object.keys(exportObject).length)
      throw new Error(
        '没有可导出的更改，所有设置仍为默认值。'
      );

    // Temporarely export the setting blur2 as blur
    // https://github.com/WesselKroos/youtube-ambilight/issues/191#issuecomment-1703792823
    if ('blur2' in exportObject) {
      exportObject.blur = exportObject.blur2;
      delete exportObject.blur2;
    }

    exportObject = Object.keys(exportObject)
      .sort()
      .reduce((obj, key) => ((obj[key] = exportObject[key]), obj), {});

    const jsonString = JSON.stringify(exportObject, null, 2);
    await exportJson(jsonString);
    importExportStatus.textContent = `已导出 ${
      Object.keys(exportObject).length
    } 项设置${storageName ? `到${storageName}` : '到文件'}`;
    importExportStatusDetails.textContent = `查看已导出的设置（点击展开）\n\n${Object.keys(
      exportObject
    )
      .map((key) => `${key}: ${JSON.stringify(exportObject[key])}`)
      .join('\n')}`;
  } catch (ex) {
    console.error('导出设置失败', ex);
    importExportStatus.classList.add('has-error');
    importExportStatus.textContent = `导出设置失败：\n${ex?.message}`;
  }
};

const importFileButton = document.querySelector('#importFileBtn');
const importFileInput = document.querySelector('[name="import-settings-file"]');
on(importFileInput, 'change', async () => {
  if (!importFileInput.files.length) return;

  await importSettings('文件', async () => {
    return await new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        on(reader, 'load', (e) => resolve(e.target.result));
        reader.readAsText(importFileInput.files[0]);
      } catch (ex) {
        reject(ex);
      }
      importFileInput.value = '';
    });
  });
});
on(importFileButton, 'click', () => importFileInput.click());

let exportedSettingsLink;
const exportFileButton = document.querySelector('#exportFileBtn');
on(exportFileButton, 'click', async () => {
  await exportSettings('', (jsonString) => {
    const blob = new Blob([jsonString], { type: 'text/plain' });

    const link = (exportedSettingsLink =
      exportedSettingsLink ?? document.createElement('a'));
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'ambient-light-for-youtube-settings.json');
    link.setAttribute(
      'title',
      '如果自动下载被拦截：\n1. 右键点击此链接\n2. 点击“链接另存为...”'
    );
    link.style.display = 'block';
    link.style.marginTop = '0';
    link.style.marginBottom = '4px';
    link.textContent = 'ambient-light-for-youtube-settings.json';
    importExportStatusDetails.parentElement.insertBefore(
      link,
      importExportStatusDetails
    );

    link.click();
  });
});

const importAccountButton = document.querySelector('#importAccountBtn');
on(importAccountButton, 'click', async () => {
  await importSettings('云端', async () => {
    return await syncStorage.get('settings');
  });
});

const exportAccountButton = document.querySelector('#exportAccountBtn');
on(exportAccountButton, 'click', async () => {
  await exportSettings('云端', async (jsonString) => {
    await syncStorage.set('settings', jsonString);
    await syncStorage.set('settings-date', new Date().toJSON());
  });
});

const importableAccountStatus = document.querySelector(
  '#importableAccountStatus'
);
const updateImportableAccountStatus = async () => {
  const jsonString = await syncStorage.get('settings-date');
  if (jsonString) {
    const settingsDate = new Date(jsonString);
    importableAccountStatus.textContent = `最近一次云端导出：${settingsDate.toLocaleString('zh-CN')}`;
    importAccountButton.disabled = false;
  } else {
    importableAccountStatus.textContent = '';
    importAccountButton.disabled = true;
  }
};
updateImportableAccountStatus();

if (chrome?.storage?.sync?.onChanged) {
  syncStorage.addListener(updateImportableAccountStatus);
  on(window, 'beforeunload', () => {
    syncStorage.removeListener(updateImportableAccountStatus);
  });
}
