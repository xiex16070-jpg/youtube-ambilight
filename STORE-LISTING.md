# 商店详情页文案 / Store listing copy

> 上架 Chrome Web Store 与 Microsoft Edge Add-ons 时，把下面 **「作者 / Author」** 两行放在介绍详情页的 **最上方**。
> 截图在 `store/screenshots/`（1280x800，商店要求尺寸），图标用 `src/images/icon-128.png`，宣传图在 `assets/promos/`。

---

## 作者 / Author

**Akari Akaza**
GitHub：<https://github.com/xiex16070-jpg>
仓库 / Repository：<https://github.com/xiex16070-jpg/youtube-ambilight>

---

## 中文（简体）

### 名称 / Name
Ambient light for YouTube™ & Bilibili

### 简短说明 / Short description（不超过 132 字符）
给 YouTube 和 B 站视频加上氛围灯光，无需额外硬件，灯光跟随画面实时变化。

### 分类 / Category
Chrome：Fun　Edge：Entertainment

### 详细说明 / Detailed description

给 YouTube™ 和哔哩哔哩（B 站）的视频加上氛围灯光效果：浏览器会自动取视频画面的颜色，在播放器四周渲染出一圈柔和的动态光晕，不需要灯带、智能灯泡等任何额外硬件。

支持 YouTube 视频页与 B 站视频页（www.bilibili.com/video/*），以及两家的内嵌播放器。

功能：

1. 氛围灯 Ambient light
   - 模糊 blur、扩散 spread
2. 黑边 Black bars
   - 去除黑边 / 去除左右黑边 / 去除彩色边 / 填满屏幕
3. 视频 Video
   - 缩放 size、阴影 shadow
4. 页面内容 Video page content
   - 阴影、滚动到顶时隐藏、影院模式下隐藏、隐藏滚动条
5. 画质 Quality
   - 同步档位（省电 / 均衡 / 高质量 / 完美）
   - 显示帧率、限制帧率、平滑运动
6. 通用 General
   - 关闭时切换浅色主题、启用/禁用、全屏启用

高级选项：边缘大小、淡出起点与曲线、去色带（噪点/抖动）、四方向单独开关、亮度/对比度/饱和度滤镜、黑边检测偏移与手动手动尺寸、仅文字与按钮加阴影、图片透明度等。

B 站适配说明：右侧信息栏（弹幕列表、合集列表）使用半透明卡片，灯光可以透出来，同时文字保持原本的对比度，保证可读性。

隐私与安全：扩展只在 `youtube.com` 与 `bilibili.com` 的视频页面运行；除可关闭的崩溃报告外不发送任何请求，不收集浏览记录。详见隐私政策。

开源：MIT 协议，源码与问题反馈见 https://github.com/xiex16070-jpg/youtube-ambilight（基于 Wessel Kroos 的原项目 https://github.com/WesselKroos/youtube-ambilight 二次开发，感谢原作者）。

---

## English

### Name
Ambient light for YouTube™ & Bilibili

### Short description
Adds ambient light to YouTube and Bilibili videos in your browser, no extra hardware needed.

### Category
Chrome: Fun　Edge: Entertainment

### Detailed description

Surround YouTube™ and Bilibili videos with ambient light inside your browser. No lightstrips or smart lights needed: the extension samples the video and renders a soft, animated glow around the player.

Works on YouTube watch pages, on Bilibili video pages (www.bilibili.com/video/*) and on both embedded players.

Features: ambient light (blur, spread) · black bar removal and fill-to-screen · video scale and shadow · page content shadow and scroll behaviour · quality levels (energy saving / balanced / high / perfect), frame rate limit and motion smoothing · fullscreen support. Advanced: edge size, fade out, debanding, per-edge toggles, brightness/contrast/saturation filters, manual black bar control, text-only shadows and image transparency.

Bilibili specific: the right-hand information column (danmaku list, video collections) uses translucent cards so the light shines through while the text keeps its original contrast and stays readable.

Privacy & Security: the extension only runs on youtube.com and bilibili.com video pages. Except for optional (disable-able) crash reports, no requests are sent to any server.

Open source under the MIT license. Source code and issue tracker: https://github.com/xiex16070-jpg/youtube-ambilight — based on the original project by Wessel Kroos (https://github.com/WesselKroos/youtube-ambilight), with thanks.

---

## 上传清单 / Upload checklist

| 项目 | 位置 / 说明 |
| --- | --- |
| 上传包（Chrome + Edge，MV3） | `npm run package` → `releases/ambient-light-for-youtube-and-bilibili-<version>-chrome-edge-mv3.zip` |
| 上传包（Firefox / 旧版，MV2） | `releases/...-firefox-mv2.zip` |
| 商店图标 128x128 | `src/images/icon-128.png`（Edge 300x300：`assets/icons/icon-300-edge.png`） |
| 截图（1280x800，均为浅色主题） | `store/screenshots/1..4-*.png` |
| 宣传图 / Promo tiles | `assets/promos/promo-tile-1280x640.png`、`promo-tile-440x280` 对应文件 |
| 隐私政策 URL | 把 `PRIVACY-POLICY.md` 发布成可访问的网址（例如 GitHub Pages，或直接用 `https://github.com/xiex16070-jpg/youtube-ambilight/blob/main/PRIVACY-POLICY.md`） |
| 权限理由（单用途说明） | 只申请 `storage`：用于在浏览器本地保存扩展设置，不做任何网络上传 |
| 远程代码声明 | 扩展不加载任何远程代码，所有脚本都打包在扩展内 |
| 开发者账号 | Chrome Web Store 一次性注册费 5 美元；Edge Add-ons 免费（需 Microsoft 账号 + Partner Center） |

### 步骤
1. Chrome Web Store：<https://chrome.google.com/webstore/devconsole> → 新增项目 → 上传 mv3 zip → 填写「商品详情」（上面中文/英文文案）→ 上传截图/图标 → 填隐私（单用途、权限理由、数据用途）→ 提交审核。
2. Microsoft Edge Add-ons：<https://partner.microsoft.com/dashboard/microsoftedge> → 新建扩展 → 上传同一个 mv3 zip → 填写详情与隐私 → 提交。
3. 版本号在 `package.json` 的 `version`（当前 2.38.17）；每次提交商店都要递增版本号。
