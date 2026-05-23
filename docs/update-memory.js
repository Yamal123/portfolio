#!/usr/bin/env node

/**
 * 项目记忆更新工具
 * 用于自动更新项目记忆文档
 */

const fs = require('fs');
const path = require('path');

const MEMORY_FILE = path.join(__dirname, 'PROJECT_MEMORY.md');

/**
 * 添加代码变更记录
 */
function addCodeChange(record) {
  const timestamp = new Date().toISOString().split('T')[0];
  const content = `
### ${timestamp} - 代码变更
- **文件**: ${record.files?.join(', ') || 'N/A'}
- **内容**: ${record.description}
- **影响**: ${record.impact || '无明显影响'}
- **测试**: ${record.tested ? '✅ 通过' : '⏳ 待测试'}
`;
  
  appendToSection('## 🔧 技术债务与优化记录（决策记忆）', '### 已解决的问题', content);
}

/**
 * 添加发布记录
 */
function addReleaseRecord(record) {
  const timestamp = new Date().toISOString().split('T')[0];
  const content = `
### ${timestamp} - 第${record.version}次发布
- **内容**: ${record.content}
- **测试**: ${record.tested ? '✅ 通过' : '⏳ 待测试'}
`;
  
  appendToSection('## 🚀 发布记录（短期记忆）', `### ${timestamp}`, content);
}

/**
 * 添加决策记录
 */
function addDecisionRecord(record) {
  const timestamp = new Date().toISOString().split('T')[0];
  const content = `
### ${timestamp}: ${record.title}
- **决策**: ${record.decision}
- **原因**: ${record.reason}
- **结果**: ${record.result}
`;
  
  appendToSection('## 💡 重要决策记录', `### ${timestamp}: ${record.title}`, content);
}

/**
 * 添加问题记录
 */
function addProblemRecord(record) {
  const timestamp = new Date().toISOString().split('T')[0];
  const content = `
### ${timestamp} - 问题 #${record.id}
- **问题**: ${record.description}
- **位置**: ${record.location}
- **严重程度**: ${record.severity}
- **状态**: ${record.status}
`;
  
  appendToSection('## 🐛 问题记录', `### ${timestamp} - 问题 #${record.id}`, content);
}

/**
 * 追加内容到指定部分
 */
function appendToSection(sectionHeader, subsectionHeader, content) {
  try {
    let fileContent = fs.readFileSync(MEMORY_FILE, 'utf8');
    
    // 找到主部分的位置
    const sectionIndex = fileContent.indexOf(sectionHeader);
    if (sectionIndex === -1) {
      console.log('未找到指定部分');
      return false;
    }
    
    // 在主部分后插入内容
    const insertIndex = sectionIndex + sectionHeader.length;
    fileContent = fileContent.slice(0, insertIndex) + '\n' + content + fileContent.slice(insertIndex);
    
    fs.writeFileSync(MEMORY_FILE, fileContent);
    console.log('记忆已更新');
    return true;
  } catch (error) {
    console.error('更新记忆失败:', error);
    return false;
  }
}

/**
 * 更新问题状态
 */
function updateProblemStatus(problemId, newStatus) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  try {
    let fileContent = fs.readFileSync(MEMORY_FILE, 'utf8');
    
    // 查找并更新问题状态
    const regex = new RegExp(`(问题 #${problemId}[\\s\\S]*?状态: )(\\w+)`, 'm');
    fileContent = fileContent.replace(regex, `$1${newStatus}（${timestamp}）`);
    
    fs.writeFileSync(MEMORY_FILE, fileContent);
    console.log(`问题 #${problemId} 状态已更新为: ${newStatus}`);
    return true;
  } catch (error) {
    console.error('更新问题状态失败:', error);
    return false;
  }
}

/**
 * 生成对话总结
 */
function generateSummary(sessionChanges) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  const summary = `
## 📝 对话总结 - ${timestamp}

### 本次完成的工作
${sessionChanges.completed?.map(item => `- ${item}`).join('\n') || '- 无'}

### 修改的文件
${sessionChanges.files?.map(file => `- ${file}`).join('\n') || '- 无'}

### 遇到的问题
${sessionChanges.problems?.map(prob => `- ${prob}`).join('\n') || '- 无'}

### 下一步计划
${sessionChanges.nextSteps?.map(step => `- ${step}`).join('\n') || '- 无'}

---
`;
  
  return summary;
}

// 导出函数
module.exports = {
  addCodeChange,
  addReleaseRecord,
  addDecisionRecord,
  addProblemRecord,
  updateProblemStatus,
  generateSummary,
};

// 如果直接运行，显示使用说明
if (require.main === module) {
  console.log(`
📚 项目记忆更新工具

使用方法：

1. 添加代码变更记录:
   const memory = require('./update-memory');
   memory.addCodeChange({
     files: ['app/admin/projects/page.tsx'],
     description: '优化 UI 设计',
     impact: '提升用户体验',
     tested: true
   });

2. 添加发布记录:
   memory.addReleaseRecord({
     version: 6,
     content: 'UI 优化和记忆系统',
     tested: true
   });

3. 添加决策记录:
   memory.addDecisionRecord({
     title: '采用新的设计规范',
     decision: '统一 UI 组件样式',
     reason: '提升一致性和可维护性',
     result: 'UI 质量显著提升'
   });

4. 更新问题状态:
   memory.updateProblemStatus('P0-001', '已解决');

5. 生成对话总结:
   const summary = memory.generateSummary({
     completed: ['修复了 Project 接口'],
     files: ['types/admin/index.ts'],
     problems: [],
     nextSteps: ['继续优化 UI']
   });
  `);
}
