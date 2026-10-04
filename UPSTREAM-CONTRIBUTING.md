# 上游贡献与分支说明 / Upstream contribution notes

本仓库是 [WesselKroos/youtube-ambilight](https://github.com/WesselKroos/youtube-ambilight) 的分支（fork），在原版基础上加入了 **哔哩哔哩（bilibili）支持**、**Manifest V3 构建** 与商店打包流程。

## 上游的贡献要求（核对结果）

| 项目 | 情况 |
| --- | --- |
| `CONTRIBUTING.md` | **不存在**（`master`、`develop`、`.github/` 下均为 404） |
| PR 模板 / `CODE_OF_CONDUCT.md` | 不存在 |
| CLA / DCO | 无要求 |
| 唯一的贡献指引 | README「Report, request or contribute」段落，指向仓库首页与 `/issues` |
| 默认分支 | `develop`（不是 `master`） |
| 分支命名习惯 | `feature/<slug>`（仓库里已有 `feature/manifest-v3`、`feature/context-menu-donation` 等） |
| 提交信息习惯 | 单行祈使句，例如 `Malformed manifest` |
| 许可证 | MIT，`Copyright (c) 2017 Wessel Kroos` —— 允许分支、修改、再发布（含上架商店），**必须保留版权与许可声明** |
| 上游当前状态 | `develop` 已经是 **Manifest V3**（`minimum_chrome_version: 121`），但 content script 只覆盖 YouTube，没有 bilibili |

## 能不能成为上游贡献者？

- **不能直接推送**：你对上游仓库没有写权限，任何改动都必须走「fork → 分支 → Pull Request」。
- **可以提 PR**：流程本身没有门槛（无 CLA、无 DCO、无模板），但要让 PR 被合并，需要把改动切小、切干净，并且上游作者对「bilibili 支持」这件事本身有兴趣。
- 建议的 PR 切分方式（一次一个主题）：
  1. `feature/bilibili-support` —— 只包含 bilibili 的 content script 条目、`src/styles/content.scss` 里的 bilibili 块、以及识别 bilibili 平台所需的 JS 改动；不要带品牌、README、打包脚本。
  2. `feature/manifest-v3-bilibili` —— 如果需要，在上游已经 MV3 的基础上补 bilibili 的 `web_accessible_resources` 匹配。
  3. 品牌/README/打包属于**本分支特有**，不要提交给上游。
- 上游作者没有回复或不接受时，就保持本仓库作为独立分支（这正是当前状态）。

## 本地的发布准备（尚未推送）

```bash
# 目前状态：已 git init，已提交，已配置好 origin / upstream，但没有 push
git remote -v          # origin = 你的 fork（GitHub 上还没创建），upstream = 上游
git log --oneline      # 初始提交
```

想发布时按顺序执行：

1. 在 GitHub 网页上创建空仓库 `xiex16070-jpg/youtube-ambilight`（**不要**勾选 README / .gitignore / license，避免与本地历史冲突）。
2. 推送本地历史：
   ```bash
   git push -u origin main
   ```
3. 想向上游提 PR 时，先同步上游（可选）：
   ```bash
   git fetch upstream
   git checkout -b feature/bilibili-support upstream/develop
   ```
   把 bilibili 相关改动挑到这个分支上，推到自己的 fork，然后在 GitHub 上对着 `WesselKroos:develop` 开 Pull Request。

## 版本与商店

- 版本号来自 `package.json`（当前 `2.38.17`），`manifest-copy.js` 在构建时写入 `dist/manifest.json`；每次提交商店都需要提升版本号。
- 商店上传包：`npm run package` → `releases/ambient-light-for-youtube-and-bilibili-<版本>-chrome-edge-mv3.zip`（Chrome / Edge 用）与 `...-firefox-mv2.zip`（Firefox / 旧版 Chromium 用）。
- 上架文案见 `STORE-LISTING.md`。
