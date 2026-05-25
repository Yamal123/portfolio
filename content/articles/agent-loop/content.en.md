# How Agents Close the Loop: Perceive, Decide, Act, Perceive Again

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
```text
Thought: Need to check logistics first
Action: query_logistics(user_id="U12345")
Observation: Package arrived but last-mile delayed 48+ hours
Thought: This is a delivery exception, create escalation ticket
Action: create_ticket(type="delivery_delay", priority="high")
```

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
```text
❌ Bad: Query order info
✅ Good: Query complete order information by order ID, including status,
   logistics, items, amount, and estimated delivery.
   Use when users ask about order status or shipping progress.
```

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

*Based on practical experience from J&T Express AI customer service system. Suitable for AI PMs evaluating agent product architectures.*