# 记忆系统使用指南

## 📚 记忆系统概述

本项目采用三层记忆系统，用于记录项目的发展历程和重要决策：

1. **长期记忆（项目画像）** - 项目核心信息
2. **短期记忆（变更记录）** - 日常开发和发布记录
3. **决策记忆（重要记录）** - 版本历史和重大决策

## 📁 文件结构

```
docs/
├── PROJECT_MEMORY.md      # 项目记忆主文档
├── ISSUE_TRACKER.md      # 问题追踪清单
├── update-memory.js       # 记忆更新工具
└── MEMORY_GUIDE.md       # 本文档
```

## 🔧 手动更新方法

### 1. 更新项目画像

在 `PROJECT_MEMORY.md` 中编辑 **项目画像（长期记忆）** 部分：

```markdown
## 📊 项目画像（长期记忆）

### 项目概述
- **项目名称**: 个人作品网站
- **开发时间**: 2024-2026
- **技术栈**: ...
```

### 2. 添加版本历史

在 **版本历史（决策记忆）** 部分添加新版本：

```markdown
### v2.4.0 - 新功能（日期）
- 完成的功能列表
- 优化内容
```

### 3. 记录技术变更

在 **技术债务与优化记录（决策记忆）** 部分添加：

```markdown
### 日期 - 变更描述
- **问题**: 问题描述
- **影响**: 影响说明
- **解决方案**: 如何解决
- **结果**: 解决效果
```

### 4. 添加发布记录

在 **发布记录（短期记忆）** 部分添加：

```markdown
### 日期 - 第N次发布
- **内容**: 发布内容
- **测试**: ✅/❌
```

### 5. 记录重要决策

在 **重要决策记录** 部分添加：

```markdown
### 日期: 决策标题
- **决策**: 具体决策内容
- **原因**: 为什么做这个决定
- **结果**: 实施效果
```

## 🤖 自动更新工具

使用 `update-memory.js` 脚本自动更新记忆：

### 安装依赖

脚本使用 Node.js 内置模块，无需额外安装。

### 使用示例

```javascript
const memory = require('./update-memory.js');

// 1. 添加代码变更记录
memory.addCodeChange({
  files: ['app/admin/projects/page.tsx'],
  description: '优化 UI 设计',
  impact: '提升用户体验',
  tested: true
});

// 2. 添加发布记录
memory.addReleaseRecord({
  version: 6,
  content: 'UI 优化和记忆系统',
  tested: true
});

// 3. 添加决策记录
memory.addDecisionRecord({
  title: '采用新的设计规范',
  decision: '统一 UI 组件样式',
  reason: '提升一致性和可维护性',
  result: 'UI 质量显著提升'
});

// 4. 更新问题状态
memory.updateProblemStatus('P0-001', '已解决');

// 5. 生成对话总结
const summary = memory.generateSummary({
  completed: ['修复了 Project 接口'],
  files: ['types/admin/index.ts'],
  problems: [],
  nextSteps: ['继续优化 UI']
});
```

### 运行脚本

```bash
node docs/update-memory.js
```

## 📝 更新频率建议

### 每次对话后
- 记录本次对话完成的工作
- 更新发布记录（如有发布）
- 记录遇到的问题和解决方案

### 每周
- 回顾项目进展
- 更新开发统计
- 检查待办事项

### 每月
- 更新版本历史
- 回顾重要决策
- 优化文档结构

## 🎯 最佳实践

### 1. 及时记录
- 完成重要工作后立即记录
- 遇到问题时记录解决方案
- 做决策时记录原因和预期

### 2. 详细描述
- 记录文件路径和行号
- 说明影响范围
- 附上测试结果

### 3. 分类整理
- 区分不同类型的记录
- 使用统一的格式
- 定期整理和归档

### 4. 索引关联
- 在相关文档间建立链接
- 使用标签和分类
- 创建索引目录

## 🔍 常用命令

### 查看记忆文档
```bash
# 查看项目记忆
cat docs/PROJECT_MEMORY.md

# 查看问题追踪
cat docs/ISSUE_TRACKER.md

# 搜索特定内容
grep "关键字" docs/PROJECT_MEMORY.md
```

### 备份记忆
```bash
# 复制记忆文档
cp docs/PROJECT_MEMORY.md docs/backup/PROJECT_MEMORY_$(date +%Y%m%d).md

# 复制问题追踪
cp docs/ISSUE_TRACKER.md docs/backup/ISSUE_TRACKER_$(date +%Y%m%d).md
```

### 导出报告
```bash
# 生成项目报告
echo "# 项目进度报告" > report.md
echo "更新时间: $(date)" >> report.md
echo "" >> report.md
echo "## 问题统计" >> report.md
grep "| P" docs/ISSUE_TRACKER.md | wc -l >> report.md
```

## 📊 统计指标

建议在记忆文档中维护以下统计：

### 问题统计
- 总问题数
- 已解决问题数
- 待解决问题数
- 各优先级问题数

### 开发统计
- 代码提交次数
- 发布次数
- 功能完成数
- Bug 修复数

### 性能指标
- TypeScript 编译错误数
- 代码覆盖率
- 页面加载时间
- 性能评分

## 🔄 自动化建议

### 使用 Git Hooks
在 `.git/hooks/pre-commit` 中添加检查：

```bash
#!/bin/bash
# 检查是否更新了记忆文档
if ! git diff --name-only | grep -q "docs/PROJECT_MEMORY.md"; then
  echo "⚠️ 建议更新项目记忆文档"
fi
```

### CI/CD 集成
在 GitHub Actions 中自动生成报告：

```yaml
name: Generate Report
on: [push]
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate weekly report
        run: |
          echo "# 周报" > report.md
          echo "生成日期: $(date)" >> report.md
```

## 💡 提示

1. **保持简洁** - 记录关键信息，避免冗余
2. **定期整理** - 归档旧记录，保持文档整洁
3. **关联索引** - 建立文档间的链接关系
4. **版本控制** - 将记忆文档纳入 Git 管理
5. **定期回顾** - 从历史记录中学习经验

## 📞 反馈与改进

如果记忆系统有任何问题或建议，请随时反馈：
- 优化文档结构
- 改进记录格式
- 添加新的功能

---

> 📅 最后更新: 2026-05-18
> 🔧 维护者: AI Assistant
> 📝 版本: 1.0.0
