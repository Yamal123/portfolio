# 个人作品网站 - 思钱想厚 PM Portfolio

一个展示产品经理职业背景、项目经验和专业能力的现代化个人作品网站。

## 🌟 特性

- 🌐 **中英双语**：支持中文和英文切换
- 🌓 **深色/浅色模式**：自动适配系统主题
- 📱 **响应式设计**：完美支持移动端、平板和桌面端
- ⚡ **快速加载**：基于 Next.js 14 和 React 19
- 🎨 **现代化 UI**：使用 Tailwind CSS 和 Radix UI 组件库

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
个人作品网站/
├── app/                    # Next.js App Router
│   ├── blog/              # 方法论文章列表页
│   ├── portfolio/         # 作品集列表页
│   ├── api/               # API 路由
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # UI 组件库
│   ├── hero-section.tsx  # Hero 区域
│   ├── portfolio-section.tsx
│   ├── blog-section.tsx
│   └── ...
├── contexts/              # React Context
│   ├── language-context.tsx
│   └── theme-context.tsx
└── public/                # 静态资源
```

## 🛠️ 技术栈

- **框架**：Next.js 14
- **UI 库**：Radix UI + Tailwind CSS
- **图标**：Lucide React
- **部署**：Vercel Ready

## 📝 更新日志

### v1.1.0 (2026-05-15)

#### 主要更新

**1. 文案优化**
- 更新个人描述文案，强调产品设计和技术探索
- 优化关键词映射，增加产品设计、技术探索等新关键词
- 修复关键词重复渲染问题，优化 `renderDescriptionWithEmojis` 函数

**2. 新增作品集列表页**
- 创建完整的作品集子页面（`/portfolio`）
- 实现模糊搜索功能（支持标题、分类、标签、痛点搜索）
- 添加分页功能（每页6个项目）
- 包含返回首页导航
- 双语支持和深色/浅色主题适配
- 新增3个项目案例（社交电商、数据分析、金融风控）

**3. 新增方法论文章列表页**
- 创建完整的文章子页面（`/blog`）
- 实现模糊搜索功能（支持标题、标签、摘要搜索）
- 添加分页功能（每页6篇文章）
- 包含返回首页导航
- 双语支持和深色/浅色主题适配
- 新增6篇方法论文章

**4. 页面导航优化**
- 修改作品集区域，将「查看更多项目」按钮链接到 `/portfolio`
- 修改博客区域，将「查看更多文章」按钮链接到 `/blog`
- 添加返回首页导航功能

**5. 代码质量优化**
- 修复 `blog/page.tsx` 语法错误（添加缺失的括号）
- 优化组件导入（添加 Link 组件）
- 改进关键词匹配算法，避免重叠匹配

### v1.0.0 (2025-01-15)

- ✅ 完成首页 Hero 区域
- ✅ 完成作品集展示区域
- ✅ 完成方法论博客区域
- ✅ 完成关于我介绍区域
- ✅ 完成联系方式和页脚
- ✅ 实现中英双语切换
- ✅ 实现深色/浅色主题切换
- ✅ 响应式设计适配

## 👤 作者

**Yu Meng (禹孟)**  
AI 产品经理 | 供应链专家 | 创新实践者

- 📧 邮箱：yumengfine@163.com
- 📱 电话：15690630301
- 🌐 个人网站：https://portfolio.vercel.app

## 📄 许可证

Copyright © 2026 Yu Meng. All rights reserved.
