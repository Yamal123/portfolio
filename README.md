# 余猛的个人作品网站 🚀

> AI产品经理，专注于将AI技术转化为实际业务价值

## 📖 项目简介

这是余猛的个人品牌网站，展示了他的专业技能、项目经验和工作背景。

## ✨ 功能特性

- 🎨 **深色/浅色主题切换** - 支持两种主题模式
- 🌍 **多语言支持** - 中文/英文双语切换
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- 🎯 **平滑滚动动画** - 优雅的滚动入场效果
- 💫 **悬浮交互效果** - 丰富的微交互动画
- 🛠 **主题化滚动条** - 精美的自定义滚动条

## 🛠 技术栈

- **框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **部署**: GitHub Pages

## 📁 项目结构

```
个人作品网站/
├── app/                  # Next.js App Router
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
├── components/          # React组件
│   ├── navbar.tsx       # 导航栏
│   ├── hero-section.tsx # 英雄区
│   ├── skills-section.tsx   # 擅长领域
│   ├── projects-section.tsx # 项目展示
│   ├── about-section.tsx    # 关于我
│   ├── footer.tsx       # 页脚
│   └── scroll-fade-wrapper.tsx # 滚动动画
├── contexts/            # React Context
│   ├── theme-context.tsx     # 主题切换
│   └── language-context.tsx  # 语言切换
├── hooks/               # 自定义Hooks
│   └── use-scroll-animation.tsx
└── public/              # 静态资源
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm start
```

## 📄 页面内容

### 1. 首页
- 个人介绍与职业定位
- 打字机效果展示
- 社交媒体链接

### 2. 擅长领域
- AI 产品规划
- 智能助手开发
- 数据产品设计
- 产品体验设计
- AI 工具链
- 国际化产品

### 3. Vibe Coding 项目
- 兔智星智能助手
- 极兔AI客服
- 中东物流系统
- 海好有你公益项目

### 4. 关于我
- 个人经历
- 数据统计
- 联系入口

## 🎯 使用说明

### 导航菜单

- **首页** - 回到顶部
- **擅长领域** - 查看专业技能
- **Vibe Coding项目** - 展示项目案例
- **关于** - 个人介绍

### 功能按钮

- 🌙/☀️ - 深色/浅色主题切换
- 🇨🇳/🇬🇧 - 中英文语言切换

## 📝 自定义内容

### 修改个人信息

编辑相关组件文件即可：
- `components/hero-section.tsx` - 首页介绍
- `components/about-section.tsx` - 关于我
- `components/footer.tsx` - 联系信息

### 更新项目案例

编辑 `components/projects-section.tsx` 中的项目数据。

## 🌐 在线访问

网站已部署在 GitHub Pages：**https://Yamal123.github.io/portfolio**

## 📦 部署

### GitHub Pages 部署

1. 确保仓库名为 `portfolio`
2. 启用 GitHub Pages：
   - 进入 Settings > Pages
   - Source: Deploy from a branch
   - Branch: `main` / `/ (root)`
3. 保存并等待部署

### 本地开发部署

```bash
# 构建
npm run build

# 启动预览
npm start
```

## 📄 License

MIT License

## 👤 作者

**余猛**

- GitHub: [@Yamal123](https://github.com/Yamal123)
- 网站: https://Yamal123.github.io/portfolio

## 🙏 感谢

感谢所有为本项目做出贡献的人！

---

<p align="center">
  <i>Made with ❤️ by 余猛</i>
</p>
