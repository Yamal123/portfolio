# Agent 层说明

网站内置 Agent 层，供聊天组件与任意前端模块调用，支持**工具调用**与**规则/LLM 双模式**。

## 架构

```
网页 (ChatPanel / useAgent)
    → POST /api/agent/chat
        → lib/agent/runner.ts
            ├─ rules 模式 → 意图识别 → executeTool()
            └─ llm 模式   → OpenAI Function Calling → executeTool()
```

## 内置工具

| 工具名 | 说明 |
|--------|------|
| `search_projects` | 搜索作品集 |
| `list_skills` | 列出技能 |
| `search_articles` | 搜索方法论文章 |
| `get_contact_info` | 联系方式 |
| `get_site_info` | 站点导航 |

## 环境变量

见项目根目录 `.env.example` 中 `AGENT_*` 与 `OPENAI_*` 配置。

## 网页调用示例

```tsx
import { useAgent } from '@/hooks/useAgent'

const { sendMessage, isLoading, lastResponse } = useAgent('zh')

await sendMessage('有哪些 AI 项目？')
```

或直接调用 API：

```ts
import { callAgentChat } from '@/lib/agent/client'

const result = await callAgentChat({
  message: '如何联系作者？',
  locale: 'zh',
})
```

## 扩展新工具

1. 在 `lib/agent/tools/` 新建工具文件，实现 `AgentTool` 接口
2. 在 `lib/agent/tools/index.ts` 注册
3. 规则模式可在 `lib/agent/rules.ts` 增加意图映射（可选）

## 接口

- `POST /api/agent/chat` — 对话
- `GET /api/agent/tools` — 列出可用工具与当前模式
