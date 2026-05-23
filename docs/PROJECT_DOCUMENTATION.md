# AI PM Portfolio - 项目整体说明文档

> 本文档为网站项目的综合性技术参考文档，涵盖架构设计、技术栈、模块结构、API规范等内容，方便后续改造和维护。

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [目录结构](#3-目录结构)
4. [前台模块](#4-前台模块)
5. [后台模块](#5-后台模块)
6. [数据库设计](#6-数据库设计)
7. [API 接口规范](#7-api-接口规范)
8. [数据适配层](#8-数据适配层)
9. [组件库](#9-组件库)
10. [Context 与状态管理](#10-context-与状态管理)
11. [样式与主题](#11-样式与主题)
12. [开发规范](#12-开发规范)
13. [部署指南](#13-部署指南)
14. [常见问题](#14-常见问题)

---

## 1. 项目概述

### 1.1 项目简介

**AI PM 思钱想厚** 是一个面向 AI 产品经理的个人品牌网站，集成了作品展示、技能展示、博客文章等功能模块，支持中英文双语切换和深浅主题切换。

### 1.2 核心功能

| 模块 | 功能描述 |
|------|---------|
| 作品集 | 展示 AI 产品经理的项目案例，含问题-行动-结果结构 |
| 技能展示 | 分类展示 AI、Product、Technical、Soft Skills |
| 博客/方法论 | 发布产品方法论文章 |
| 关于我 | 个人介绍、联系方式、社交链接 |
| 后台管理 | 完整的 CMS 系统管理以上所有内容 |

### 1.3 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    前台 (Next.js)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │  首页    │  │ 作品集   │  │ 博客    │  │ 关于页   │  │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  │
│       │            │            │            │         │
│       └────────────┴────────────┴────────────┘         │
│                          │                              │
│                    SWR 数据获取                           │
└──────────────────────────┬──────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  API 适配层  │
                    │ lib/api/    │
                    └──────┬──────┘
                           │
┌──────────────────────────┬──────────────────────────────┐
│                    后台 API (Express)                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ 项目管理 │  │ 技能管理 │  │ 用户管理 │  │ 系统设置 │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                          │                              │
│                    数据服务层                             │
│                 server/services/                         │
└──────────────────────────────────────────────────────────┘
```

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前台框架 | Next.js | 14.2.35 |
| UI 框架 | React | 19 |
| 语言 | TypeScript | 5 |
| 样式 | Tailwind CSS | 4.x |
| UI 组件库 | shadcn/ui + Radix UI | - |
| 数据获取 | SWR | 2.4.x |
| 状态管理 | React Context | - |
| 后台框架 | Express.js | 4.x |
| 数据库 | SQLite (内存数据) | - |
| 图标 | Lucide React | - |

### 2.2 项目依赖

主要依赖 (`package.json`):

```json
{
  "next": "14.2.35",
  "react": "^19",
  "typescript": "^5",
  "tailwindcss": "^4.1.9",
  "@radix-ui/react-*": "1.x",
  "swr": "^2.4.1",
  "axios": "^1.16.1",
  "lucide-react": "^0.454.0",
  "sonner": "^1.7.4",
  "framer-motion": "^12.38.0"
}
```

---

## 3. 目录结构

```
个人作品网站/
├── app/                          # Next.js App Router
│   ├── admin/                    # 后台管理系统
│   │   ├── login/page.tsx       # 登录页
│   │   ├── dashboard/page.tsx   # 仪表盘
│   │   ├── projects/page.tsx    # 项目管理
│   │   ├── skills/page.tsx      # 技能管理
│   │   ├── profile/page.tsx     # 个人信息
│   │   ├── contact/page.tsx     # 联系方式
│   │   ├── settings/page.tsx    # 系统设置
│   │   └── layout.tsx           # 后台布局
│   ├── portfolio/               # 作品集模块
│   │   ├── page.tsx            # 作品列表
│   │   └── [slug]/page.tsx     # 作品详情
│   ├── blog/                    # 博客模块
│   │   ├── page.tsx           # 文章列表
│   │   └── [slug]/page.tsx    # 文章详情
│   ├── api/                    # API 路由
│   │   └── medium-posts/      # Medium 文章同步
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 首页
│
├── components/                  # React 组件
│   ├── ui/                    # 基础 UI 组件 (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (30+ 组件)
│   ├── admin/                 # 后台管理组件
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ProtectedRoute.tsx
│   ├── chatbot/              # AI 聊天组件
│   │   ├── ChatButton.tsx
│   │   ├── ChatPanel.tsx
│   │   └── MessageBubble.tsx
│   ├── navbar.tsx            # 导航栏
│   ├── hero-section.tsx      # 首屏区域
│   ├── about-section.tsx     # 关于区域
│   ├── footer.tsx            # 页脚
│   └── ...
│
├── lib/                       # 工具库
│   ├── api/                  # 前台 API
│   │   ├── config.ts        # API 配置
│   │   ├── client.ts        # 通用 fetch 封装
│   │   └── adapter.ts       # 数据格式转换
│   ├── admin/               # 后台 API
│   │   ├── api.ts          # Axios 实例
│   │   ├── constants.ts    # 常量定义
│   │   └── fetcher.ts      # 数据获取封装
│   └── utils.ts             # 通用工具函数
│
├── contexts/                 # React Context
│   ├── language-context.tsx  # 语言切换
│   ├── theme-context.tsx     # 主题切换
│   └── admin/
│       └── AuthContext.tsx   # 后台认证
│
├── types/                   # TypeScript 类型
│   └── admin/
│       └── index.ts         # 后台相关类型
│
├── data/                    # 模拟数据
│   ├── projects.ts          # 项目数据
│   ├── skills.ts            # 技能数据
│   └── articles.ts          # 文章数据
│
├── hooks/                   # 自定义 Hooks
│   ├── use-scroll-animation.tsx
│   └── useChatbot.ts
│
├── server/                  # 后台 API 服务
│   ├── server.js           # Express 入口
│   ├── config/             # 配置文件
│   ├── routes/             # 路由定义
│   ├── services/           # 数据服务层
│   ├── middleware/         # 中间件
│   └── data/               # 初始数据
│
├── docs/                    # 项目文档
│   ├── UI_STYLE_GUIDE.md   # UI 风格指南
│   ├── PRD.md              # 产品需求文档
│   └── ...
│
└── public/                 # 静态资源
    ├── images/             # 图片资源
    │   ├── portfolio/      # 作品封面
    │   └── clients/        # 客户 logo
    └── icons/              # 图标资源
```

---

## 4. 前台模块

### 4.1 首页结构

```
app/page.tsx
├── layout.tsx (根布局)
│   └── ThemeProvider
│   └── LanguageProvider
│   └── Navbar
│
└── page.tsx (首页)
    ├── HeroSection         # 首屏区域
    ├── CompaniesSection    # 服务客户
    ├── PortfolioSection    # 作品集预览
    ├── ServicesSection     # 服务内容
    ├── ExperienceSection   # 经历展示
    ├── SkillsSection       # 技能展示
    ├── TestimonialsSection # 推荐语
    ├── TalksSection        # 演讲分享
    ├── PodcastSection      # 播客
    ├── BlogSection         # 博客预览
    ├── AboutSection        # 关于我
    └── Footer
```

### 4.2 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 综合展示页 |
| `/portfolio` | 作品集列表 | 所有项目展示 |
| `/portfolio/[slug]` | 作品详情 | 单个项目详情页 |
| `/blog` | 方法论列表 | 文章列表 |
| `/blog/[slug]` | 文章详情 | 单篇文章 |
| `/admin` | 后台首页 | 需登录 |
| `/admin/login` | 登录页 | 后台入口 |

### 4.3 数据流

```tsx
// 页面组件使用 SWR 获取数据
const { data, isLoading, error } = useSWR(
  '/api/public/projects',
  (url) => fetchAPI<any[]>(url).then(adaptProjects),
  {
    errorRetryCount: 2,
    fallbackData: mockProjects,  // 降级数据
  }
)
```

---

## 5. 后台模块

### 5.1 模块结构

| 模块 | 路由 | 功能 |
|------|------|------|
| 仪表盘 | `/admin/dashboard` | 数据概览、统计图表 |
| 项目管理 | `/admin/projects` | CRUD 项目案例 |
| 技能管理 | `/admin/skills` | CRUD 技能分类 |
| 个人信息 | `/admin/profile` | 编辑个人资料 |
| 联系方式 | `/admin/contact` | 编辑联系方式 |
| 系统设置 | `/admin/settings` | 网站配置 |

### 5.2 权限控制

```tsx
// ProtectedRoute.tsx
<ProtectedRoute>
  <AdminLayout>
    {children}
  </AdminLayout>
</ProtectedRoute>

// AuthContext.tsx
const { user, login, logout } = useAuth()
// user 为 null 时重定向到登录页
```

### 5.3 API 请求封装

```typescript
// lib/admin/api.ts
import axios from 'axios'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截处理 401、错误提示等
```

---

## 6. 数据库设计

### 6.1 数据表

系统使用内存 JSON 数据存储，无需实体数据库。数据结构定义在 `server/data/initialData.js`。

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| `adminUsers` | 管理员用户 | id, username, password, nickname |
| `userProfile` | 个人资料 | nickname, avatar, signature, years_of_experience |
| `contactInfo` | 联系方式 | email, phone, wechat_id, github_url |
| `siteConfig` | 网站配置 | config_key, config_value |
| `skillCates` | 技能分类 | id, cate_name, sort_num |
| `skills` | 技能列表 | id, name, level, cate_id, description |
| `projectCates` | 项目分类 | id, cate_name, sort_num |
| `projects` | 项目列表 | slug, name_zh, name_en, content_zh, content_en, thumbnail |
| `visitStats` | 访问统计 | visit_date, ip_address, page_path |
| `adminLogs` | 操作日志 | admin_id, action_type, target_module, content |

### 6.2 项目数据结构

```typescript
interface Project {
  id: number
  slug: string                          // URL 标识
  name_zh: string                        // 中文名称
  name_en: string                        // 英文名称
  type_zh: string                        // 项目类型 (中文)
  type_en: string                        // 项目类型 (英文)
  intro_zh: string                       // 简介 (中文)
  intro_en: string                       // 简介 (英文)
  problem_zh: string                     // 问题/挑战 (中文)
  problem_en: string                     // 问题/挑战 (英文)
  action_zh: string                      // 行动/方案 (中文)
  action_en: string                      // 行动/方案 (英文)
  result_zh: string                      // 结果/成果 (中文)
  result_en: string                      // 结果/成果 (英文)
  thumbnail: string                      // 封面图
  content_zh: string                     // 详细内容 (Markdown, 中文)
  content_en: string                     // 详细内容 (Markdown, 英文)
  keywords: string                       // 关键词 (逗号分隔)
  tags: string                           // 标签 (逗号分隔)
  emoji: string                          // Emoji 图标
  external_url: string                   // 外部链接
  view_count: number                    // 浏览量
  cate_id: number                        // 分类 ID
  status: number                         // 状态: 1=启用, 0=禁用
  sort_num: number                       // 排序号
  deleted_at: string | null              // 删除时间 (软删除)
  created_at: string                     // 创建时间
  updated_at: string                     // 更新时间
}
```

---

## 7. API 接口规范

### 7.1 接口基础

- **Base URL**: `http://localhost:8000/api` (开发环境)
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token

### 7.2 响应格式

```typescript
interface ApiResponse<T = any> {
  code: number      // 状态码: 0=成功, 其他=失败
  message: string   // 消息
  data: T           // 数据
  timestamp?: number
}
```

### 7.3 公开接口 (无需认证)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/public/profile` | 获取个人资料 |
| GET | `/api/public/projects` | 获取项目列表 |
| GET | `/api/public/projects?slug=xxx` | 获取单个项目 |
| GET | `/api/public/skills` | 获取技能列表 |
| GET | `/api/public/skills?cateId=1` | 按分类获取技能 |
| GET | `/api/public/contact` | 获取联系方式 |
| GET | `/api/public/settings` | 获取网站设置 |
| POST | `/api/visit` | 记录访问 |
| POST | `/api/project/:slug/view` | 记录项目浏览 |

### 7.4 管理接口 (需认证)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录 |
| GET | `/api/profile` | 获取个人资料 |
| PUT | `/api/profile` | 更新个人资料 |
| GET | `/api/projects` | 获取项目列表 (分页) |
| POST | `/api/projects` | 创建项目 |
| PUT | `/api/projects/:id` | 更新项目 |
| DELETE | `/api/projects/:id` | 删除项目 |
| GET | `/api/skills` | 获取技能列表 (分页) |
| POST | `/api/skills` | 创建技能 |
| PUT | `/api/skills/:id` | 更新技能 |
| DELETE | `/api/skills/:id` | 删除技能 |
| GET | `/api/contact` | 获取联系方式 |
| PUT | `/api/contact` | 更新联系方式 |
| GET | `/api/settings` | 获取网站设置 |
| PUT | `/api/settings` | 更新网站设置 |
| GET | `/api/stats` | 获取统计数据 |
| GET | `/api/analytics` | 获取分析数据 |
| GET | `/api/logs` | 获取操作日志 |

### 7.5 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 认证失败 |
| 1003 | 权限不足 |
| 1004 | 资源不存在 |
| 1020 | 服务器内部错误 |

---

## 8. 数据适配层

### 8.1 为什么要适配

后台 API 返回的数据格式与前台组件期望的格式不同，需要适配层进行转换。

### 8.2 后台数据格式 vs 前台格式

```typescript
// 后台返回格式 (单字段存双语)
BackendProject {
  name_zh: "AI 产品经理作品集"
  name_en: "AI Product Manager Portfolio"
  content_zh: "# 标题\n## 内容..."
  content_en: "# Title\n## Content..."
}

// 前台期望格式 (嵌套对象)
FrontendProject {
  name: { zh: "AI 产品经理作品集", en: "AI Product Manager Portfolio" }
  content: { zh: "# 标题\n## 内容...", en: "# Title\n## Content..." }
}
```

### 8.3 适配函数

```typescript
// lib/api/adapter.ts
export function adaptProjects(backendProjects: BackendProject[]): FrontendProject[] {
  return backendProjects.map(project => ({
    id: project.id,
    slug: project.slug,
    name: {
      zh: project.name_zh,
      en: project.name_en
    },
    content: {
      zh: project.content_zh || '',
      en: project.content_en || ''
    },
    // ... 其他字段映射
  }))
}
```

### 8.4 使用示例

```typescript
const { data } = useSWR(
  '/api/public/projects',
  (url) => fetchAPI<any[]>(url).then(adaptProjects)  // 传入适配函数
)
```

---

## 9. 组件库

### 9.1 UI 组件

基于 shadcn/ui + Radix UI 构建，保存在 `components/ui/` 目录。

| 组件 | 文件 | 说明 |
|------|------|------|
| Button | button.tsx | 按钮，支持多种变体 |
| Input | input.tsx | 输入框 |
| Card | card.tsx | 卡片容器 |
| Dialog | dialog.tsx | 对话框 |
| Table | table.tsx | 表格 |
| Badge | badge.tsx | 徽章 |
| Select | select.tsx | 选择器 |
| Tabs | tabs.tsx | 标签页 |
| Sheet | sheet.tsx | 侧边抽屉 |
| Toast | toast.tsx | 轻提示 |
| Skeleton | skeleton.tsx | 加载骨架 |
| Progress | progress.tsx | 进度条 |
| Avatar | avatar.tsx | 头像 |
| Separator | separator.tsx | 分隔线 |
| Tooltip | tooltip.tsx | 工具提示 |
| Switch | switch.tsx | 开关 |
| Checkbox | checkbox.tsx | 复选框 |
| Radio | radio-group.tsx | 单选框 |
| Slider | slider.tsx | 滑块 |
| Accordion | accordion.tsx | 手风琴 |
| Collapsible | collapsible.tsx | 可折叠 |
| Popover | popover.tsx | 弹出框 |
| ContextMenu | context-menu.tsx | 右键菜单 |
| Menubar | menubar.tsx | 菜单栏 |
| NavigationMenu | navigation-menu.tsx | 导航菜单 |
| AlertDialog | alert-dialog.tsx | 警告对话框 |
| HoverCard | hover-card.tsx | 悬停卡片 |
| AspectRatio | aspect-ratio.tsx | 宽高比 |
| Calendar | calendar.tsx | 日历 |
| Carousel | carousel.tsx | 轮播 |
| Chart | chart.tsx | 图表 |
| Command | command.tsx | 命令面板 |
| Drawer | drawer.tsx | 抽屉 |
| DropdownMenu | dropdown-menu.tsx | 下拉菜单 |
| Form | form.tsx | 表单 |
| InputOTP | input-otp.tsx | 验证码输入 |
| Label | label.tsx | 标签 |
| Pagination | pagination.tsx | 分页 |
| Resizable | resizable.tsx | 可调整大小 |
| ScrollArea | scroll-area.tsx | 滚动区域 |
| Sonner | sonner.tsx | Toast 通知 |
| Textarea | textarea.tsx | 多行文本 |
| ToggleGroup | toggle-group.tsx | 切换组 |
| Toggle | toggle.tsx | 切换 |

### 9.2 业务组件

| 组件 | 文件 | 说明 |
|------|------|------|
| Navbar | navbar.tsx | 导航栏 |
| HeroSection | hero-section.tsx | 首屏区域 |
| AboutSection | about-section.tsx | 关于区域 |
| PortfolioSection | portfolio-section.tsx | 作品集区域 |
| BlogSection | blog-section.tsx | 博客区域 |
| Footer | footer.tsx | 页脚 |
| ThemeProvider | theme-provider.tsx | 主题提供者 |
| ScrollFadeWrapper | scroll-fade-wrapper.tsx | 滚动渐显包装器 |

### 9.3 后台组件

| 组件 | 文件 | 说明 |
|------|------|------|
| AdminLayout | AdminLayout.tsx | 后台布局容器 |
| Sidebar | Sidebar.tsx | 后台侧边栏 |
| Header | Header.tsx | 后台顶部栏 |
| ProtectedRoute | ProtectedRoute.tsx | 路由保护 |
| DataTable | DataTable.tsx | 数据表格 |

---

## 10. Context 与状态管理

### 10.1 LanguageContext

```typescript
// contexts/language-context.tsx
interface LanguageContextType {
  language: "zh" | "en"
  setLanguage: (lang: "zh" | "en") => void
}

// 使用
const { language } = useLanguage()
{language === "zh" ? "中文" : "English"}
```

### 10.2 ThemeContext

```typescript
// contexts/theme-context.tsx
interface ThemeContextType {
  theme: "dark" | "light"
  toggleTheme: () => void
}

// 使用
const { theme } = useTheme()
<div className={theme === "dark" ? "bg-black" : "bg-white"}>
```

### 10.3 AuthContext (后台)

```typescript
// contexts/admin/AuthContext.tsx
interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}
```

---

## 11. 样式与主题

### 11.1 Tailwind 配置

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-orange-primary: #FF8A00;
  --color-orange-light: #FFCC80;
  --color-gray-dark: #1A1A1A;
  --color-gray-medium: #333333;
  --color-gray-light: #B0B0B0;
  --font-space-grotesk: 'Space Grotesk', system-ui, sans-serif;
}

body {
  font-family: var(--font-space-grotesk);
}
```

### 11.2 主题切换模式

所有颜色相关的类必须使用条件判断：

```tsx
// 文本颜色
theme === "dark" ? "text-white" : "text-gray-900"
theme === "dark" ? "text-gray-400" : "text-gray-600"

// 背景颜色
theme === "dark" ? "bg-black" : "bg-white"
theme === "dark" ? "bg-gray-900/50" : "bg-white"

// 边框颜色
theme === "dark" ? "border-gray-800" : "border-gray-200"

// 悬停状态
theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
```

### 11.3 滚动条样式

```css
/* 深色主题 */
body::-webkit-scrollbar-track {
  background: #1a1a1a;
}
body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #f97316, #ea580c);
  border-radius: 4px;
}

/* 浅色主题 */
.light-theme::-webkit-scrollbar-track {
  background: #f1f5f9;
}
```

---

## 12. 开发规范

### 12.1 组件规范

```tsx
"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Icon } from "lucide-react"

export default function ComponentName() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [state, setState] = useState()

  return (
    <div className="...">
      {/* JSX */}
    </div>
  )
}
```

### 12.2 样式顺序

1. 布局类 (`flex`, `grid`, `absolute`)
2. 尺寸类 (`w-`, `h-`, `p-`, `m-`)
3. 外观类 (`bg-`, `border-`, `rounded-`)
4. 交互类 (`hover:`, `focus:`, `active:`)
5. 响应式类 (`sm:`, `md:`, `lg:`)

### 12.3 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `AboutSection.tsx` |
| 工具函数 | camelCase | `fetchAPI.ts` |
| CSS 类 | Tailwind 规范 | `text-white bg-black` |
| API 路径 | kebab-case | `/api/public/projects` |
| 数据库字段 | snake_case | `name_zh`, `created_at` |

### 12.4 数据获取规范

```typescript
// 使用 SWR + fallbackData + 错误处理
const { data, isLoading, error } = useSWR(
  '/api/public/projects',
  (url) => fetchAPI<any[]>(url).then(adaptProjects),
  {
    errorRetryCount: 2,
    errorRetryInterval: 3000,
    fallbackData: mockProjects,
    suspense: false,
  }
)

// 展示加载状态
if (isLoading) return <Skeleton />

// 展示错误状态
if (error) return <ErrorBanner error={error} />
```

---

## 13. 部署指南

### 13.1 前台部署 (Vercel)

1. 连接 GitHub 仓库
2. 设置环境变量:
   - `NEXT_PUBLIC_API_URL`: API 地址
3. 部署

### 13.2 后台部署

```bash
cd server
npm install
npm start
```

### 13.3 环境变量

```bash
# .env.example
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=https://yumeng.dev
```

---

## 14. 常见问题

### 14.1 如何添加新页面？

1. 在 `app/` 下创建目录和 `page.tsx`
2. 遵循组件规范编写
3. 如需数据获取，使用 SWR

### 14.2 如何添加新 API 接口？

**后台 (Express):**
1. 在 `server/routes/` 创建路由文件
2. 在 `server/server.js` 注册路由
3. 在 `server/services/index.js` 添加数据操作方法

**前台 (数据获取):**
1. 在 `lib/api/adapter.ts` 添加适配函数
2. 在 `lib/api/client.ts` 添加请求函数

### 14.3 如何添加新 UI 组件？

使用 shadcn/ui CLI:

```bash
npx shadcn@latest add button
```

### 14.4 如何处理双语文本？

```tsx
// 使用 LanguageContext
const { language } = useLanguage()

// 方式1: 三元表达式
{language === "zh" ? "中文" : "English"}

// 方式2: 对象映射
const text = {
  zh: "中文",
  en: "English"
}[language]
```

### 14.5 如何处理主题切换？

```tsx
const { theme } = useTheme()

// 所有颜色相关样式使用条件判断
className={theme === "dark" ? "bg-black text-white" : "bg-white text-black"}
```

---

## 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2026-05-20 | v1.0 | 初始版本，包含完整项目架构说明 |

---

## 相关文档

- [UI 风格指南](./UI_STYLE_GUIDE.md) - 设计规范与组件使用
- [API 文档](./docs/api/aipmym-admin-interaction.md) - 详细接口文档
- [数据库设计](./docs/database/aipmym-admin-db.md) - 数据表结构
- [PRD](./docs/prd/aipmym-admin-prd.md) - 产品需求文档
