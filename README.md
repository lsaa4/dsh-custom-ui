# dsh-glass-ui

为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web 打造的**毛玻璃 UI 主题插件**：整体布局保持原样，风格替换为透明毛玻璃；在 **设置 → 自定义UI设计** 中可实时调节。

## 功能

- **毛玻璃风格**：界面表面半透明 + 背景模糊（背景层 `filter: blur`，不改动布局层级，安全无副作用）
- **透明度滑块**：玻璃透明度 10%–95% 实时调节
- **模糊滑块**：背景模糊半径 4–40px 实时调节
- **自定义字体**：预设字体 + 任意字体族输入 + 上传字体文件（woff2/woff/ttf/otf，自动注入 `@font-face`）
- **背景壁纸**：上传图片（jpg/png/webp/gif/avif）或动态壁纸视频（mp4/webm/mov，≤1GB，流式写入磁盘，`<video>` 自动循环播放）
- **背景模式**：无背景 / 图片背景 / 动态壁纸三选一；图片支持**多图轮播**（可调间隔）、**遮罩**（暗化提高可读性）与三种铺放方式（铺满 / 完整显示 / 原始大小），切换平滑过渡
- **网易云音乐**：扫码或 Cookie 登录、我的歌单 / 每日推荐 / 热门歌单 / 搜索、播放队列，输入框信息栏实时显示**滚动歌词**（位置可调：信息栏内 / 最右 / 隐藏）；支持 HTTP/SOCKS 代理与远程 API 服务器两种绕风控方案
- **柔和动画**：界面渐渐显现、交互过渡温柔平滑（无 / 轻柔 / 明显三档，支持 `prefers-reduced-motion`）
- **自定义 CSS**：高级用户可粘贴任意样式，即时生效并自动保存
- **配置分享**：一键导出 / 导入配置 JSON
- **首屏无闪烁**：host 端在 index.html 注入已保存的配置，刷新页面立即呈现玻璃效果
- 配置持久化于 `$DSH_HOME/data/glass-ui/config.json`；上传的媒体由 host 自动垃圾回收（未被配置引用的文件会被清理），卸载插件后自动恢复默认外观

## 安装

### 从 GitHub 安装（无需发布 npm）

```sh
dsh plugin --profile web add github:lsaa4/dsh-custom-ui
```

> 本仓库已提交构建产物（`lib/` + `client/`），安装无需构建脚本、无交互。若从源码安装（未提交产物），pnpm ≥10 会拦截构建脚本，需在 profile 的 `pnpm-workspace.yaml` 中 `allowBuilds` 后重跑。

重启 `dsh web`，打开 **设置 → 自定义UI设计** 即可开始调节。

### 从 npm 安装（发布后）

```sh
dsh plugin --profile web add dsh-glass-ui
```

### 卸载

```sh
dsh plugin --profile web remove dsh-glass-ui
```

重启后界面恢复默认。

## 使用

1. 打开 **设置**（左下角齿轮）→ 侧边栏 **自定义UI设计**
2. 拖动 **透明度 / 模糊** 滑块，实时预览毛玻璃效果
3. **字体**：点选预设，或输入自定义字体族，或上传字体文件
4. **背景壁纸**：选择 无/图片/动态壁纸，上传你的素材；图片可多张轮播
5. **网易云音乐**：扫码登录（或粘贴网页版 Cookie），浏览歌单 / 每日推荐 / 热门歌单 / 搜索后点击歌曲即播放，歌词实时显示在输入框信息栏
6. 所有修改即时生效、自动保存（状态显示"已保存"）

## 开发

```sh
pnpm install
pnpm typecheck
pnpm build          # tsc (host) + tsdown (client) + __ModuleLoader__ 包装
```

本地安装到 web profile：

```sh
cd "$DSH_HOME/profiles/web"
pnpm add "link:<本仓库绝对路径>"
# 然后把 "dsh-glass-ui" 追加进 package.json 的 dsh.profile.bundles
```

迭代 client 时可 `npx tsdown --watch`，页面经 dsh-client-hmr 热更新；修改 host 或 manifest 后需重启 `dsh web`。

## 技术要点

| 机制 | 说明 |
|---|---|
| 浏览器半契约 | `window.__ModuleLoader__.load({ id, factory })`，导出 `name` / `inject` / `apply(ctx)` |
| 表面透明化 | `ctx.theme.overrideTokens()` 把 `--dsw-alias-bg-*` 等覆盖为 `var(--glass-surface-*)`（值跟随 :root 变量，滑块只改变量） |
| 玻璃模糊 | 背景层 `filter: blur(var(--glass-blur))` + 表面半透明 —— 刻意不用 `backdrop-filter`（它会改变 `#root` 的 containing block，破坏内部 fixed 元素布局） |
| 壁纸切换 | 图片双缓冲交叉淡入淡出；视频先用隐藏 probe 预载到 `loadeddata` 再淡入（避免黑闪），旧视频随后释放 |
| 配置持久化 | host 半路由 `GET/PUT /glass-ui/config`，原子写入 `$DSH_HOME/data/glass-ui/config.json` |
| 媒体上传 | `POST /glass-ui/media`（raw body + `x-media-kind`），白名单校验类型/扩展名/大小，流式落盘；`GET/HEAD/DELETE /glass-ui/media/<file>` 流式服务与删除；保存配置与启动时自动 GC 未引用文件 |
| 首屏引导 | `webServer.tapIndex()` 注入 `<style id="dsh-glass-ui-boot">`，刷新无闪烁 |
| 网易云代理 | `POST /netease/weapi`（AES+RSA 加密）、`/netease/lyric`、`/netease/hot-playlists`、`/netease/search`、`/netease/song-url`、`/netease/account`、`/netease/logout`、`/netease/cookie`；直连被墙时可配 HTTP/SOCKS 代理或远程 NeteaseCloudMusicApi 服务器 |
| 动画 | `body.dsh-glass-anim-*` 门控的渐显/过渡，尊重 `prefers-reduced-motion` |

## 已知限制

- 主题 token 覆盖无完整性校验（DSH 官方标注）：漏覆盖的变量回退内置值
- 动态壁纸为全屏视频背景，大分辨率视频请控制体积（上限 1GB）
- 多主题插件并存时由最后激活者生效；设置面板提供"恢复默认"一键还原
- token 名称随 DSH 版本迭代可能微调，升级 DSH 后如配色异常请重新构建
- 网易云歌曲直链受版权/VIP 限制，不可播的歌曲会提示并跳过
- 导出/导入配置只含 URL 引用，不含媒体文件本身（跨机器导入需重新上传素材）

## License

MIT
