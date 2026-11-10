# Persona 3 Terminal

基于终端（TUI）的《女神异闻录 3 Reload》（Persona 3 Reload）同人游戏项目，使用 **React 19** 与 **Ink 8** 构建，在命令行终端中还原 P3R 标志性的深蓝高对比度 UI、影时间（Dark Hour）探索体验与鼠标点选交互。

---

## ✨ 特性

- **P3R 风格主菜单**：还原教室窗边满月 ASCII 场景与经典的蓝白高对比度标题界面。
- **影时间场景探索**：
  - 支持多层 ASCII 背景与精灵叠加渲染（如 4/7 深夜严户台站外广场与血红棺柩）。
  - 结合《女神异闻录 3 携带版》（P3P）风格的点选调查系统，点击场景中的热点（Hotspot）触发调查对话或场景移动。
  - 配备 P3R 风格浮动 HUD（日期、星期、影时间状态、Unicode 月相、当前目标与地点铭牌）。
- **终端原生鼠标交互**：
  - 基于 `xterm-mouse` 与 Yoga 布局树实现精确的终端坐标命中检测（Hit Test）。
  - 支持组件级 `onMouseEnter`、`onMouseLeave`、`onClick` 等事件与悬停高亮反馈。
- **场景栈与状态保持**：
  - 使用场景栈（Scene Stack）管理页面导航（`home-screen`、`exploration`、`tartaros`、`battle`、`credits`）。
  - 利用 React 19 `<Activity>` 组件在切换场景时保留下层场景状态，并自动隔离隐藏场景的鼠标命中。
- **轻量类型安全 Store**：
  - 基于 `useSyncExternalStore` 实现零外部依赖的状态管理，支持点分路径类型推导与细粒度字段订阅（`useField`）。

---

## 🛠 技术栈

- **UI 渲染**：[React 19](https://react.dev/) + [Ink 8](https://github.com/vadimdemedes/ink)（Alternate Screen 全屏模式）
- **鼠标支持**：`xterm-mouse` + `yoga-layout`
- **开发与构建**：TypeScript 7 + `tsx`

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 20
- 支持鼠标事件（SGR / Xterm Mouse）与真彩色（TrueColor）的现代终端（如 Windows Terminal、iTerm2、WezTerm、VS Code 终端等）

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建与生产运行

```bash
# 编译 TypeScript 至 dist/ 与 types/
npm run build

# 运行构建产物
npm start
```

### 代码格式化

```bash
npm run format
```

---

## 🎮 操作说明

- **鼠标移动**：悬停在菜单按钮或场景调查标记（`◈` / `☥` / `◀`）上可触发高亮。
- **鼠标左键点击**：
  - 在标题画面点击 `NEW GAME` 进入严户台站外广场探索，或点击 `Credits` / `End Game`。
  - 在探索场景中点击热点标记展开调查文本，点击底部对话框推进或关闭对话。
- **键盘快捷键**：
  - 在 `Credits` 页面可按 `Esc` 或 `Backspace` 返回上一级场景。
  - 按 `Ctrl + C` 可随时退出程序。

---

## 📂 目录结构

```text
persona-3-terminal/
├── references/               # P3R 界面视觉参考图
├── src/
│   ├── components/
│   │   ├── button.tsx        # 支持鼠标悬停上下文的通用按钮组件
│   │   ├── button-text.tsx   # 随悬停状态切换 P3R 蓝白反色样式的文本组件
│   │   └── mouse.tsx         # 终端鼠标事件 Provider、Yoga 命中检测与 MouseBox
│   ├── scenes/
│   │   ├── home-screen.tsx   # P3R 风格标题主菜单场景
│   │   ├── exploration.tsx   # 场景探索、HUD 与对话交互系统
│   │   ├── tartaros.tsx      # 塔尔塔罗斯迷宫场景（WIP）
│   │   ├── battle.tsx        # 战斗场景（WIP）
│   │   └── credits.tsx       # 制作人员名单场景
│   ├── app.tsx               # 根组件、场景栈渲染与底部状态栏
│   ├── create-store.ts       # 基于 useSyncExternalStore 的路径类型安全 Store
│   ├── store.ts              # 全局状态定义（sceneStack 等）
│   ├── locations.ts          # 探索地点配置、ASCII 画布、精灵与调查热点数据
│   └── index.tsx             # 程序入口（开启 alternateScreen 与 MouseProvider）
├── package.json
└── tsconfig.json
```

---

## ⚠️ 免责声明

本项目为非盈利性质的粉丝同人与技术演示项目，《女神异闻录 3》（Persona 3 / Persona 3 Reload）及相关设定版权归 **ATLUS / SEGA** 所有。
