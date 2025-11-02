# 飞书文档水印消除（Chrome/Edge 扩展）

一个轻量、易用的浏览器扩展，在 `*.feishu.cn` 文档页面前端“软隐藏”水印覆盖层，提升阅读、演示与录屏的视觉体验。默认启用，一键切换，立即生效。

---

## 功能特点

- 一键开关：弹窗面板中点击图标或按下 `Enter/Space` 即可启用/禁用。
- 非侵入式：仅注入样式隐藏水印，不更改文档数据与权限机制。
- 域名明确：仅在 `*.feishu.cn` 站点生效，避免影响其他网站。
- 立即响应：切换状态后当前页立即更新，无需刷新。
- 状态持久：启用/禁用状态保存在浏览器本地（`chrome.storage.local`）。

## 适用使用场景

- 会议演示/屏幕分享：展示文档内容给同事或客户时，避免水印影响观感。
- 录屏课程/教程制作：录制清晰干净的文档画面作为教学素材。
- 评审走查：专注内容本身，减少水印覆盖造成的标注与沟通成本。
- 截屏汇报：获取更易阅读的截图用于 PPT 与知识库整理。

## 安装与使用（Windows + Chrome/Edge）

> 以下步骤以 Windows 目录为例：`c:\Users\Yang\Documents\Github\feishu-watermark-remover`

### Chrome 安装

1. 打开 `chrome://extensions/`
2. 右上角打开“开发者模式”
3. 点击“加载已解压的扩展程序”，选择项目根目录：`c:\Users\Yang\Documents\Github\feishu-watermark-remover`
4. 建议将图标固定到工具栏，便于快速操作

### Microsoft Edge 安装

1. 打开 `edge://extensions/`
2. 开启“开发人员模式”
3. 点击“加载解压缩的扩展”，选择同一目录

### 使用流程

1. 打开任意飞书文档页面，域名须为 `*.feishu.cn`
2. 点击浏览器工具栏中的扩展图标，打开弹窗
3. 查看状态与图标：`已启用`（开）或 `已禁用`（关）
4. 切换开关后，当前页面的水印立即隐藏/恢复；无需刷新
5. 键盘操作：聚焦图标后可用 `Enter` 或 `Space` 切换

## 工作原理（简述）

- 内容脚本：在页面 `document_start` 时注入一段样式，通过缩放、透明、禁用事件等方式“软隐藏”常见水印层。
- 弹窗交互：点击图标或按键切换启用状态，更新文案与图标，并通知当前标签页。
- 消息通信：弹窗向活动的 `feishu.cn` 标签发送 `TOGGLE_WATERMARK` 消息；内容脚本接收后动态注入/移除样式。
- 后台脚本：安装后若不存在状态记录，初始化 `enabled=true`。

相关文件：

- `manifest.json`（Manifest V3 配置）
- `background.js`（安装时初始化本地存储）
- `content.js`（注入/移除隐藏样式，响应消息）
- `popup.html`、`popup.css`、`popup.js`（弹窗界面与交互逻辑）

## 权限说明

- `host_permissions`：只匹配 `*://*.feishu.cn/*`
- `content_scripts.matches`：`*://*.feishu.cn/*`
- 其他权限：`storage`（存储启用状态）、`activeTab`/`tabs`（与当前标签页通信）

`manifest.json` 片段：

```json
{
  "permissions": ["storage", "activeTab", "tabs"],
  "host_permissions": ["*://*.feishu.cn/*"],
  "content_scripts": [
    { "matches": ["*://*.feishu.cn/*"], "js": ["content.js"], "run_at": "document_start" }
  ],
  "background": { "service_worker": "background.js" }
}
```

## 目录结构

```
feishu-watermark-remover/
├── background.js
├── content.js
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── switch_on.svg
│   └── switch_off.svg
├── manifest.json
├── popup.css
├── popup.html
└── popup.js
```

## 常见问题（FAQ）

- 切换后页面没有变化？
  - 是否在 `*.feishu.cn` 域名下（例如公司使用其他域名或海外域名）；本扩展仅匹配 `feishu.cn`。
  - 可在页面上按 `F12` → Console 查看是否有“水印隐藏样式已注入/已移除”的日志。

- 导出/打印的文件仍有水印？
  - 导出/打印由服务端或打印样式控制，前端隐藏不影响生成的文件；本扩展仅针对浏览器端展示。

- 是否会影响页面交互？
  - 不会。扩展仅对水印层做“软隐藏”，不会屏蔽正常点击、滚动、编辑等交互。

## 兼容与扩展（可选）

如需支持其他相关域名（例如海外域 `larksuite.com`），可以在 `manifest.json` 中按需扩展匹配：

```json
{
  "host_permissions": [
    "*://*.feishu.cn/*"
    // "*://*.larksuite.com/*" // 如确有需要再添加
  ],
  "content_scripts": [
    { "matches": ["*://*.feishu.cn/*" /*, "*://*.larksuite.com/*" */], "js": ["content.js"], "run_at": "document_start" }
  ]
}
```

> 说明：默认不做兼容扩展；仅在确有需求时再添加，确保权限最小化。

## 版本与更新

- 当前版本：`1.0.0`
- 变更说明：初始发布；默认启用；弹窗一键开关；仅匹配 `*.feishu.cn`。

## 合规与注意

- 本扩展仅改变前端展示效果，不改变文档内容、权限与审计。
- 请在企业政策与法律法规允许范围内使用；对外材料请遵循组织的合规要求。
- 若飞书页面结构更新导致选择器失效，请升级扩展以适配新结构。

## 贡献方式

欢迎提交 Issue/PR 以改进匹配策略、交互体验或文档说明。也可在实际环境中反馈更多水印层形态以增强鲁棒性。