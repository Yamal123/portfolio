# 项目文档目录

本目录包含 AI PM Portfolio 项目的所有设计和技术文档。

## 📁 目录结构

```
docs/
├── prd/                    # 产品需求文档
│   ├── PRD.md             # 主站产品需求文档
│   └── aipmym-admin-prd.md # 后台管理系统PRD
│
├── database/               # 数据库相关文档
│   ├── aipmym-admin-db.md     # 数据库表设计（12张核心表）
│   └── aipmym-admin-db-init.md # 数据库初始化脚本（含基础数据）
│
├── api/                    # API与交互规范
│   └── aipmym-admin-interaction.md # 前后端交互规范
│
└── README.md              # 本文件
```

## 📄 文档说明

### 产品需求（prd/）
- **PRD.md**: 主站功能需求，涵盖前台展示模块
- **aipmym-admin-prd.md**: 后台管理系统完整需求，15个业务模块

### 数据库设计（database/）
- **aipmym-admin-db.md**: MySQL数据库12张核心表结构设计
- **aipmym-admin-db-init.md**: 可直接执行的数据库初始化脚本，包含：
  - 默认管理员账号（admin / 123456）
  - 默认分类数据
  - 基础配置信息

### 接口规范（api/）
- **aipmym-admin-interaction.md**: 完整的前后端协同规范，包括：
  - 请求/响应格式定义
  - 数据格式规范
  - 异常处理机制
  - 权限校验规则
  - 字段映射关系

## 🔧 使用指南

1. **开发前必读**: `prd/aipmym-admin-prd.md` → `database/aipmym-admin-db.md` → `api/aipmym-admin-interaction.md`
2. **数据库初始化**: 直接执行 `database/aipmym-admin-db-init.md` 中的SQL脚本
3. **接口对接**: 参考 `api/aipmym-admin-interaction.md` 进行前后端联调

## 📝 文档维护

- 所有文档均为 Markdown 格式，AI 可直接解析
- 数据库脚本可直接复制执行，无需修改
- 接口规范与代码实现保持同步更新