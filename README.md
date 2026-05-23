# 个人作品网站

> 现代化、高效的个人作品展示平台，包含前台展示和后台管理系统

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Git

### 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd 个人作品网站

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建生产版本

```bash
npm run build
npm start
```

---

## 📁 项目结构

```
├── app/                    # Next.js 15 App Router
│   ├── admin/             # 后台管理系统
│   │   ├── login/        # 登录页面
│   │   ├── projects/     # 项目管理
│   │   ├── skills/       # 技能管理
│   │   └── profile/      # 个人信息
│   ├── api/              # API 路由
│   └── page.tsx          # 首页
├── components/           # React 组件
│   ├── ui/              # UI 基础组件
│   └── admin/           # 后台管理组件
├── lib/                 # 工具库
│   ├── api/            # API 客户端
│   └── admin/          # 管理后台工具
├── types/              # TypeScript 类型定义
├── data/               # 模拟数据
├── contexts/          # React Context
└── docs/              # 项目文档
```

---

## 🎯 核心功能

### 1. 前台展示
- ✅ 项目作品展示
- ✅ 技能展示
- ✅ 中英文双语切换
- ✅ 响应式设计（PC/平板/手机）
- ✅ SEO 优化

### 2. 后台管理
- ✅ 用户认证与授权
- ✅ 项目管理（CRUD）
- ✅ 技能管理（CRUD）
- ✅ 个人信息管理
- ✅ 现代化 UI 设计

### 3. 技术特性
- ✅ TypeScript 类型安全
- ✅ 组件化开发
- ✅ API 统一管理
- ✅ 错误处理机制
- ✅ 请求超时处理

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15 + React 19 |
| 语言 | TypeScript 5 |
| UI | shadcn/ui + Tailwind CSS |
| 状态管理 | React Context + SWR |
| 后端 | Node.js + Fastify |
| 数据库 | SQLite |
| 部署 | Vercel |

---

## 📚 文档导航

### 开发规范

- 📖 [SDD 开发流程](./docs/SDD_PROCESS.md) - **开发前必读**
- 📖 [项目记忆系统](./docs/PROJECT_MEMORY.md) - 项目发展历程
- 📖 [问题追踪清单](./docs/ISSUE_TRACKER.md) - 所有问题的记录
- 📖 [记忆使用指南](./docs/MEMORY_GUIDE.md) - 如何使用记忆系统

### 技术文档

- 📖 [API 文档](./docs/API_DOCUMENTATION.md) - 接口说明
- 📖 [组件指南](./docs/COMPONENT_GUIDE.md) - UI 组件使用
- 📖 [部署指南](./docs/DEPLOYMENT.md) - 部署说明

---

## 🔄 开发流程

### 1. 开发前准备

```bash
# 确保代码最新
git pull origin main

# 检查 TypeScript 编译
npx tsc --noEmit

# 查看问题追踪
cat docs/ISSUE_TRACKER.md
```

### 2. 开发过程

遵循 SDD 流程：

1. **需求确认** → 明确要做什么
2. **方案设计** → 设计解决方案
3. **代码开发** → 实现功能
4. **测试验证** → 确保质量
5. **文档更新** → 记录变更
6. **发布上线** → 部署应用

### 3. 开发后检查

- [ ] TypeScript 编译无错误
- [ ] 单元测试通过
- [ ] 手动测试完成
- [ ] 文档已更新
- [ ] 记忆已记录

---

## 📊 项目统计

### 进度统计

- **总问题数**: 30 个
- **已解决**: 27 个 (90%)
- **待处理**: 3 个
- **发布次数**: 5 次

### 技术债务

- TypeScript 编译错误: 0 个 ✅
- 代码覆盖率: 85%
- 文档完整度: 90%

---

## 🎨 设计规范

### 颜色体系

```css
/* 主色调 */
.blue-500: #3b82f6  /* 主要按钮、链接 */
.blue-600: #2563eb  /* 悬停状态 */

/* 语义色 */
.green-500: #22c55e  /* 成功状态 */
.red-500: #ef4444    /* 错误、删除 */
.yellow-500: #eab308 /* 警告状态 */

/* 中性色 */
.gray-900: #111827  /* 主要文字 */
.gray-700: #374151  /* 次要文字 */
.gray-500: #6b7280  /* 辅助文字 */
```

### 组件规范

```typescript
// 按钮高度
Button: h-11 (44px)  // 主要操作
Button: h-10 (40px)  // 次要操作

// 输入框
Input: h-11 (44px)

// 间距
space-y-2  // 紧凑
space-y-4  // 标准
space-y-6  // 宽松
```

---

## 🚀 部署指南

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 环境变量

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.com
DATABASE_URL=./data.db
```

---

## 🤝 贡献指南

### 分支管理

- `main` - 主分支，稳定版本
- `develop` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支

### 提交规范

```bash
# 格式
<type>: <subject>

# 示例
git commit -m "feat: 添加项目详情页"
git commit -m "fix: 修复登录问题"
git commit -m "docs: 更新 README"
```

---

## 📞 联系方式

- **开发者**: [你的名字]
- **邮箱**: [你的邮箱]
- **网站**: [你的网站]

---

## 📄 许可证

MIT License

---

> 📅 项目启动: 2024
> 🔧 最后更新: 2026-05-18
> 📝 文档版本: 2.3.0
