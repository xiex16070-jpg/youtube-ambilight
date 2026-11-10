import { supportsColorMix, supportsWebGL } from './generic';
import { isBilibiliPlatform } from './platform';
import { getBrowser } from './utils';

const SettingsConfig = [
  {
    type: 'section',
    label: '设置',
    name: 'sectionSettingsCollapsed',
    default: true,
  },
  {
    name: 'advancedSettings',
    label: '高级选项',
    type: 'checkbox',
    default: false,
  },
  {
    type: 'section',
    label: '统计信息',
    name: 'sectionStatsCollapsed',
    default: true,
    advanced: true,
  },
  {
    name: 'showFPS',
    label: '帧率',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'showFrametimes',
    label: '帧耗时图表',
    description: '占用 CPU 资源',
    questionMark: {
      title:
        'The measured display framerate is not a reflection of the real performance.\nBecause the measurement uses an extra percentage of CPU usage.\nHowever, this statistic could be helpful to debug other issues.',
    },
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'showResolutions',
    label: '分辨率与绘制耗时',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'showBarDetectionStats',
    label: '黑边检测',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    type: 'section',
    label: '画质与性能',
    name: 'sectionQualityPerformanceCollapsed',
    default: true,
  },
  {
    name: 'webGL',
    label: 'WebGL 渲染器（更省资源）',
    description: '更改后会重新加载网页',
    type: 'checkbox',
    default: true,
  },
  {
    name: 'resolution',
    label: '分辨率',
    type: 'list',
    default: 100,
    unit: '%',
    valuePoints: (() => {
      const points = [6.25];
      while (points[points.length - 1] < 400) {
        points.push(points[points.length - 1] * 2);
      }
      return points;
    })(),
    manualinput: false,
  },
  {
    name: 'framerateLimit',
    label: '帧率上限（每秒帧数）',
    type: 'list',
    default: 60,
    min: 0,
    max: 60,
    step: 1,
  },
  {
    name: 'frameSync',
    label: '同步方式',
    questionMark: {
      title:
        'How much energy will be spent on sychronising ambient light frames with video frames.\n\nDecoded framerate: Lowest CPU & GPU usage.\nMight result in dropped and delayed frames.\n\nDisplay framerate: Highest CPU & GPU usage.\nMight still result in delayed frames on high refreshrate monitors (120hz and higher) and higher than 1080p videos.\n\nVideo framerate: Lowest CPU & GPU usage.\nUses the newest browser technology to always keep the frames in sync.',
    },
    type: 'list',
    default: 2,
    min: 0,
    max: 2,
    step: 1,
    snapPoints: [
      { value: 0, label: '解码帧率' },
      { value: 1, label: '显示帧率' },
      { value: 2, label: '视频帧率' },
    ],
    manualinput: false,
    advanced: true,
    experimental: true,
  },
  {
    name: 'energySaver',
    label: '静止画面时节能',
    questionMark: {
      title:
        'Limits the framerate on videos with an (almost) static image\n\nStill image: 1 frame per 5 seconds\nSmall movements: 1 frame per second',
    },
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'prioritizePageLoadSpeed',
    label: '优先保证网页加载速度',
    description: '网页加载完成后再启动氛围灯',
    type: 'checkbox',
    default: true,
  },
  {
    name: 'layoutPerformanceImprovements',
    label: '改善 YouTube 页面响应',
    description: '提升网页交互流畅度',
    questionMark: {
      title: `Some of the improvements on the /watch page include:
- Faster webpage resizing and scrolling (Most noticeable after you've loaded in more than 100 comments)
- Faster loadingtimes for comments and/or related videos
- Smoother timeline scrubbing (Most noticeable after you've loaded in more than 100 comments or with a livestream chat window open)
- Smoother livestream chat scrolling (and new messages will be appended quicker to the chat)
- Smoother playlist scrolling (Most noticeable in a playlist with more than 25 videos)
- Smoother dragging/re-ordering videos in a playlist (Most noticeable in a playlist with more than 25 videos)`,
    },
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'debandingBlendMode',
    label: '去色带模式',
    questionMark: {
      title:
        "The normal blend mode is usefull to fix banding in dark colors on LCD's.\nBut on OLED's it's better to use the \"overlay\" blend mode to retain pure blacks.",
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 1,
    step: 1,
    snapPoints: [
      { value: 0, label: 'LCD（普通）' },
      { value: 1, label: 'OLED（叠加）' },
    ],
    manualinput: false,
    advanced: true,
    new: true,
  },
  {
    type: 'section',
    label: '页面顶部',
    name: 'sectionOtherPageHeaderCollapsed',
    default: true,
  },
  {
    name: 'headerShadowSize',
    label: '阴影大小',
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'headerShadowOpacity',
    label: '阴影不透明度',
    type: 'list',
    default: 30,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'headerImagesOpacity',
    label: '图片不透明度',
    type: 'list',
    default: 100,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'headerFillOpacity',
    label: '背景不透明度',
    description: '仅在向下滚动后生效',
    type: 'list',
    default: 100,
    min: -100,
    max: 100,
    step: 0.1,
    advanced: true,
  },

  {
    type: 'section',
    label: '页面内容',
    name: 'sectionOtherPageContentCollapsed',
    default: true,
  },
  {
    name: 'surroundingContentShadowSize',
    label: '阴影大小',
    type: 'list',
    default: 15,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'surroundingContentShadowOpacity',
    label: '阴影不透明度',
    type: 'list',
    default: 30,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'surroundingContentTextAndBtnOnly',
    label: '仅为文字和按钮添加阴影',
    description: '减少滚动卡顿和视频掉帧',
    type: 'checkbox',
    advanced: true,
    default: true,
  },
  {
    name: 'surroundingContentImagesOpacity',
    label: '图片不透明度',
    type: 'list',
    default: 100,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'surroundingContentFillOpacity',
    label: '按钮和卡片背景不透明度',
    type: 'list',
    default: 10,
    min: -100,
    max: 100,
    step: 0.1,
  },
  {
    name: 'pageBackgroundGreyness',
    label: '背景灰度',
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'immersiveTheaterView',
    label: '影院模式下隐藏页面内容',
    type: 'checkbox',
    default: false,
  },
  {
    name: 'relatedScrollbar',
    label: '将相关推荐改为可滚动列表',
    description: '同时改善评论区滚动体验',
    type: 'checkbox',
    advanced: true,
    default: false,
  },
  {
    name: 'hideScrollbar',
    label: '隐藏滚动条',
    type: 'checkbox',
    advanced: true,
    default: false,
  },
  {
    type: 'section',
    label: '视频',
    name: 'sectionVideoResizingCollapsed',
    default: true,
  },
  {
    name: 'videoScale.SMALL',
    label: '小窗模式下的大小',
    type: 'list',
    default: 100,
    min: 25,
    max: 200,
    step: 0.1,
    new: true,
  },
  {
    name: 'videoScale.THEATER',
    label: '影院模式下的大小',
    type: 'list',
    default: 100,
    min: 25,
    max: 200,
    step: 0.1,
    new: true,
  },
  {
    name: 'videoScale.FULLSCREEN',
    label: '全屏模式下的大小',
    type: 'list',
    default: 100,
    min: 25,
    max: 200,
    step: 0.1,
    new: true,
  },
  {
    name: 'videoShadowSize',
    label: '阴影大小',
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'videoShadowOpacity',
    label: '阴影不透明度',
    type: 'list',
    default: 50,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'videoDebandingStrength',
    label: '去色带（噪点）',
    questionMark: {
      title:
        'Click for more information about debanding (noise /dithering).\nTip: Change the "Quality > Optimize debanding for" setting to "OLED" to retain pure blacks on OLED displays.',
      href: 'https://www.lifewire.com/what-is-dithering-4686105',
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    advanced: true,
  },
  {
    name: 'videoOverlayEnabled',
    label: '让视频与氛围灯同步',
    questionMark: {
      title:
        'Delays the video frames according to the ambient light frametimes.\nThis makes sure that that the ambient light is never out of sync with the video,\nbut it can introduce stuttering and/or dropped frames.',
    },
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'videoOverlaySyncThreshold',
    label: '视频同步停用阈值',
    description: '丢帧比例达到此值时停用',
    type: 'list',
    default: 5,
    min: 1,
    max: 100,
    step: 1,
    advanced: true,
  },
  {
    name: 'chromiumBugVideoJitterWorkaround',
    label: '视频抖动修复',
    description: '增加 CPU 和 GPU 占用',
    questionMark: {
      title:
        'Chromium has a bug that jitters the video playback when your display \nhas a higher framerate than 60Hz. This workaround prevents the jittering \nby forcing the browser to run at the framerate of your display instead. \nClick the questionmark for more information about this bug in Chromium browsers.',
      href: 'https://github.com/WesselKroos/youtube-ambilight/issues/166',
    },
    type: 'checkbox',
    default: false, // Should not be enabled by default because it also adds CPU & GPU overhead on 60Hz displays. (60Hz+ detection keeps toggling between off/on when VRR is enabled in the OS.)
    advanced: true,
  },
  {
    name: 'chromiumDirectVideoOverlayWorkaround',
    label: '视频画面异常修复',
    description: '使用 NVIDIA RTX 视频超分辨率（VSR）时必须关闭此选项',
    questionMark: {
      title: `This workaround can fix several artifacts/bugs,
when videos are in hardware accelerated overlays (MPO).
Examples are: random black/white squares, flickering or a squeezed video.

Click on the questionmark for more and updated information about these artifacts/bugs.`,
      href: 'https://github.com/xiex16070-jpg/youtube-ambilight/blob/main/TROUBLESHOOT.zh-CN.md#nvidia-rtx-video-vsr',
    },
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    type: 'section',
    label: '去除黑边和彩边',
    name: 'sectionHorizontalBarsCollapsed',
    default: true,
  },
  {
    name: 'detectHorizontalBarSizeEnabled',
    label: '去除上下黑边',
    description: '占用 CPU 资源',
    type: 'checkbox',
    default: false,
    defaultKey: 'B',
  },
  {
    name: 'detectVerticalBarSizeEnabled',
    label: '去除左右黑边',
    description: '占用 CPU 资源',
    type: 'checkbox',
    default: false,
    defaultKey: 'V',
  },
  {
    name: 'detectColoredHorizontalBarSizeEnabled',
    label: '检测并去除彩边',
    type: 'checkbox',
    default: false,
  },
  {
    name: 'detectHorizontalBarSizeOffsetPercentage',
    label: '检测偏移量',
    type: 'list',
    default: 0,
    min: -5,
    max: 5,
    step: 0.1,
    advanced: true,
  },
  {
    name: 'barSizeDetectionAverageHistorySize',
    label: '检测：参与平均的帧数',
    questionMark: {
      title:
        'The amount of video frames to detect an average bar size from. \nA lower amount of frames results in a faster detection, \nbut does also increase the amount of inaccurate detections.',
    },
    type: 'list',
    default: 4,
    min: 1,
    max: 30,
    step: 1,
    advanced: true,
  },
  {
    name: 'barSizeDetectionAllowedElementsPercentage',
    label: '检测：置信度阈值',
    questionMark: {
      title:
        'At 10% only clear bars are removed.\nA higher percentage can also remove bars with some elements.\nAnd an even higher percentage can crop to a squared element in the center.',
    },
    type: 'list',
    default: 20,
    min: 10,
    max: 90,
    step: 10,
    // advanced: true,
  },
  {
    name: 'barSizeDetectionAllowedUnevenBarsPercentage',
    label: '检测：不对称阈值',
    questionMark: {
      title:
        'Higher percentages detect a more uneven bar.\nFor example: A bar is uneven when the top bar is smaller than the bottem bar.\nBut with a high percentage you also increase the risk that straight objects or lines are seen as bars.',
    },
    type: 'list',
    default: 10,
    min: 1,
    max: 50,
    step: 1,
    advanced: true,
    new: true,
  },
  {
    name: 'horizontalBarsClipPercentage',
    label: '上下黑边尺寸',
    type: 'list',
    default: 0,
    min: 0,
    max: 40,
    step: 0.1,
    snapPoints: [
      { value: 8.7, label: 8 },
      { value: 12.3, label: 12, flip: true },
      { value: 13.5, label: 13 },
    ],
    advanced: true,
  },
  {
    name: 'verticalBarsClipPercentage',
    label: '左右黑边尺寸',
    type: 'list',
    default: 0,
    min: 0,
    max: 40,
    step: 0.1,
    advanced: true,
  },
  {
    name: 'horizontalBarsClipPercentageReset',
    label: '切换视频时重置黑边尺寸',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'detectVideoFillScaleEnabled',
    label: '将视频画面扩展至去除的黑边区域',
    type: 'checkbox',
    default: false,
    defaultKey: 'H',
  },
  {
    type: 'section',
    label: '滤镜',
    name: 'sectionImageAdjustmentCollapsed',
    default: true,
  },
  {
    name: 'brightness',
    label: '亮度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
  },
  {
    name: 'contrast',
    label: '对比度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
    advanced: true,
  },
  {
    name: 'vibrance',
    label: '色彩强度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 0.1,
  },
  {
    name: 'saturation',
    label: '饱和度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
  },
  {
    type: 'section',
    label: 'HDR 滤镜',
    name: 'sectionHdrImageAdjustmentCollapsed',
    default: false,
    hdr: true,
  },
  {
    name: 'hdrBrightness',
    label: '亮度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
    hdr: true,
  },
  {
    name: 'hdrContrast',
    label: '对比度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
    hdr: true,
  },
  {
    name: 'hdrSaturation',
    label: '饱和度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
    hdr: true,
  },
  {
    type: 'section',
    label: '灯光方向',
    name: 'sectionDirectionsCollapsed',
    default: true,
    advanced: true,
  },
  {
    name: 'directionTopEnabled',
    label: '上方',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'directionRightEnabled',
    label: '右侧',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'directionBottomEnabled',
    label: '下方',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'directionLeftEnabled',
    label: '左侧',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    type: 'section',
    label: '氛围灯',
    name: 'sectionAmbientlightCollapsed',
    default: false,
  },
  {
    name: 'blur2',
    label: '模糊',
    description: '占用 GPU 显存',
    type: 'list',
    default: 30,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'edge',
    label: '边缘宽度',
    description: '将模糊设为 0% 可更清楚地观察变化',
    type: 'list',
    default: 12,
    min: 2,
    max: 50,
    step: 0.1,
    advanced: true,
  },
  {
    name: 'spread',
    label: '扩散',
    description: '占用 GPU 资源',
    type: 'list',
    default: 17,
    min: 0,
    max: 400,
    step: 0.1,
  },
  {
    name: 'spreadFadeStart',
    label: '扩散淡出起点',
    type: 'list',
    default: 15,
    min: -50,
    max: 100,
    step: 0.1,
    advanced: true,
  },
  {
    name: 'spreadFadeCurve',
    label: '扩散淡出曲线',
    description: '将模糊设为 0% 可更清楚地观察变化',
    type: 'list',
    default: 35,
    min: 1,
    max: 100,
    step: 1,
    advanced: true,
  },
  {
    name: 'debandingStrength',
    label: '去色带（噪点）',
    questionMark: {
      title:
        'Click for more information about (noise /dithering).\nTip: Change the "Quality > Optimize debanding for" setting to "OLED" to retain pure blacks on OLED displays.',
      href: 'https://www.lifewire.com/what-is-dithering-4686105',
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    advanced: true,
  },
  {
    name: 'frameFading',
    label: '渐变时长',
    description: '占用 GPU 显存',
    questionMark: {
      title: '氛围灯变化之间的渐变时长',
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 21.2, // 15 seconds
    step: 0.02,
    manualinput: false,
  },
  {
    name: 'flickerReduction',
    label: '减少闪烁',
    questionMark: {
      title:
        'Reduces flickering by limiting the speed at which brightness changes in the ambient light',
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    manualinput: false,
    advanced: true,
  },
  {
    name: 'frameBlending',
    label: '平滑运动（帧混合）',
    questionMark: {
      title: '点击了解帧混合的更多信息',
      href: 'https://www.youtube.com/watch?v=m_wfO4fvH8M&t=81s',
    },
    description: '占用 GPU 资源，也可与“视频同步”配合使用',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'frameBlendingSmoothness',
    label: '平滑运动强度',
    type: 'list',
    default: 80,
    min: 0,
    max: 100,
    step: 1,
    advanced: true,
  },
  {
    name: 'fixedPosition',
    label: '固定位置',
    description: '不随网页滚动位置移动',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    type: 'section',
    label: '显示模式',
    name: 'sectionViewsCollapsed',
    default: false,
  },
  {
    name: 'enableInViews',
    label: '启用的布局模式',
    type: 'list',
    manualinput: false,
    default: 0,
    min: 0,
    max: 5,
    step: 1,
    snapPoints: [
      { value: 0, label: '全部' },
      { value: 1, label: '小窗' },
      { value: 2, hiddenLabel: '小窗和影院' },
      { value: 3, label: '影院' },
      { value: 4, hiddenLabel: '影院和全屏' },
      { value: 5, label: '全屏' },
    ],
  },
  {
    name: 'enableInPictureInPicture',
    label: '画中画',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'enableInEmbed',
    label: '嵌入式视频',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'enableInVRVideos',
    label: 'VR／360° 视频',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    type: 'section',
    label: '常规',
    name: 'sectionGeneralCollapsed',
    default: false,
  },
  {
    name: 'theme',
    label: '外观主题',
    type: 'list',
    manualinput: false,
    default: 1,
    min: -1,
    max: 1,
    step: 1,
    snapPoints: [
      { value: -1, label: '浅色' },
      { value: 0, label: '跟随浏览器' },
      { value: 1, label: '深色' },
    ],
  },
  {
    name: 'enabled',
    label: '启用氛围灯',
    type: 'checkbox',
    default: true,
    defaultKey: 'G',
  },
];

const localizedSettingHelp = {
  showFrametimes:
    '测得的显示帧率不代表真实性能，因为测量会额外占用 CPU。\n这项数据可用于排查其他问题。',
  frameSync:
    '用于让氛围灯帧与视频帧保持同步的资源消耗。\n\n解码帧率：CPU 和 GPU 占用最低，但可能丢帧或延迟。\n\n显示帧率：CPU 和 GPU 占用最高；在 120 Hz 及以上的高刷新率显示器或高于 1080p 的视频中仍可能延迟。\n\n视频帧率：CPU 和 GPU 占用较低，使用较新的浏览器技术保持帧同步。',
  energySaver:
    '画面基本静止时降低氛围灯帧率。\n\n静止画面：每 5 秒 1 帧\n轻微运动：每秒 1 帧',
  layoutPerformanceImprovements:
    '在 /watch 页面提供以下优化：\n- 更快地调整网页大小和滚动（加载超过 100 条评论后更明显）\n- 更快加载评论和相关推荐\n- 拖动视频进度条时更流畅（评论超过 100 条或打开直播聊天窗口时更明显）\n- 更流畅地滚动直播聊天，消息也会更快显示\n- 更流畅地滚动播放列表（列表超过 25 个视频时更明显）\n- 更流畅地拖动或重新排列播放列表中的视频（列表超过 25 个视频时更明显）',
  debandingBlendMode:
    '普通混合模式可改善 LCD 屏幕暗部的色带。\nOLED 屏幕建议使用“叠加”模式，以保留纯黑。',
  videoDebandingStrength:
    '点击了解去色带（噪点／抖动）的更多信息。\n提示：将“画质与性能 > 去色带模式”设为“OLED”，可在 OLED 屏幕上保留纯黑。',
  videoOverlayEnabled:
    '根据氛围灯的帧耗时延迟视频帧，确保氛围灯始终与视频同步；但可能造成卡顿或丢帧。',
  chromiumBugVideoJitterWorkaround:
    'Chromium 存在一项问题：显示器刷新率高于 60 Hz 时，视频播放可能抖动。此选项会让浏览器按显示器刷新率运行，以缓解抖动。\n点击问号查看相关问题。',
  chromiumDirectVideoOverlayWorkaround:
    '此选项可修复视频使用硬件加速覆盖（MPO）时出现的多种画面异常，例如随机黑白方块、闪烁或画面被挤压。\n\n点击问号查看这些问题的最新信息。',
  barSizeDetectionAverageHistorySize:
    '用于计算黑边平均尺寸的视频帧数量。\n帧数越少，检测越快，但误判也会增加。',
  barSizeDetectionAllowedElementsPercentage:
    '设为 10% 时只会去除明显的黑边。\n阈值越高，越可能去除带有少量画面内容的边缘；过高时可能会裁切至中央的方形画面。',
  barSizeDetectionAllowedUnevenBarsPercentage:
    '阈值越高，越容易识别尺寸不一致的黑边。\n例如，上方黑边短于下方黑边时，两侧黑边就不对称。\n阈值过高也会增加将直线或物体误判为黑边的风险。',
  debandingStrength:
    '点击了解去色带（噪点／抖动）的更多信息。\n提示：将“画质与性能 > 去色带模式”设为“OLED”，可在 OLED 屏幕上保留纯黑。',
  flickerReduction: '限制氛围灯亮度变化速度，以减少闪烁。',
  frameBlending: '点击了解帧混合的更多信息。',
};

for (const setting of SettingsConfig) {
  if (setting.questionMark && localizedSettingHelp[setting.name])
    setting.questionMark.title = localizedSettingHelp[setting.name];
}

export const WebGLOnlySettings = [
  'resolution',
  'vibrance',
  'frameFading',
  'flickerReduction',
  'fixedPosition',
  'chromiumBugVideoJitterWorkaround',
];

/**
 * Settings that only make sense on YouTube: they restyle parts of the YouTube
 * page (header, surrounding content, scrollbars) or resize YouTube's player
 * itself. Bilibili's page and player have no equivalent targets, so these are
 * removed from the settings menu there instead of silently doing nothing.
 */
export const BilibiliUnsupportedSettings = [
  'layoutPerformanceImprovements',
  'sectionOtherPageHeaderCollapsed',
  'headerShadowSize',
  'headerShadowOpacity',
  'headerImagesOpacity',
  'headerFillOpacity',
  'sectionOtherPageContentCollapsed',
  'surroundingContentShadowSize',
  'surroundingContentShadowOpacity',
  'surroundingContentTextAndBtnOnly',
  'surroundingContentImagesOpacity',
  'surroundingContentFillOpacity',
  'pageBackgroundGreyness',
  'immersiveTheaterView',
  'relatedScrollbar',
  'hideScrollbar',
  'videoScale.SMALL',
  'videoScale.THEATER',
  'videoScale.FULLSCREEN',
  'enableInVRVideos',
];

let prepared = false;
export const prepareSettingsConfigOnce = () => {
  if (prepared) return;

  const settingsToRemove = [];
  for (const setting of SettingsConfig) {
    if (supportsWebGL()) {
      if (setting.name === 'resolution' && getBrowser() === 'Firefox') {
        setting.default = 50;
      }
    } else {
      if (WebGLOnlySettings.includes(setting.name)) {
        settingsToRemove.push(setting.name);
      }
      if (['webGL'].includes(setting.name)) {
        setting.default = false;
        setting.disabled = '浏览器中已停用 WebGL。';
      }
    }

    if (setting.name === 'frameSync') {
      if (!HTMLVideoElement.prototype.requestVideoFrameCallback) {
        setting.max = 1;
        setting.default = 0;
      } else if (getBrowser() === 'Firefox') {
        // FireFox workaround: requestVideoFrameCallback is limited to 24fps. Use decoded video frames by default instead
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1935256
        setting.default = 0;
      }
    }
  }

  if (getBrowser() === 'Firefox') {
    settingsToRemove.push('enableInVRVideos');
  }

  if (!supportsColorMix()) {
    settingsToRemove.push('pageBackgroundGreyness');
  }

  if (isBilibiliPlatform) {
    settingsToRemove.push(...BilibiliUnsupportedSettings);
  }

  for (const settingName of settingsToRemove) {
    const settingIndex = SettingsConfig.findIndex(
      (setting) => setting.name === settingName
    );
    if (settingIndex === -1) continue;
    SettingsConfig.splice(settingIndex, 1);
  }

  prepared = true;
};

export default SettingsConfig;
