# 性能问题排查

本指南用于排查氛围灯导致的高 CPU／GPU 占用、视频卡顿或掉帧。建议先调整扩展设置，再检查浏览器和显卡配置。

## 排查前

1. 暂时停用其他扩展，确认是否存在冲突。也可以在无痕窗口中只启用本扩展进行测试。
2. 确认设备配有集成或独立显卡，并在浏览器中启用硬件加速。没有硬件加速时，氛围灯效果可能无法流畅运行。
3. 浏览器或显卡驱动更新后才出现的问题，可能是已知兼容性问题。请先查看本指南的[已知问题与解决方法](#已知问题与解决方法)。

## 扩展设置

### 快速调整

打开播放器的氛围灯菜单，点击右上角的重置按钮，再调整以下项目：

- 画质与性能 > 帧率上限：`30`
- 画质与性能 > WebGL 渲染器：开启
- 画质与性能 > 分辨率：`25%`

将帧率限制为 30 可降低 GPU 占用，尤其适合观看 60 fps 视频时使用。

### 手动调整

如果不想重置已有设置，可从以下值开始，再逐项提高画质，找到设备能够稳定运行的上限：

- 设置 > 高级选项：开启
- 画质与性能 > 同步方式：视频帧率（Firefox 可选择解码帧率）
- 画质与性能 > 帧率上限：`30`
- 画质与性能 > WebGL 渲染器：开启；若该选项不可用，请先在浏览器中启用 WebGL
- 画质与性能 > 分辨率：`25%`
- 视频 > 让视频与氛围灯同步：关闭
- 氛围灯 > 平滑运动（帧混合）：关闭
- 页面内容 > 仅为文字和按钮添加阴影：开启
- 视频 > 阴影大小：`0%`
- 去除黑边和彩边 > 去除上下黑边、去除左右黑边：关闭
- 氛围灯 > 模糊、扩散：均设为 `30%` 或更低

## 浏览器设置

流畅运行氛围灯需要显卡硬件加速。不同浏览器的设置位置可能略有变化。

### Chrome、Edge、Opera、Vivaldi

1. 打开 `chrome://settings/system`，确认已开启“使用图形加速功能（如果可用）”。Edge、Opera 和 Vivaldi 可分别使用 `edge://settings/system`、`opera://settings/system` 或 `vivaldi://settings/system`。
2. 打开 `chrome://gpu`，确认浏览器识别到了显卡。查看 `GL_RENDERER` 后面的显卡名称。
3. 在同一页面确认 Canvas、合成、光栅化、视频解码、WebGL 和 WebGL2 等项目显示为硬件加速或已启用。

若浏览器没有识别显卡，请检查硬件加速设置，或在显卡控制面板、Windows 图形设置中为浏览器指定显卡。可参考 [NVIDIA](https://nvidia.custhelp.com/app/answers/detail/a_id/5035/kw/preferred)、[AMD／Intel 可切换显卡](https://www.amd.com/en/support/kb/faq/dh-017)或 [Windows 图形设置](https://www.amd.com/en/support/kb/faq/gpu-110#faq-Customizing-Graphics-Performance-Preference-for-a-Desktop-App)说明。

部分功能也可通过 `chrome://flags` 调整。不过启用实验性标记可能导致浏览器崩溃；如遇到问题，可使用 `--no-experiments` 启动 Chrome，或恢复相关标记的默认值。

### Firefox

1. 打开 `about:preferences`，滚动到“性能”。取消“使用推荐的性能设置”，并确认已勾选“使用硬件加速（如果可用）”。如果该选项原本已开启，可以重新启用推荐设置。
2. 打开 `about:support#graphics-gpu-1-tbody`，确认 GPU #1 显示为活动状态，并且描述中列出了你的显卡。
3. 打开 `about:support#graphics`，检查合成器及 WebGL 1／2 驱动渲染器是否使用显卡。
4. 如果需要排查高级图形设置，可在 `about:config` 中检查 `gfx.webrender.all`、`gfx.webrender.compositor`、`gfx.webrender.compositor.force-enabled`、`gfx.webrender.enabled` 和 `gfx.webrender.force-angle`。

## 已知问题与解决方法

### 同时打开两个浏览器窗口时视频卡顿或冻结

部分 Chromium 浏览器和硬件组合会在另一个可见窗口运行动画时影响视频播放。可以尝试：

1. 打开 `chrome://flags`、`edge://flags` 或对应浏览器的 flags 页面。
2. 搜索 `Hardware-accelerated video decode`（标记名 `#disable-accelerated-video-decode`）。
3. 将该标记设为 Disabled，然后重启浏览器。

如果问题因此消失，说明你可能遇到了 [Chromium 问题 1461254](https://bugs.chromium.org/p/chromium/issues/detail?id=1461254)。

### 4K 或更高分辨率、50／60 fps 视频掉帧

如果使用 Windows 和 NVIDIA 显卡，请先确认浏览器使用 NVIDIA GPU 进行视频解码。可以在任务管理器的“性能 > GPU > 视频解码”中检查。

如果仍有卡顿，可在 NVIDIA 控制面板的“管理 3D 设置”中，将对应浏览器的“电源管理模式”设为“最高性能”，然后重启电脑并播放 4K 60 fps 视频进行检查。这可能与 [Chromium 问题 1431590](https://bugs.chromium.org/p/chromium/issues/detail?id=1431590) 有关。

如果电脑有多块显卡，可在 Windows 图形设置中逐一指定浏览器使用的显卡，比较哪一块运行更稳定。Chromium 浏览器也可以在 `chrome://flags/#use-angle` 中尝试不同图形后端；每次更改后都应确认网页和视频能够正常显示。

<a id="nvidia-rtx-video-vsr"></a>

### NVIDIA RTX 视频超分辨率（VSR）或 RTX Video HDR 无法使用

1. 打开氛围灯设置并开启“高级选项”。
2. 关闭“视频 > 视频画面异常修复”。
3. 将“视频 > 去色带（噪点）”设为 `0%`，或将“画质与性能 > 去色带模式”设为“LCD（普通）”。OLED 叠加模式与视频去色带效果可能和 RTX VSR 不兼容。
4. 完成检查后，可以再次关闭“高级选项”。

Firefox 在去除视频黑边时会停用 RTX VSR／HDR，因为视频变换会关闭 Windows 多平面覆盖（MPO）。如果启用视频画面异常修复，MPO 也会停用。部分设备在启用 MPO 时可能出现黑白方块、缩放异常或黑线，相关报告见 [Chromium 1155285](https://bugs.chromium.org/p/chromium/issues/detail?id=1155285)、[Chromium 338237034](https://issues.chromium.org/issues/338237034)、[Chromium 40228515](https://issues.chromium.org/issues/40228515) 和 [Firefox 238](https://github.com/WesselKroos/youtube-ambilight/issues/238)。

## 仍需帮助？

- Firefox 问题：[提交 Firefox Bug](https://bugzilla.mozilla.org/enter_bug.cgi)
- Chrome、Edge、Opera、Vivaldi 问题：[提交 Chromium Bug](https://bugs.chromium.org/p/chromium/issues/wizard)
- 扩展问题或性能求助：[GitHub Issues](https://github.com/xiex16070-jpg/youtube-ambilight/issues)
