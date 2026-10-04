# Edge Add-ons 上架逐步填写指引

> 目标：把本仓库的扩展上架到 Microsoft Edge 加载项商店。
> **唯一上传文件**：`releases/ambient-light-for-youtube-and-bilibili-2.38.17-chrome-edge-mv3.zip`
> （在仓库根目录的 `releases/` 下；也可从 GitHub Release v2.38.17 的附件下载同名文件）

## 0. 这个包为什么能直接传（自检结果）

| 商店要求 | 本包状态 |
| --- | --- |
| MV3、zip 根目录有 manifest.json | ✅ manifest_version 3，23 条记录（20 文件 + 3 目录项） |
| 128x128 图标 | ✅ manifest `icons.128 = images/icon-128.png` |
| 权限最小化 | ✅ 只申请 `storage` |
| 无远程代码 | ✅ 所有脚本本地打包（Sentry SDK 也是 bundled；上报已禁用，DSN 为空） |
| 无混淆代码 | ✅ rollup 未压缩 |
| 无 sourcemap | ✅ 0 个 `.map` |
| 详情说明 ≥250 字符 | ✅ 中文 827 字符 / 英文 1359 字符 |
| 截图尺寸 640x480 或 1280x800 | ✅ 4 张 1280x800 |
| 数据收集 | ✅ 无（崩溃上报已禁用，选项页也不再提供崩溃报告选项） |

## 1. 注册开发者账号（一次性，免费）

1. 打开 <https://partner.microsoft.com/dashboard/microsoftedge>，用任意 Microsoft 账号登录（没有就现场用邮箱或 GitHub 注册一个）。
2. 首次进入会要求创建开发者账号：
   - **Account country/region**：选所在地（**提交后不可修改**）。
   - **Account type**：选 **Individual**（个人即可，免费，无需企业资质；**提交后不可修改**）。
   - **Publisher display name**（≤50 字符，会公开显示）：`Akari Akaza`。
3. 勾选接受 Microsoft Store App Developer Agreement，提交。

## 2. 新建扩展并上传

1. Partner Center → **Microsoft Edge** → **New extension**（新建扩展）。
2. 把 `ambient-light-for-youtube-and-bilibili-2.38.17-chrome-edge-mv3.zip` 拖进去（**不要解压**）。
3. 等 Package validation 跑完（应无 error）→ **Continue**。

## 3. Availability（可用性）

- Visibility：**Public**
- Markets：保持 **All**（默认全选）

## 4. Properties（属性）

| 字段 | 填法 |
| --- | --- |
| Category | **Entertainment**（必填） |
| Website | `https://github.com/xiex16070-jpg/youtube-ambilight`（可选） |
| Support contact detail | `https://github.com/xiex16070-jpg/youtube-ambilight/issues` |
| Mature content | 不勾 |

## 5. Privacy（隐私）——照抄

**Single purpose description**

```text
Renders an ambient light effect around the video player on YouTube and Bilibili, based on the colours of the video.
```

**Permission justification**（只需要为 `storage` 写理由）

```text
storage: Required to save the extension's own settings (ambient light options) locally in the browser. No data leaves the device and no network requests are made.
```

**Are you using remote code?** → 选 **No, I am not using remote code**

**Data usage（是否收集用户数据）** → 全部选 **No**（本版本已禁用崩溃上报，无统计、无网络请求）

**Certification checkboxes** → 全部勾选（声明以上属实、遵守开发者政策）

**Privacy policy URL**

```text
https://github.com/xiex16070-jpg/youtube-ambilight/blob/main/PRIVACY-POLICY.md
```

## 6. Store listing（商店详情）

> Extension name 与 Short description 由 manifest 决定，商店里只读（当前：`Ambient light for YouTube™ & Bilibili` / `Immerse yourself in YouTube™ and Bilibili videos with ambient light!`）。要改必须改 `src/manifest.json` 后重新打包。

| 字段 | 值 / 文件 |
| --- | --- |
| Description（≥250 字符） | 复制 `STORE-LISTING.md` 里「详细说明 / Detailed description」整段 |
| Extension logo（1:1，300x300） | `assets/icons/icon-300-edge.png` |
| Small promo tile（440x280） | `assets/promos/promo-tile-280.png` |
| Large promo tile（1400x560） | `assets/promos/promo-tile-1400x560.png` |
| Screenshots（1280x800，≤6 张） | `store/screenshots/1-bilibili-video-page.png`、`2-settings-menu.png`、`3-mini-player.png`、`4-options-page.png` |
| Search terms（≤7 个词） | `ambient light`、`bilibili`、`youtube`、`ambient`、`glow`、`danmaku`、`氛围灯` |
| Video URL | 留空 |

## 7. Notes for certification（给审核员）

```text
No test account is required.

1. Open a video page, for example https://www.bilibili.com/video/BV1GJ411x7h7/ or https://www.youtube.com/watch?v=dQw4w9WgXcQ
2. Play the video. Within about 2 seconds an ambient light glow is rendered around the player.
3. A settings button is added at the bottom-right corner of the player; clicking it opens the settings panel.
4. The glow follows the video colours in real time and no network requests are made.
```

## 8. 提交与后续

- 点 **Publish** → 审核一般 ≤7 个工作日，结果发到账号邮箱（Partner Center 里也能看状态）。
- 通过后商店地址形如 `https://microsoftedge.microsoft.com/addons/detail/<扩展ID>`。
- **每次更新都要把 `package.json` 的 `version` 递增**，再跑 `npm run package` 并上传新 zip。

## 9. 可能的驳回点与对策

| 风险 | 对策 |
| --- | --- |
| 名称与原扩展相似（开发者政策 1.1.2 / 1.2 同功能重复） | 若被拒：在 Description 第一行加 `Unofficial community fork with added Bilibili support.`，或改名后重新打包 |
| 隐私答案与实际行为不符 | 本包已禁用崩溃上报并移除选项页的崩溃报告 UI，如实全部选 No 即可 |
| 截图尺寸不符 | 已全部为 1280x800，勿再裁剪 |
| 被质疑远程代码 | 无远程脚本，Sentry SDK 已打包进扩展，选 No 即可 |
