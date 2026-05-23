export interface Project {
  id: number
  slug: string
  name: { zh: string; en: string }
  thumbnail?: string
  type: { zh: string; en: string }
  intro: { zh: string; en: string }
  keywords: string[]
  createdAt: string
  emoji: string
  problem: { zh: string; en: string }
  action: { zh: string; en: string }
  result: { zh: string; en: string }
  tags: string[]
  content: { zh: string; en: string }
  externalUrl?: string
  view_count: number
}

export const projectsData: Project[] = [
  {
    id: 1,
    slug: "ai-portfolio",
    name: { zh: "AI 产品经理作品集", en: "AI Product Manager Portfolio" },
    thumbnail: "/images/portfolio/saiaconfportada.png",
    type: { zh: "个人项目", en: "Personal Project" },
    intro: { 
      zh: "一个展示 AI 产品经理职业背景、项目经验和专业能力的现代化个人作品网站", 
      en: "A modern personal portfolio website showcasing AI Product Manager career background, project experience and professional capabilities" 
    },
    keywords: ["Next.js", "React", "TypeScript", "AI", "产品经理"],
    createdAt: "2026-05-15",
    emoji: "🌐",
    problem: { 
      zh: "需要一个专业的在线作品集来展示 AI 产品经理的能力和项目经验", 
      en: "Need a professional online portfolio to showcase AI Product Manager capabilities and project experience" 
    },
    action: { 
      zh: "使用 Next.js 14 构建现代化响应式作品网站，集成 AI 动画效果和双语切换功能", 
      en: "Built modern responsive portfolio website with Next.js 14, integrated AI animations and bilingual switching" 
    },
    result: { 
      zh: "成功展示个人品牌，访问量和用户反馈良好", 
      en: "Successfully showcased personal brand, good traffic and user feedback" 
    },
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    view_count: 1234,
    content: {
      zh: `# AI 产品经理作品集

## 项目概述

这是一个现代化的个人作品网站，专为 AI 产品经理打造。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 库**: React 19 + TypeScript
- **样式**: Tailwind CSS
- **组件库**: Radix UI
- **图标**: Lucide React
- **主题**: Next Themes
- **分析**: Vercel Analytics

## 核心功能

### 1. 中英双语切换
- 支持中文和英文两种语言
- 一键切换，实时更新

### 2. 深色/浅色主题
- 自动适配系统主题
- 手动切换，平滑过渡

### 3. 响应式设计
- 完美适配移动端、平板和桌面端
- Tailwind CSS 响应式工具类

### 4. 现代化交互
- 流畅的动画效果
- 良好的用户体验

## 设计亮点

1. **简洁现代的 UI**: 采用深色主题为主，橙色点缀
2. **丰富的内容展示**: 包含作品集、方法论文章、关于我等模块
3. **良好的性能**: Next.js 静态生成，快速加载
4. **SEO 友好**: 语义化 HTML，良好的 SEO 优化

## 未来规划

- 添加更多项目案例
- 集成博客系统
- 添加在线简历下载
- 优化动画效果`,
      en: `# AI Product Manager Portfolio

## Project Overview

This is a modern personal portfolio website, designed for AI Product Managers.

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **UI Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Icons**: Lucide React
- **Theming**: Next Themes
- **Analytics**: Vercel Analytics

## Core Features

### 1. Bilingual Support
- Support Chinese and English
- One-click switch, real-time update

### 2. Dark/Light Theme
- Auto-adapt to system theme
- Manual switch, smooth transition

### 3. Responsive Design
- Perfect for mobile, tablet and desktop
- Tailwind CSS responsive utilities

### 4. Modern Interactions
- Smooth animations
- Great user experience

## Design Highlights

1. **Clean Modern UI**: Dark theme with orange accents
2. **Rich Content**: Portfolio, methodology articles, about me sections
3. **Great Performance**: Next.js SSG, fast loading
4. **SEO Friendly**: Semantic HTML, good SEO optimization

## Future Plans

- Add more project cases
- Integrate blog system
- Add online resume download
- Optimize animations`
    }
  }
]

export const mockProjects = projectsData
