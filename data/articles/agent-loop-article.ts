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
    zh: '从产品经理视角拆解 Agent 的本质：不是更聪明的聊天机器人，而是具备闭环能力的任务执行系统。结合极兔AI客服实战，讲清楚感知层设计、ReAct决策模式、工具调用体系与反馈闭环的落地方法。',
    en: 'A PM-oriented breakdown of agents as closed-loop task systems. Drawing from J&T Express AI customer service实战, this article covers perception design, ReAct decision patterns, tool-calling architecture, and feedback loop engineering.',
  },
  keywords: ['Agent', 'AI产品经理', 'ReAct', 'MCP', '闭环', 'Tool Calling', 'Multi-Agent'],
  content: {
    zh: `# Agent 如何实现「感知→判断→行动→再感知」闭环

> 很多 Demo 看起来很聪明，上线后却失控——根因往往不是模型不够强，而是**没有形成真正的闭环工程**。

作为一名 AI 产品经理，我在极兔速递主导 AI 客服系统时，最深刻的体会是：**Agent 不是 ChatBot 的升级版，而是一种全新的产品形态**。它不是在等用户提问然后回答，而是持续感知环境、做出判断、采取行动、根据反馈调整——形成一个完整的闭环。

这篇文章将从产品经理视角，结合实战经验，把 Agent 闭环的每个环节拆开来讲清楚。

---

## 一、为什么 Agent 会成为下一代产品形态

传统软件是「用户点击 → 系统执行 → 返回结果」的功能型系统。用户承担了所有的判断和决策责任。Agent 改变的是交互范式：

- **持续观察环境** — 不只是看用户说了什么，还看系统状态、外部数据、历史记录
- **理解目标并规划** — 把模糊的用户需求拆解为可执行的任务序列
- **调用工具产生真实影响** — 不只是回复文字，而是查数据库、创建工单、发送通知
- **根据反馈修正行为** — 执行结果不对就调整策略，而不是硬着头皮往下走

**AI 客服、编程助手、销售跟进、行程助理**……背后依赖的都是同一套机制。产品经理需要把它看成**持续运行的状态机**，而不是一次性问答。

### 为什么要从 PM 视角理解 Agent？

工程师关注的是"能不能调通 API"，PM 关注的是"系统能不能在真实场景下稳定完成任务"。这两者的差距，恰恰体现在闭环设计的完整性上。我在极兔的实践告诉我：**Agent 产品的竞争力 = 工具生态 + 工作流设计 + 反馈机制，而不只是模型参数**。

---

## 二、ChatBot 与 Agent 的根本区别

很多团队犯的第一个错误，就是把 Agent 当 ChatBot 来做。两者有本质差异：

| 维度 | ChatBot | Agent |
|------|---------|-------|
| 交互模式 | 一次问答 | 持续任务执行 |
| 能力边界 | 被动响应 | 主动规划和执行 |
| 环境感知 | 无状态，只看当前输入 | 有状态，持续感知环境和反馈 |
| 输出形式 | 文字回复 | 工具调用 + 结果验证 + 文字 |
| 智能来源 | Prompt 质量 | 闭环机制 + Runtime 工程 |
| 失败处理 | 道歉或重复 | 重试、降级、或上报人工 |
| 产品指标 | 回答准确率 | 任务完成率 + 闭环效率 |

**结论**：如果你们团队正在做一个 Agent 产品，却只用"回答准确率"来衡量效果，那大概率还是在做 ChatBot。Agent 的核心指标应该是**任务完成率**和**闭环效率**——用户的问题有没有被真正解决，而不是模型有没有给出漂亮的回复。

---

## 三、四层架构：PM 必须对齐的模块

从产品架构角度看，一个完整的 Agent 系统有四层：

### 🧠 感知层（Perception）

感知 = 获取当前环境状态。来源包括：

1. **用户输入** — 自然语言、表单、点击事件
2. **系统状态** — 账户信息、订单状态、CRM 数据、工单系统
3. **外部环境** — 天气、库存、物流追踪、代码仓库
4. **执行反馈** — API 返回 \`{ "status": "failed", "reason": "库存不足" }\`

LLM 不会自动知道环境，必须做 **Context Engineering**：把目标、时间、约束、可用工具结果组装进上下文窗口。

> 💡 **实战经验**：在极兔 AI 客服中，感知层是我们花最多精力优化的地方。用户说"我的包裹怎么还没到"，系统需要感知的不只是这句话，还有用户 ID、订单状态、物流轨迹、预计送达时间、客服历史记录——所有这些信息必须在一次请求中组装好送入模型。感知层设计的好坏，直接决定了后续所有环节的上限。

成熟系统还会用**事件驱动**（邮件到达、Webhook、定时任务）触发新一轮感知，而不是无脑轮询。

### 🧭 决策层（Reasoning）

决策包含三件事：**理解目标**、**任务拆解**、**决策规划**。

#### ReAct：最经典的闭环范式

ReAct = Reason + Act，关键是 **Observation（观察反馈）**：

\`\`\`text
Thought: 用户问包裹状态，需要先查物流信息
Action: query_logistics(user_id="U12345")
Observation: 包裹已到达目的城市，但最后一公里配送超48小时
Thought: 判断为配送异常，需要创建工单并通知用户
Action: create_ticket(type="delivery_delay", priority="high")
Observation: 工单创建成功，系统返回工单号 TK-20260521
Thought: 向用户回复处理结果并提供工单号
\`\`\`

此外还有 **Reflection（元推理）**——Agent 分析自己为何失败并调整策略，这是从"聊天"进化到"执行系统"的关键能力。

> 💡 **实战经验**：在极兔，我们采用的是 **Hybrid Planner** 模式——固定工作流 + 局部 LLM 决策。简单说：主流程由产品经理设计好（比如"查物流→判断异常→创建工单→回复用户"），LLM 只在需要判断的节点发挥作用（比如"这个状态算不算异常"）。这种方式既有灵活性，又保证了**可预测性**——做 Agent 产品，可控比聪明更重要。

### ⚡ 行动层（Action）

行动不是输出文字，而是**对外部世界产生真实影响**：调 API、改数据库、发邮件、创建工单、点击页面。

**关键要点**：

1. **模型只决定调用哪个工具与参数**，真正执行在外部系统——这是安全边界
2. **Tool Description 要清晰**——模型通过描述理解工具用途，这本质是语义路由
3. **工具返回结构要规范**——模型需要从返回结果中提取关键信息
4. **MCP 统一接入**——文件、GitHub、浏览器、企业系统都可以通过 MCP 标准化对接

### 💾 记忆层（Memory）

- **短期上下文** — 当前任务的对话历史和执行轨迹
- **长期偏好** — 用户的历史偏好、常用设置、过往问题
- **Context Engineering** — 如何在有限的上下文窗口中塞入最有价值的信息

> 💡 **产品失败常见原因**：能调工具但不检查结果、能规划但不读环境变化、有记忆但不会修正策略。这三点，每一个都是闭环断裂的表现。

---

## 四、第一步：感知（Perception）的设计要点

感知层是 Agent 的"眼睛和耳朵"，设计好坏直接决定了后续所有环节的质量。

### 4.1 感知来源分类

| 来源类型 | 示例 | 获取方式 |
|---------|------|---------|
| 直接用户输入 | 文字消息、语音、选择 | 即时获取 |
| 关联业务数据 | 订单、用户档案、历史工单 | API 查询 |
| 系统状态 | 库存、物流轨迹、工单流转 | 系统对接 |
| 外部数据 | 天气、汇率、政策更新 | 第三方 API |
| 执行反馈 | API 返回结果、错误码 | 工具调用返回 |

### 4.2 PM 设计检查清单

- [ ] 用户的每次输入，我能获取到哪些关联数据？
- [ ] 这些数据如何在一次请求中组装好？
- [ ] 如果 API 查询失败，是否有降级策略？
- [ ] 是否需要事件监听（如物流状态变更）来触发感知？
- [ ] 感知数据的时效性如何——缓存多久？

### 4.3 实战案例：极兔 AI 客服的感知层

用户在微信上问"我的包裹到哪里了"，系统感知流程：
1. 通过用户手机号关联到最近的 5 个包裹
2. 调用物流 API 获取每个包裹的实时轨迹
3. 检测是否有异常（超时、退回、签收失败）
4. 获取用户最近 3 次的客服咨询记录
5. 将所有信息组装为结构化 Context
6. 送入 LLM 进行判断

这个过程从用户发出消息到 LLM 接收到 Context，控制在 **500ms 以内**。感知速度直接影响了用户的等待体验。

---

## 五、第二步：判断（Reasoning）的核心机制

判断层是 Agent 的"大脑"，也是最容易出现设计偏差的地方。

### 5.1 三种决策模式

| 模式 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| 固定流程 | 标准化的业务场景（如退款流程） | 可控、可预测 | 灵活性差 |
| LLM 自由决策 | 开放域对话、复杂问题 | 灵活、适应性强 | 不可控、有幻觉 |
| Hybrid Planner | 大部分企业场景 | 可控 + 灵活平衡 | 设计复杂 |

### 5.2 ReAct 模式的工程实现

ReAct 不是新的技术概念，它在工程上的落地需要三个组件：

1. **状态寄存器** — 记录当前 Thought、Action、Observation 的完整轨迹
2. **轮次上限** — 防止无限循环，通常设 3-5 轮
3. **终止条件** — 明确什么情况下算"任务完成"

### 5.3 PM 决策检查清单

- [ ] 哪些步骤必须由 LLM 判断？哪些可以硬编码？
- [ ] 如果 LLM 判断错误，业务影响是什么？如何兜底？
- [ ] 计划拆分的粒度：拆太细成本高，拆太粗容易出错
- [ ] 是否需要人工确认环节（Human-in-the-loop）？
- [ ] ReAct 轮次上限设置多少合理？

---

## 六、第三步：行动（Action）的工程体系

### 6.1 Tool 设计原则

| 原则 | 说明 | 反面案例 |
|------|------|---------|
| 单一职责 | 一个 Tool 只做一件事 | create_ticket_and_notify_user 拆成两个 |
| 幂等性 | 重复调用不产生副作用 | 多次创建重复工单 |
| 清晰的输入输出 | 参数和返回值有明确 schema | 用自然语言描述返回结果 |
| 错误返回 | 失败时返回结构化错误信息 | 直接抛异常让模型猜原因 |

### 6.2 Tool 描述的编写技巧

模型通过 Tool Description 来理解工具用途，这决定了工具被调用的准确率：

\`\`\`text
❌ 差：查询订单信息
✅ 好：根据订单ID查询订单的完整信息，包括订单状态、物流信息、商品列表、金额和预计送达时间。适用于用户询问订单状态或物流进度时调用。
\`\`\`

**要点**：
- 说明工具的用途和适用场景
- 说明参数的含义和格式
- 说明返回结果的结构
- 必要时给出调用示例

---

## 七、第四步：再感知（Feedback Loop）——真正的分水岭

很多人以为 Agent = GPT + Tool Calling。实际上，智能上限取决于：

> **是否会读取执行结果，并修正下一步行为。**

### 7.1 闭环断裂的典型案例

\`\`\`text
Action: 下单
Observation: （未检查返回结果）
Thought: 下单成功，通知用户
\`\`\`

这就是**幻觉成功**——系统口头说完成，实际任务并未达成。根本原因是**没有外部校验**。

### 7.2 正确的闭环

\`\`\`text
Action: 提交订单
Observation: API 返回 { "status": "failed", "code": "INVENTORY_SHORTAGE", "reason": "商品X库存不足" }
Thought: 库存不足，需要查找替代商品
Action: search_alternative(product_id="X")
Observation: 找到商品Y（规格相近，库存充足）
Thought: 推荐商品Y给用户并询问是否替换
\`\`\`

### 7.3 反馈闭环的工程要求

- **状态机** — 每个任务有明确的 state 流转
- **结果校验** — 关键操作后必须检查执行结果
- **重试策略** — 失败后按策略重试（立即重试 → 指数退避 → 上报人工）
- **超时机制** — 超过时间未返回结果视为失败
- **Human-in-the-loop** — 高风险操作（支付、删除、修改关键数据）需人工确认

---

## 八、完整实战案例：极兔 AI 客服的闭环设计

### 场景：用户投诉包裹配送超时

**第一步 - 感知**
- 用户输入："我的包裹已经 5 天没动了，到底是怎么回事？"
- 系统自动获取：用户信息 → 关联包裹 → 物流轨迹 → 最近客服记录
- 发现：包裹在转运中心停留超过 72 小时，无更新记录

**第二步 - 判断**
- LLM 判断：配送异常，需要创建升级工单
- 但 LLM 不直接决定工单类型——产品经理预设了规则：超时 > 48 小时自动升级
- LLM 负责的是：判断异常原因、决定客服回复的语气和内容

**第三步 - 行动**
- 调用 \`create_escalation_ticket()\` 创建升级工单
- 调用 \`send_sms_notification()\` 发送短信通知用户
- 调用 \`notify_ops_team()\` 通知运营团队跟进

**第四步 - 再感知**
- 5 分钟后检查工单状态：是否已被运营团队认领
- 30 分钟后检查：是否有处理进展
- 2 小时后如果仍未处理：自动升级到组长
- 每次状态变更自动触发新一轮感知

### 效果数据

这个闭环系统上线后：
- **AI 解决率**：88%（用户问题在第一次交互中被解决）
- **人工咨询量下降**：30%
- **工单处理效率提升**：40%
- **客服查询时长缩短**：45%

---

## 九、PM 设计清单：先闭环，再选模型

### 四问法设计 Agent 产品

1. **如何感知？** 输入、状态、事件、工具返回是否齐全？
2. **如何决策？** 规划深度如何？哪些步骤需人工确认？
3. **如何行动？** 工具权限、幂等性、审计日志、失败处理？
4. **如何再感知？** 外部验证机制、重试上限、状态持久化？

> 💡 **不要从 Prompt 开始，从状态转移图开始。** LLM 负责语义理解与模糊决策，状态管理、权限控制、安全保障由工程系统兜底。

### 落地挑战与对策

| 挑战 | 对策 |
|------|------|
| 幻觉 | 结构化输出 + 规则约束 + 执行后校验 |
| 长任务稳定性 | Checkpoint 机制、中断恢复、目标重对齐 |
| 成本控制 | 限制 Tool 轮次、上下文压缩与摘要 |
| 架构选择 | 简单场景用单 Agent，复杂分工用 Multi-Agent，企业主流是 Workflow + Agent |

---

## 十、我的观点：Agent 的未来竞争

Agent 不是「大模型 + Prompt」，而是：

> **基于状态、反馈、记忆、工具与规划的持续运行系统。**

未来竞争将从「谁的模型更强」转向「谁的 Agent 系统工程更强」：

- **Runtime 稳定性** — 能不能 7×24 稳定运行
- **Context Engineering** — 能不能在有限的窗口中塞入最有价值的信息
- **Tool Ecosystem** — 能不能快速接入各种企业系统
- **可控的工作流** — 能不能在灵活性和确定性之间找到平衡

这些，才是产品经理真正需要关注和设计的东西。

---

*本文基于极兔 AI 客服系统的实战经验整理，适用于 AI 产品经理做 Agent 产品方案评审与架构对齐。*
`,
    en: `# How Agents Close the Loop: Perceive, Decide, Act, Perceive Again

> Many demos look smart but fail in production—not because the model is weak, but because **the feedback loop was never engineered**.

As an AI Product Manager at J&T Express, I learned one thing the hard way: **an Agent is not a smarter chatbot—it's an entirely new product paradigm**. It doesn't wait for questions and answer them; it continuously perceives the environment, makes decisions, takes actions, and adjusts based on feedback.

This article breaks down the agent loop from a PM perspective, grounded in real-world experience.

---

## 1. Why Agents Are the Next Product Paradigm

Traditional software follows a click → execute → return pattern. Agents flip this:

- **Continuous environment perception** — not just user input, but system state, external data, and history
- **Goal-oriented planning** — decompose vague requests into executable task sequences
- **Real-world action** — query databases, create tickets, send notifications
- **Feedback-driven adjustment** — if the result is wrong, change the strategy

**An agent's competitive edge = tool ecosystem + workflow design + feedback mechanism—not parameter count alone.**

---

## 2. ChatBot vs. Agent: The Fundamental Difference

| Dimension | ChatBot | Agent |
|-----------|---------|-------|
| Interaction | Single Q&A | Ongoing task execution |
| Capability | Passive response | Active planning and execution |
| State awareness | Stateless | Stateful, continuously sensing |
| Output | Text | Tool calls + verification + text |
| Intelligence source | Prompt quality | Closed-loop + runtime engineering |
| Failure handling | Apology or retry | Retry, degrade, or escalate to human |
| Key metric | Answer accuracy | Task completion rate + loop efficiency |

---

## 3. The Four-Layer Architecture

### Perception Layer
Sources: user input, system state, external APIs, tool feedback. Requires **Context Engineering** to assemble the right information into the model's context window.

> **At J&T**, we spent the most effort on the perception layer. When a user asks "where's my package," the system needs to sense: user ID, order status, logistics tracking, estimated delivery time, and service history—all assembled in a single request.

### Reasoning Layer
Three functions: **goal understanding, task decomposition, decision planning**.

**ReAct (Reason + Act)** is the classic loop pattern:
\`\`\`text
Thought: Need to check logistics first
Action: query_logistics(user_id="U12345")
Observation: Package arrived but last-mile delayed 48+ hours
Thought: This is a delivery exception, create escalation ticket
Action: create_ticket(type="delivery_delay", priority="high")
\`\`\`

We use a **Hybrid Planner** at J&T: fixed workflow + local LLM decisions. The main flow is designed by PMs; LLM only decides at judgment nodes. This balances flexibility with **predictability**.

### Action Layer
Models decide which tool to call and with what parameters; **your platform executes**. Key requirements:
- Clear tool descriptions (semantic routing)
- Structured return values
- MCP-style standardized integration

### Memory Layer
- Short-term: conversation history and execution trace
- Long-term: user preferences and past issues
- Context Engineering: maximize value within limited window

---

## 4. Perception Design Checklist

- [ ] What related data can I access for each user input?
- [ ] How is this data assembled in a single request?
- [ ] Are there fallback strategies for API failures?
- [ ] Should event-driven triggers be used?
- [ ] What is the data freshness/cache policy?

---

## 5. Reasoning Mechanisms

Five decision patterns:

| Pattern | Use Case | Pros | Cons |
|---------|---------|------|------|
| Fixed workflow | Standardized business logic | Predictable | Rigid |
| LLM free decision | Open-domain dialogue | Flexible | Uncontrollable, hallucination |
| Hybrid Planner | Most enterprise scenarios | Balanced | Complex to design |

---

## 6. Action Engineering

### Tool Design Principles
- **Single responsibility**: one tool, one job
- **Idempotency**: repeated calls produce no side effects
- **Clear I/O**: structured parameters and return values
- **Error reporting**: structured error information on failure

### Tool Description Best Practice
\`\`\`text
❌ Bad: Query order info
✅ Good: Query complete order information by order ID, including status,
   logistics, items, amount, and estimated delivery.
   Use when users ask about order status or shipping progress.
\`\`\`

---

## 7. The Feedback Loop—The Real Differentiator

Many teams think Agent = GPT + Tool Calling. The real ceiling is:

> **Whether the system reads execution results and adjusts the next action.**

Without external verification, you get **hallucinated success**—the system says it's done when it isn't.

### Engineering Requirements for Feedback

- **State machine**: each task has explicit state transitions
- **Result validation**: verify outcomes after critical operations
- **Retry strategy**: immediate → exponential backoff → escalate to human
- **Timeout handling**: no response within time = failure
- **Human-in-the-loop**: high-risk operations require manual confirmation

---

## 8. Case Study: J&T AI Customer Service

### Scenario: User complains about delivery delay

1. **Perceive**: input → user profile → package tracking → service history → anomaly detected (72h delay)
2. **Reason**: PM-defined rule (48h+ = escalate) + LLM decides response tone and content
3. **Act**: create escalation ticket + SMS notification + ops team notification
4. **Re-perceive**: check ticket status after 5min → 30min → 2h → auto-escalate if unhandled

### Results
- **88% AI resolution rate**
- **30% reduction in manual inquiries**
- **40% improvement in ticket processing efficiency**
- **45% reduction in query resolution time**

---

## 9. PM Design Checklist

**Four questions for every agent product:**

1. **Perception**: Are input, state, events, and tool feedback covered?
2. **Reasoning**: What's the planning depth? Where's human approval needed?
3. **Action**: Tool permissions, idempotency, audit trail, failure handling?
4. **Re-perception**: External validation, retry limits, state persistence?

> **Start with a state transition diagram, not a prompt.** LLM handles semantics and fuzzy decisions; engineering systems handle state, permissions, and safety.

### Implementation Challenges

| Challenge | Solution |
|-----------|----------|
| Hallucination | Structured output + rules + post-execution validation |
| Long task stability | Checkpoints, resume, goal re-grounding |
| Cost | Tool round limits, context compression |
| Architecture | Single Agent (simple) / Multi-Agent (complex) / Workflow + Agent (enterprise default) |

---

## 10. The Future of Agents

Agents are not "LLM + Prompts." They are:

> **Continuous systems based on state, feedback, memory, tools, and planning.**

The future competition will shift from "who has the strongest model" to "who has the strongest agent engineering":

- **Runtime stability** — 7×24 reliable operation
- **Context Engineering** — maximizing value within limited windows
- **Tool Ecosystem** — rapid integration with enterprise systems
- **Controllable workflows** — balancing flexibility with determinism

These are the things PMs should truly focus on designing.

---

*Based on practical experience from J&T Express AI customer service system. Suitable for AI PMs evaluating agent product architectures.*`,
  },
}
