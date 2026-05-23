import type { Article } from '@/types/article'

export const agentLoopArticle: Article = {
  id: 13,
  slug: 'agent-perception-decision-action-loop',
  title: {
    zh: 'Agent 如何实现「感知→判断→行动→再感知」闭环',
    en: 'How Agents Close the Loop: Perceive, Decide, Act, and Perceive Again',
  },
  createdAt: '2026-05-21',
  intro: {
    zh: '从产品经理视角拆解 Agent 的本质：不是更聪明的聊天机器人，而是具备闭环能力的任务执行系统。含架构图、ReAct 与落地清单。',
    en: 'A PM-oriented breakdown of agents as closed-loop task systems—not smarter chatbots—with architecture diagrams, ReAct, and a practical checklist.',
  },
  keywords: ['Agent', 'AI产品经理', 'ReAct', 'MCP', '闭环', 'Tool Calling'],
  content: {
    zh: `# Agent 如何实现「感知 → 判断 → 行动 → 再感知」闭环

> 很多 Demo 看起来很聪明，上线后却失控——根因往往不是模型不够强，而是**没有形成真正的闭环工程**。

## 一、为什么 Agent 会成为下一代产品形态

传统软件是「用户点击 → 系统执行 → 返回结果」的功能型系统。Agent 改变的是交互范式：

- 持续观察环境
- 理解目标并规划
- 调用工具产生真实影响
- 根据反馈不断修正行为

AI 客服、编程助手、销售跟进、行程助理……背后依赖的都是同一套机制。产品经理需要把它看成**持续运行的状态机**，而不是一次性问答。

![Agent 核心闭环：感知、判断、行动、再感知](/images/blog/agent-loop.svg)

## 二、ChatBot 与 Agent 的根本区别

| 维度 | ChatBot | Agent |
|------|---------|-------|
| 交互 | 一次问答 | 持续任务 |
| 能力 | 被动响应 | 主动执行 |
| 环境 | 无状态 | 有感知与反馈 |
| 输出 | 文字 | 工具调用 + 结果验证 |
| 智能来源 | Prompt | 闭环 + Runtime |

**结论**：Agent 的竞争力 = Tool Ecosystem + Workflow + Feedback，而不只是模型参数。

## 三、四层架构：PM 必须对齐的模块

![产品经理视角：Agent 四层架构](/images/blog/agent-layers.svg)

- **感知层**：用户输入、系统状态、外部 API、上一步工具返回
- **决策层**：目标理解、任务拆解、ReAct/Planning、Reflection
- **行动层**：Function Calling、Tool Registry、MCP、Browser Agent
- **记忆层**：短期上下文、长期偏好、Context Engineering

产品失败常见原因：能调工具但不检查结果、能规划但不读环境变化、有记忆但不会修正策略。

## 四、第一步：感知（Perception）

感知 = **获取当前环境状态**。来源包括：

1. **用户输入** — 「帮我订明天去上海的机票」
2. **系统状态** — 账户、页面、订单、CRM
3. **外部环境** — 天气、库存、代码仓库、数据库
4. **执行反馈** — API 返回 \`{ "status": "failed", "reason": "库存不足" }\`

LLM 不会自动知道环境，必须做 **Context Engineering**：把目标、时间、约束、可用工具结果组装进上下文窗口。成熟系统还会用**事件驱动**（邮件到达、Webhook、定时任务）触发新一轮感知，而不是无脑轮询。

## 五、第二步：判断（Reasoning）

判断包含三件事：**理解目标**、**任务拆解**、**决策规划**。

### ReAct：最经典的闭环范式

ReAct = Reason + Act，关键是 **Observation（观察反馈）**：

![ReAct 模式：Thought -> Action -> Observation](/images/blog/react-pattern.svg)

\`\`\`text
Thought: 需要先查航班
Action: search_flight()
Observation: 直飞超预算，有中转方案
Thought: 推荐中转并进入预订
\`\`\`

此外还有 Chain of Thought、Tree of Thoughts、**Reflection（元推理）**——分析自己为何失败并调整，是从「聊天」进化到「执行系统」的关键。

企业落地更常见的是 **Hybrid Planner**：固定工作流 + 局部 LLM 决策，追求**可预测性**而非完全自治。

## 六、第三步：行动（Action）

行动不是输出文字，而是**对外部世界产生真实影响**：调 API、改库、发邮件、点击页面。

要点：

- 模型只**决定**调用哪个工具与参数，**真正执行**在外部系统
- **Tool Description** 要清晰，本质是语义路由
- **MCP** 统一接入文件、GitHub、浏览器、企业系统，降低集成成本

Browser Agent 难在 Web 非结构化：截图 → 理解 → 点击 → 再截图，本质是强感知 + 强反馈的机器人问题。

## 七、第四步：再感知（Feedback Loop）——真正的分水岭

很多人以为 Agent = GPT + Tool Calling。实际上，智能上限取决于：

> **是否会读取执行结果，并修正下一步行为。**

\`\`\`text
Action: 下单
Observation: 库存不足
Thought: 换 SKU 或推荐替代品
Action: 再次下单
\`\`\`

没有外部校验（再查库、再看页面），就会出现**幻觉成功**——口头说完成，实际未达成。

工程上需要：**状态机**、**记忆分层**、**重试/降级/超时**、**Human-in-the-loop**（支付前确认）。Agent 产品最终拼的是 **AI + 工程体系**。

## 八、完整示例：AI 旅行助手

1. **感知**：用户目标 + 城市 + 预算 + 历史偏好  
2. **规划**：查航班 → 比价 → 预订 → 支付  
3. **行动**：\`search_flight()\`  
4. **再感知**：价格超预算 → 改查中转  
5. **二次执行**：完成订票并回传凭证  

## 九、PM 设计清单：先闭环，再选模型

![设计 Agent 产品：PM 四问清单](/images/blog/agent-pm-checklist.svg)

1. **如何感知？** 输入、状态、事件、工具返回是否齐全  
2. **如何决策？** 规划深度、是否关键步骤需人工确认  
3. **如何行动？** 工具权限、幂等、审计、失败处理  
4. **如何再感知？** 外部验证、重试上限、状态持久化  

**不要从 Prompt 开始，从状态转移图开始**；LLM 负责语义与模糊决策，状态/权限/安全由工程系统兜底。

## 十、落地挑战与架构选型

- **幻觉**：结构化输出 + 规则约束 + 执行后校验  
- **长任务**：Checkpoint、中断恢复、Goal Re-grounding  
- **成本**：控制 Tool 轮次、上下文压缩与摘要  
- **架构**：单 Agent（简单）/ Multi-Agent（分工但通信贵）/ **Workflow + Agent**（企业主流）

## 十一、终极认知

Agent 不是「大模型 + Prompt」，而是：

> **基于状态、反馈、记忆、工具与规划的持续运行系统。**

未来竞争将从「谁的模型更强」转向「谁的 Agent 系统工程更强」——Runtime、Context Engineering、Tool Ecosystem 与可控工作流，才是产品壁垒。

---

*本文基于 Agent 闭环机制的产品实践整理，适用于 AI 产品经理做方案评审与架构对齐。*`,
    en: `# How Agents Close the Loop: Perceive, Decide, Act, Perceive Again

> Many demos look smart but fail in production—not because the model is weak, but because **the feedback loop was never engineered**.

## 1. Why agents are the next product paradigm

Traditional software: click → execute → return. Agents:

- Observe the environment continuously
- Plan toward a goal
- Act via tools with real side effects
- Adjust from feedback

Treat agents as a **long-running state machine**, not a one-shot chat UI.

![Agent core loop](/images/blog/agent-loop.svg)

## 2. ChatBot vs Agent

| | ChatBot | Agent |
|---|---------|-------|
| Session | Single Q&A | Ongoing task |
| Output | Text | Tools + verification |
| Intelligence | Prompt | Loop + runtime |

Competitive edge = tools + workflow + feedback, not parameters alone.

## 3. Four layers (PM view)

![Four-layer agent architecture](/images/blog/agent-layers.svg)

Perception, reasoning, action, memory—plus **context engineering** to fill the model window with the right state.

## 4. Perception

Sources: user input, system state, external APIs, **tool results**. Use event-driven triggers and structured context assembly.

## 5. Reasoning & ReAct

![ReAct pattern](/images/blog/react-pattern.svg)

Thought → Action → Observation loops until the goal is met. Enterprise stacks usually blend **fixed workflow + local LLM decisions** for predictability.

## 6. Action & tools

Models choose tools; **your platform executes** them. Clear tool descriptions and MCP-style integration define the ceiling.

## 7. Feedback loop

Re-read outcomes, retry, verify externally, add human approval on risky steps. Without this, you only have an API-calling chatbot.

## 8. PM checklist

![PM design checklist](/images/blog/agent-pm-checklist.svg)

Answer: how to perceive, decide, act, and perceive again—**draw the state machine before writing prompts**.

## 9. Summary

Agents are continuous systems: runtime, memory, tools, and feedback—not smarter chat. Engineering the loop beats chasing the largest model name.`,
  },
}
