# PM 思钱想厚 - UI 设计风格指南

## 1. 设计概述

本项目是一个 AI 产品经理个人品牌网站，采用现代化的深色主题设计，以橙色作为品牌强调色。整体风格简洁、专业、具有科技感。

### 1.1 核心设计原则

- **简洁现代**：减少视觉噪音，突出内容本身
- **深色主题优先**：以深色主题为主，提供浅色主题切换
- **响应式设计**：完美适配移动端、平板和桌面端
- **双语支持**：中英文双语界面，实时切换

---

## 2. 颜色系统

### 2.1 品牌色

```css
--color-orange-primary: #FF8A00;   /* 品牌主色 - 橙色 */
--color-orange-light: #FFCC80;      /* 橙色浅色变体 */
```

### 2.2 主题色

| 用途 | 深色主题 | 浅色主题 |
|------|---------|---------|
| 背景色 | `#000000` / `#1A1A1A` | `#ffffff` / `#fafafa` |
| 卡片背景 | `gray-900/50` | `white` |
| 边框色 | `gray-800` | `gray-200` |
| 文字主色 | `white` | `gray-900` |
| 文字副色 | `gray-400` | `gray-600` |
| 强调色 | `orange-400` | `orange-500` |

### 2.3 功能色

| 用途 | 深色主题 | 浅色主题 |
|------|---------|---------|
| 成功 | `green-400` | `green-600` |
| 警告 | `amber-400` | `amber-600` |
| 错误 | `red-400` | `red-600` |
| 信息 | `blue-400` | `blue-600` |

### 2.4 渐变色

```css
/* 作品集卡片渐变背景 */
bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500

/* 项目类型标签 */
bg-gradient-to-r from-blue-500 to-purple-500

/* 滚动条渐变 */
bg-gradient-to-r from-orange-500 to-orange-600
```

---

## 3. 字体系统

### 3.1 主字体

```css
font-family: 'Space Grotesk', system-ui, sans-serif;
```

### 3.2 字体大小规范

| 元素 | 桌面端 | 移动端 |
|------|--------|--------|
| H1 标题 | 3xl-5xl | 2xl-3xl |
| H2 标题 | 2xl-4xl | xl-2xl |
| H3 标题 | xl-2xl | lg-xl |
| 正文 | base-lg | sm-base |
| 副文本 | sm-base | xs-sm |
| 小文本 | xs | xs |

---

## 4. 间距系统

### 4.1 页面内边距

```tsx
max-w-6xl mx-auto px-4 sm:px-6 lg:px-8
```

### 4.2 区块间距

| 场景 | 垂直间距 |
|------|---------|
| 大区块 | `py-16 sm:py-24` |
| 中区块 | `py-12 sm:py-16` |
| 小区块 | `py-8 sm:py-12` |

### 4.3 组件间距

| 元素 | 间距 |
|------|------|
| 卡片内边距 | `p-4 sm:p-6` |
| 卡片圆角 | `rounded-xl sm:rounded-2xl` |
| 按钮圆角 | `rounded-full` |
| 图片圆角 | `rounded-[1.5rem] sm:rounded-[2.5rem]` |

---

## 5. 组件规范

### 5.1 主题切换模式

所有文本颜色必须使用条件判断：

```tsx
// 深色主题
theme === "dark" ? "text-white" : "text-gray-900"
theme === "dark" ? "bg-gray-900" : "bg-white"
theme === "dark" ? "border-gray-800" : "border-gray-200"
theme === "dark" ? "text-gray-400" : "text-gray-600"
```

### 5.2 按钮样式

#### 主要按钮（填充渐变）
```tsx
className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
```

#### 次要按钮（描边）
```tsx
className={`border ${theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"}`}
```

#### 图标按钮
```tsx
className="p-2.5 rounded-full bg-gray-800 text-orange-400 hover:bg-gray-700"
```

### 5.3 卡片样式

#### 作品集卡片
```tsx
className={`rounded-2xl overflow-hidden transition-all duration-500 ${
  theme === "dark"
    ? "bg-gray-900/50 border border-gray-800 hover:border-blue-500/30"
    : "bg-white border border-gray-200 hover:border-blue-300"
} hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2`}
```

#### 统计卡片
```tsx
className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center ${
  theme === "dark"
    ? "bg-gray-900/50 border border-gray-800"
    : "bg-white border border-gray-200"
}`}
```

### 5.4 图片组件

```tsx
<Image
  src={imageSrc}
  alt={altText}
  fill
  className="object-cover"
  priority              // 首屏图片添加
  loading="lazy"       // 非首屏图片添加
  quality={80}          // 图片质量
  placeholder="blur"    // 加载中占位
/>
```

---

## 6. 动画规范

### 6.1 过渡时长

| 动画类型 | 时长 |
|---------|------|
| 快速过渡（颜色、透明度） | `duration-200` / `duration-300` |
| 标准过渡（缩放、移动） | `duration-500` |
| 慢速过渡（复杂动画） | `duration-700` |

### 6.2 悬停效果

```tsx
// 卡片悬停
hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10

// 按钮悬停
hover:scale-110 transition-all duration-300

// 文字悬停
hover:text-orange-400 transition-colors duration-300
```

### 6.3 渐入动画

```tsx
className="transition-all duration-700 opacity-0 translate-y-4"
className="transition-all duration-700 opacity-100 translate-y-0"
```

---

## 7. 响应式断点

| 断点 | 屏幕尺寸 | 常用类 |
|------|---------|--------|
| `sm` | 640px+ | `sm:px-6`, `sm:py-12` |
| `md` | 768px+ | `md:grid-cols-2`, `hidden md:flex` |
| `lg` | 1024px+ | `lg:grid-cols-3`, `lg:gap-16` |
| `xl` | 1280px+ | `xl:text-7xl` |

---

## 8. 前台页面结构

### 8.1 页面布局

```
[Navbar] - 固定顶部，高度 64-80px
  ├── Logo
  ├── 导航链接 (桌面端)
  ├── 语言切换
  ├── 主题切换
  └── 移动端菜单

[Page Content]
  └── max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

[Footer] - 可选
```

### 8.2 Section 结构

```tsx
<section
  id="section-id"
  className="py-16 sm:py-24 relative overflow-hidden"
  style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}
>
  {/* 分隔线 */}
  <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>

  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* 内容 */}
  </div>
</section>
```

---

## 9. 后台页面结构

### 9.1 布局规范

```tsx
<div className="flex min-h-screen bg-gray-50">
  <Sidebar />  {/* 固定侧边栏，宽度 256px */}
  <div className="flex-1 flex flex-col min-w-0">
    <Header />  {/* 顶部导航 */}
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* 页面内容 */}
      </div>
    </main>
  </div>
</div>
```

### 9.2 后台侧边栏样式

```tsx
className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen flex flex-col shadow-xl"

// 菜单项
className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
  isActive
    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
}`}
```

### 9.3 后台卡片组件

```tsx
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-slate-500">
      标题
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-slate-900">
      {data}
    </div>
  </CardContent>
</Card>
```

---

## 10. 双语支持规范

### 10.1 文本组织

```tsx
const content = {
  zh: { title: "标题", desc: "描述" },
  en: { title: "Title", desc: "Description" }
}[language]

// 或使用三元表达式
{language === "zh" ? "中文" : "English"}
```

### 10.2 字段命名

后端数据结构应使用双字段命名：
- `name_zh` / `name_en`
- `intro_zh` / `intro_en`
- `content_zh` / `content_en`

---

## 11. 代码规范

### 11.1 组件文件结构

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

  // ... 组件逻辑

  return (
    <div className="...">
      {/* JSX */}
    </div>
  )
}
```

### 11.2 样式顺序

1. 布局类 (`flex`, `grid`, `absolute`)
2. 尺寸类 (`w-`, `h-`, `p-`, `m-`)
3. 外观类 (`bg-`, `border-`, `rounded-`)
4. 交互类 (`hover:`, `focus:`, `active:`)
5. 响应式类 (`sm:`, `md:`, `lg:`)

---

## 12. 常用工具类速查

### 文本
```tsx
text-white / text-gray-900           // 主文本
text-gray-400 / text-gray-600        // 次要文本
text-orange-400 / text-orange-500    // 强调文本
font-medium / font-bold              // 字重
text-sm / text-lg / text-xl          // 字号
```

### 背景
```tsx
bg-black / bg-white                 // 背景
bg-gray-900 / bg-gray-100           // 灰色背景
bg-gradient-to-r from-blue-500 to-purple-500  // 渐变背景
```

### 边框与圆角
```tsx
border border-gray-800 / border-gray-200
rounded-xl / rounded-2xl / rounded-full
```

### 阴影
```tsx
shadow-lg shadow-blue-500/30
shadow-2xl shadow-blue-500/10
```

### 间距
```tsx
gap-4 / gap-6 / gap-8
space-y-4 / space-y-6
p-4 / p-6 / py-16
```

---

## 13. 注意事项

1. **必须使用 ThemeProvider**：所有主题相关的样式必须通过 `useTheme()` hook 获取当前主题
2. **移动端优先**：先设计移动端样式，再通过 `sm:`, `md:`, `lg:` 添加桌面端适配
3. **图片优化**：使用 Next.js Image 组件，配置 `quality` 和 `placeholder`
4. **性能考虑**：非首屏图片使用 `loading="lazy"`
5. **无障碍**：确保颜色对比度足够，按钮有适当的焦点状态

---

## 14. 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2026-05-20 | v1.0 | 初始版本，定义前台和后台UI规范 |
