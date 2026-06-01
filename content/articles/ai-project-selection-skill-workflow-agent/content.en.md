# AI Project Architecture: When to Use Skill, Workflow, and Agent

Many AI projects start with the wrong question: "Should we build this as an Agent?"

From a product manager's perspective, that question comes too early. The better starting point is: **where does the uncertainty actually live, and how much control does the system need?**

Skill, Workflow, and Agent are not three interchangeable technical labels. They are three different layers of capability:

- **Skill** solves how to complete one deterministic action reliably.
- **Workflow** solves how to run a deterministic process reliably.
- **Agent** solves how the system should decide the next step when the input is uncertain.

![Skill, Workflow, and Agent selection map](/images/blog/ai-project-selection/01-skill-workflow-agent-choice.png)

---

## 1. Start With The Product Problem

Do not start from model capability. Start by decomposing the product problem.

Four questions are usually enough:

| Dimension | Product Question | Technical Question |
|---|---|---|
| Is the goal stable? | Does the user want the same type of outcome every time? | Can the input and output be standardized? |
| Is the process fixed? | Can the business steps be written as an SOP? | Does this fit a state machine, DAG, or rule orchestration? |
| Is judgment complex? | Does it require semantic understanding, missing information, or routing? | Does it need an LLM for routing or planning? |
| Is the risk controllable? | Is failure low-cost or high-risk? | Do we need logs, auditability, and human fallback? |

These questions tell you whether the system should be toolized, workflowed, or agentic.

![Product and technical diagnosis for architecture selection](/images/blog/ai-project-selection/02-product-tech-diagnosis.png)

---

## 2. When To Use Skill

**Use a Skill for a single, deterministic, reusable action.**

From the product side, a Skill packages a frequent action into a stable capability. From the technical side, it is usually a function, API, plugin, or tool call.

Typical examples:

- Query product inventory
- Extract information from a web page
- Calculate commission rate
- Check prohibited words
- Convert a file format

Ask three questions:

- Is the user goal clear?
- Are the input and output structured?
- Can the action run without contextual judgment?

If the answer is yes, you probably do not need an Agent. For example, checking whether a SKU has inventory should go through an API. It is cheaper, more stable, and easier to audit.

> A Skill does not need to be smart. It needs to be stable, cheap, and reusable.

---

## 3. When To Use Workflow

**Use a Workflow when the process is fixed, ordered, and needs control.**

From the product side, Workflow turns a business SOP into a productized process. From the technical side, it is usually a state machine, DAG, approval flow, task flow, or rules engine.

Typical examples:

- Content moderation: submit -> machine review -> human review -> publish
- After-sales handling: identify issue -> verify proof -> calculate solution -> notify user
- Product selection: profile analysis -> candidate retrieval -> ranking -> script generation

A common PM mistake is forgetting that **a Workflow can include LLM nodes, but the LLM should not own the whole process.**

For example, in content moderation, an LLM can judge whether a text is suspicious. But if a high-risk case must go to human review, Workflow should enforce that rule.

The core of Workflow is not whether AI is involved. It is who owns process control.

> The more a process needs auditability, tracking, rollback, and SLA, the more it should be workflowed.

---

## 4. When To Use Agent

**Use an Agent when the input is fuzzy, the path is not fixed, and the system needs dynamic judgment.**

From the product side, an Agent reduces the user's expression and decision cost. From the technical side, it uses an LLM as a decision maker, combining context, tools, memory, and rules to decide the next step.

Typical examples:

- The user says, "Help me pick products for next week's livestream."
- The requirement is incomplete and the system needs to fill in missing information.
- One entry point may route to profile analysis, trend analysis, product retrieval, or script generation.
- The task needs to adjust strategy based on intermediate results.

In these cases, the hard part is not executing one action. The hard part is deciding what should happen next.

But an Agent should never be given unlimited power. PMs still need to define:

- Which tools it can call
- Which states it can change
- Which outputs must be validated by rules
- Which situations require human escalation
- How many iterations are allowed

Otherwise, an Agent quickly becomes an opaque decision box.

> Agents handle uncertainty, but they do not replace process governance or risk control.

---

## 5. Real Projects Usually Use All Three

In production, the most reliable design is often layered:

- **Agent** understands needs and performs dynamic routing.
- **Workflow** controls the main process and state transitions.
- **Skill** executes deterministic actions.

Take creator product selection as an example:

- The user enters a natural-language request. The Agent extracts theme, audience, price range, and quantity.
- If audience profile or trend information is missing, the Agent decides what to enrich first.
- Workflow runs profile analysis -> candidate retrieval -> scoring -> script generation -> review.
- Skills query the product database, fetch audience profiles, calculate scores, and check compliance words.
- High-ticket items, medical/health categories, and non-converging results are forced into human review.

![Layered implementation in a real AI product](/images/blog/ai-project-selection/03-layered-implementation.png)

This works because the Agent does not own every execution detail, Workflow does not need to solve every semantic uncertainty, and Skills are not forced to understand complex context.

---

## 6. A PM Selection Rule

The shortest version:

> **Use Skill for simple actions, Workflow for fixed chains, Agent for dynamic judgment, and human fallback for high-risk scenarios.**

A practical decision order:

1. If it is only a stable action, build a Skill.
2. If it is a fixed business chain, build a Workflow.
3. If the input is fuzzy and the path is dynamic, introduce an Agent.
4. If money, compliance, medical risk, permissions, or irreversible actions are involved, add rules and HITL.

The value of an AI Product Manager is not turning everything into an Agent. It is knowing **which layer needs intelligence, which layer needs determinism, and which layer must be auditable and recoverable.**

The AI systems that truly ship are often not the most "intelligent" ones. They are the ones with the clearest layers.
