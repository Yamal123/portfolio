import { agentLoopArticle } from './articles/agent-loop-article'
export type { Article } from '@/types/article'

export const articlesData: Article[] = [
  agentLoopArticle,
  {
    id: 1,
    slug: "rag-in-action",
    title: { zh: "RAG技术实战：如何构建企业级知识库问答系统", en: "RAG in Action: Building Enterprise Knowledge Base Q&A Systems" },
    createdAt: "2024-01-15",
    intro: { zh: "深入探讨RAG技术原理，分享企业级知识库问答系统的设计与实现经验", en: "Deep dive into RAG technology, sharing design and implementation experience for enterprise knowledge base Q&A systems" },
    keywords: ["RAG", "LLM", "AI", "知识库", "问答系统"],
    content: {
      zh: `# RAG技术实战：如何构建企业级知识库问答系统

## 什么是RAG？

RAG（Retrieval-Augmented Generation）是一种结合了信息检索和文本生成的技术。它通过在生成回答之前先检索相关文档，显著提高了生成内容的准确性和可验证性。

### RAG的核心组件

1. **检索器（Retriever）**：从知识库中查找相关文档
2. **生成器（Generator）**：基于检索到的文档生成回答
3. **向量数据库**：存储文档的向量表示，支持语义搜索

## 构建RAG系统的步骤

### 1. 数据准备

首先需要准备好知识库内容：
- 整理企业文档
- 切分文本（Chunking）
- 生成向量嵌入（Embeddings）

### 2. 选择技术栈

推荐的技术选择：
- **向量数据库**：Pinecone、Weaviate、Qdrant
- **LLM**：GPT-4o、Claude 3、Llama 2
- **框架**：LangChain、LlamaIndex

### 3. 系统架构设计

典型的RAG系统架构包括：
- 用户接口层
- 查询理解层
- 检索层
- 答案生成层

## 实战经验分享

### 提高检索准确率

- 使用混合检索（Hybrid Search）
- 优化Chunk大小
- 添加元数据过滤

### 提高答案质量

- 进行Prompt Engineering
- 添加来源引用
- 实现多轮对话支持

## 总结

RAG技术为企业提供了一种低成本、高可控的AI应用方式。通过合理设计和持续优化，可以构建出真正有价值的智能问答系统。`,
      en: `# RAG in Action: Building Enterprise Knowledge Base Q&A Systems

## What is RAG?

RAG (Retrieval-Augmented Generation) is a technology that combines information retrieval with text generation. By retrieving relevant documents before generating answers, it significantly improves accuracy and verifiability.

### Core Components of RAG

1. **Retriever**: Finds relevant documents from the knowledge base
2. **Generator**: Produces answers based on retrieved documents
3. **Vector Database**: Stores vector representations for semantic search

## Steps to Build a RAG System

### 1. Data Preparation

First, prepare your knowledge base:
- Organize enterprise documents
- Text chunking
- Generate embeddings

### 2. Choose Tech Stack

Recommended options:
- **Vector DB**: Pinecone, Weaviate, Qdrant
- **LLM**: GPT-4o, Claude 3, Llama 2
- **Frameworks**: LangChain, LlamaIndex

### 3. System Architecture Design

Typical RAG architecture includes:
- User interface layer
- Query understanding layer
- Retrieval layer
- Answer generation layer

## Practical Experience

### Improving Retrieval Accuracy

- Use hybrid search
- Optimize chunk size
- Add metadata filtering

### Improving Answer Quality

- Prompt engineering
- Add source citations
- Implement multi-turn dialogue support

## Summary

RAG provides enterprises with a cost-effective, highly controllable AI application approach. With proper design and continuous optimization, you can build truly valuable intelligent Q&A systems.`
    }
  },
  {
    id: 2,
    slug: "ai-agent-design-patterns",
    title: { zh: "AI Agent设计模式：从单Agent到Multi-Agent协作", en: "AI Agent Design Patterns: From Single Agent to Multi-Agent Collaboration" },
    createdAt: "2024-01-10",
    intro: { zh: "分析AI Agent的设计模式，探讨Multi-Agent协作系统的架构设计", en: "Analyze AI Agent design patterns, explore architecture design for Multi-Agent collaboration systems" },
    keywords: ["AI Agent", "Multi-Agent", "架构", "设计模式"],
    content: {
      zh: `# AI Agent设计模式：从单Agent到Multi-Agent协作

## AI Agent基础

AI Agent是一个能够感知环境、做出决策并采取行动的自主系统。

### 基本构成

- **感知模块**：获取环境信息
- **推理模块**：理解和决策
- **行动模块**：执行具体操作
- **记忆模块**：存储历史信息

## 单Agent设计模式

### ReAct模式

ReAct = Reasoning + Acting，将思考和行动结合起来。

### Reflection模式

Agent能够反思自己的行为，不断优化。

## Multi-Agent协作模式

### 分层架构

- **顶层Agent**：负责决策和协调
- **专业Agent**：各自负责具体领域

### 协作机制

- 消息传递
- 任务分配
- 结果汇总

## 案例：极兔物流AI系统

在极兔物流的案例中，我们使用了Multi-Agent架构来处理物流追踪和异常预警。

### 设计思路

1. **信息收集Agent**：从多个系统收集数据
2. **异常检测Agent**：分析数据发现异常
3. **预警推送Agent**：决定如何通知相关人员
4. **优化建议Agent**：提供改进建议

## 最佳实践

### 职责清晰

每个Agent应该有明确的职责边界。

### 通信高效

Agent之间的通信应该简洁有效。

### 容错机制

部分Agent失败时不影响整体系统。`,
      en: `# AI Agent Design Patterns: From Single Agent to Multi-Agent Collaboration

## AI Agent Basics

An AI Agent is an autonomous system that can perceive its environment, make decisions, and take actions.

### Basic Components

- **Perception Module**: Gets environmental information
- **Reasoning Module**: Understanding and decision-making
- **Action Module**: Executes specific operations
- **Memory Module**: Stores historical information

## Single Agent Design Patterns

### ReAct Pattern

ReAct = Reasoning + Acting, combining thinking and doing.

### Reflection Pattern

Agent can reflect on its behavior and continuously optimize.

## Multi-Agent Collaboration Patterns

### Hierarchical Architecture

- **Top-level Agent**: Responsible for decision making and coordination
- **Specialized Agents**: Each responsible for specific domains

### Collaboration Mechanisms

- Message passing
- Task assignment
- Result aggregation

## Case Study: J&T Logistics AI System

In the J&T Logistics case, we used Multi-Agent architecture for logistics tracking and exception alerts.

### Design Approach

1. **Information Collection Agent**: Gathers data from multiple systems
2. **Anomaly Detection Agent**: Analyzes data to find exceptions
3. **Alert Delivery Agent**: Decides how to notify relevant personnel
4. **Optimization Suggestion Agent**: Provides improvement suggestions

## Best Practices

### Clear Responsibilities

Each agent should have clear responsibility boundaries.

### Efficient Communication

Communication between agents should be concise and effective.

### Fault Tolerance

System should work even if some agents fail.`
    }
  },
  {
    id: 3,
    slug: "supply-chain-digital-transformation",
    title: { zh: "跨境供应链数字化转型：AI驱动的智能决策", en: "Cross-border Supply Chain Digital Transformation: AI-driven Intelligent Decision Making" },
    createdAt: "2024-01-05",
    intro: { zh: "探讨AI技术如何赋能跨境供应链，实现智能决策与效率提升", en: "Explore how AI empowers cross-border supply chain, enabling intelligent decision making and efficiency improvement" },
    keywords: ["供应链", "AI", "数字化", "跨境", "智能决策"],
    content: {
      zh: `# 跨境供应链数字化转型：AI驱动的智能决策

## 跨境供应链的挑战

跨境供应链面临着复杂的挑战：
- 多国法规合规
- 多语言沟通
- 物流时效不确定
- 成本控制困难

## AI赋能场景

### 1. 需求预测

使用机器学习模型预测未来需求，优化库存管理。

### 2. 智能调度

AI算法优化路线规划和资源分配。

### 3. 风险预警

实时监测供应链风险，提前预警。

## 数据驱动决策

### 数据中台建设

统一数据口径，打破数据孤岛。

### 实时分析

实时数据处理和可视化。

## 实践经验

在中东物流平台项目中，我们实现了：
- 99.5%的合规通过率
- 支持8个国家/地区
- 决策效率大幅提升

## 未来展望

AI将持续赋能供应链，带来更多创新。`,
      en: `# Cross-border Supply Chain Digital Transformation: AI-driven Intelligent Decision Making

## Challenges in Cross-border Supply Chain

Cross-border supply chain faces complex challenges:
- Multi-country regulation compliance
- Multi-language communication
- Uncertain logistics timelines
- Cost control difficulties

## AI Empowerment Scenarios

### 1. Demand Forecasting

Use machine learning models to predict future demand and optimize inventory management.

### 2. Intelligent Scheduling

AI algorithms optimize route planning and resource allocation.

### 3. Risk Alerts

Real-time supply chain risk monitoring and early warning.

## Data-driven Decisions

### Data Platform Construction

Unify data standards, break down data silos.

### Real-time Analysis

Real-time data processing and visualization.

## Practical Experience

In the Middle East logistics platform project, we achieved:
- 99.5% compliance rate
- Support for 8 countries/regions
- Significant improvement in decision efficiency

## Future Outlook

AI will continue to empower supply chain, bringing more innovation.`
    }
  },
  {
    id: 4,
    slug: "intent-recognition-in-customer-service",
    title: { zh: "意图识别技术在客服系统中的应用实践", en: "Intent Recognition in Customer Service Systems: Practical Applications" },
    createdAt: "2023-12-28",
    intro: { zh: "分享意图识别技术在智能客服系统中的应用案例与优化策略", en: "Share intent recognition applications in intelligent customer service systems and optimization strategies" },
    keywords: ["意图识别", "NLP", "客服", "对话系统"],
    content: {
      zh: `# 意图识别技术在客服系统中的应用实践

## 意图识别的重要性

准确理解用户意图是智能客服系统的核心能力。

## 技术演进

### 传统方法

- 规则匹配
- 机器学习分类

### 现代方法

- 预训练语言模型
- 少样本学习
- 混合架构

## 兔智星案例

在兔智星项目中，我们实现了：
- 92%的意图识别准确率
- 25%的用户满意度提升

## 优化策略

### 数据质量

- 标注规范
- 数据增强

### 模型优化

- Prompt工程
- 模型微调

## 未来方向

多轮对话理解、跨语言支持是重要发展方向。`,
      en: `# Intent Recognition in Customer Service Systems: Practical Applications

## Importance of Intent Recognition

Accurately understanding user intent is the core capability of intelligent customer service systems.

## Technology Evolution

### Traditional Methods

- Rule matching
- Machine learning classification

### Modern Methods

- Pre-trained language models
- Few-shot learning
- Hybrid architectures

## Tuzhixing Case Study

In the Tuzhixing project, we achieved:
- 92% intent recognition accuracy
- 25% improvement in user satisfaction

## Optimization Strategies

### Data Quality

- Annotation standards
- Data augmentation

### Model Optimization

- Prompt engineering
- Model fine-tuning

## Future Directions

Multi-turn dialogue understanding and cross-language support are important development directions.`
    }
  },
  {
    id: 5,
    slug: "how-pm-understand-llm",
    title: { zh: "产品经理如何理解与应用LLM技术", en: "How Product Managers Understand and Apply LLM Technology" },
    createdAt: "2023-12-20",
    intro: { zh: "从产品视角解读LLM技术能力边界，指导产品设计与落地", en: "Interpret LLM capabilities from a product perspective, guiding product design and implementation" },
    keywords: ["产品管理", "LLM", "AI", "产品设计"],
    content: {
      zh: `# 产品经理如何理解与应用LLM技术

## 建立技术认知

作为PM，不需要成为算法专家，但需要理解：
- LLMs的能力边界
- 适用的场景
- 成本和限制

## 产品场景挖掘

### 适合的场景

- 内容生成
- 信息提取
- 对话交互

### 不太适合的场景

- 需要精确计算
- 需要实时数据
- 需要法律严谨性

## 产品设计原则

1. 明确价值定位
2. 合理管理预期
3. 提供人工兜底

## 实践案例分享

多个项目的经验总结。`,
      en: `# How Product Managers Understand and Apply LLM Technology

## Building Technical Understanding

As a PM, you don't need to become an algorithm expert, but you need to understand:
- LLM capabilities and limitations
- Applicable scenarios
- Costs and constraints

## Product Scenario Discovery

### Suitable Scenarios

- Content generation
- Information extraction
- Conversational interaction

### Less Suitable Scenarios

- Need precise calculation
- Need real-time data
- Need legal rigor

## Product Design Principles

1. Clear value proposition
2. Manage expectations reasonably
3. Provide human fallback

## Practical Case Sharing

Experience summary from multiple projects.`
    }
  },
  {
    id: 6,
    slug: "middle-east-market-product-design",
    title: { zh: "中东市场产品设计：本地化策略与合规要点", en: "Product Design for Middle East Market: Localization Strategies and Compliance" },
    createdAt: "2023-12-15",
    intro: { zh: "分享中东市场产品设计的本地化策略与合规注意事项", en: "Share localization strategies and compliance considerations for Middle East market product design" },
    keywords: ["国际化", "本地化", "合规", "中东"],
    content: {
      zh: `# 中东市场产品设计：本地化策略与合规要点

## 市场特点

中东市场有其独特性：
- 多国语言
- 文化差异
- 宗教因素

## 本地化策略

### 语言本地化

阿拉伯语是主要语言，但英语也广泛使用。

### 文化适配

理解当地文化习俗和偏好。

### 支付方式

支持本地流行的支付方式。

## 合规要点

### 数据合规

GDPR类似的要求，以及各国本地法规。

### 内容合规

需要符合当地的内容标准。

## 成功要素

耐心、尊重、本地化是成功的关键。`,
      en: `# Product Design for Middle East Market: Localization Strategies and Compliance

## Market Characteristics

The Middle East market has its unique characteristics:
- Multi-lingual
- Cultural differences
- Religious factors

## Localization Strategies

### Language Localization

Arabic is the primary language, but English is also widely used.

### Cultural Adaptation

Understand local cultural customs and preferences.

### Payment Methods

Support popular local payment methods.

## Compliance Key Points

### Data Compliance

GDPR-like requirements, plus local regulations in each country.

### Content Compliance

Need to meet local content standards.

## Success Factors

Patience, respect, and localization are the keys to success.`
    }
  },
  {
    id: 7,
    slug: "data-driven-product-decisions",
    title: { zh: "产品数据驱动决策：从指标到洞察", en: "Data-driven Product Decisions: From Metrics to Insights" },
    createdAt: "2023-12-10",
    intro: { zh: "如何用数据指导产品决策，从指标体系到数据洞察", en: "How to guide product decisions with data, from metrics system to data insights" },
    keywords: ["数据分析", "产品决策", "增长", "数据驱动"],
    content: {
      zh: `# 产品数据驱动决策：从指标到洞察

## 建立数据思维

数据驱动不是空话，需要从基础做起。

## 指标体系设计

### 核心指标

选择能反映产品健康度的指标。

### 漏斗分析

用户旅程的关键节点。

## 分析框架

### AARRR框架

- Acquisition（获取）
- Activation（激活）
- Retention（留存）
- Revenue（变现）
- Referral（传播）

## 工具推荐

数据平台、BI工具、用户行为分析。

## 实战案例

分享数据驱动产品优化的实战经验。`,
      en: `# Data-driven Product Decisions: From Metrics to Insights

## Building Data Thinking

Data-driven is not empty talk, it needs to start from the basics.

## Metrics System Design

### Core Metrics

Choose metrics that reflect product health.

### Funnel Analysis

Key points in user journey.

## Analysis Framework

### AARRR Framework

- Acquisition
- Activation
- Retention
- Revenue
- Referral

## Tool Recommendations

Data platforms, BI tools, user behavior analytics.

## Practical Cases

Share practical experience of data-driven product optimization.`
    }
  },
  {
    id: 8,
    slug: "user-growth-methodology",
    title: { zh: "用户增长方法论：从0到1构建增长引擎", en: "User Growth Methodology: Building Growth Engine from 0 to 1" },
    createdAt: "2023-12-05",
    intro: { zh: "系统讲解用户增长方法论，从用户获取到留存变现", en: "Systematic explanation of user growth methodology, from user acquisition to retention and monetization" },
    keywords: ["用户增长", "增长黑客", "产品运营", "裂变"],
    content: {
      zh: `# 用户增长方法论：从0到1构建增长引擎

## 增长思维

增长是产品成功的关键指标。

## 用户获取

### 渠道选择

找到最适合产品的获客渠道。

### 成本优化

CAC、LTV是关键指标。

## 激活与留存

### 首印象优化

Aha Moment的设计。

### 持续活跃

用户成长体系设计。

## 裂变传播

社交电商增长引擎案例分享。

## 变现策略

选择合适的商业模式。`,
      en: `# User Growth Methodology: Building Growth Engine from 0 to 1

## Growth Thinking

Growth is the key metric of product success.

## User Acquisition

### Channel Selection

Find the most suitable customer acquisition channels.

### Cost Optimization

CAC, LTV are key metrics.

## Activation and Retention

### First Impression Optimization

Aha Moment design.

### Continuous Engagement

User growth system design.

## Viral Propagation

Social e-commerce growth engine case sharing.

## Monetization Strategy

Choose appropriate business model.`
    }
  },
  {
    id: 9,
    slug: "b2b-product-design",
    title: { zh: "B端产品设计：从需求到落地", en: "B2B Product Design: From Requirements to Launch" },
    createdAt: "2023-11-30",
    intro: { zh: "深入探讨B端产品设计方法论，从需求调研到产品落地", en: "Deep dive into B2B product design methodology, from research to launch" },
    keywords: ["B端产品", "产品设计", "SaaS", "企业级"],
    content: {
      zh: `# B端产品设计：从需求到落地

## B端产品特点

B端产品与C端产品有很大不同：
- 决策者、使用者分离
- 复杂的业务场景
- 高切换成本

## 需求调研

### 客户访谈

如何设计有效的访谈提纲。

### 竞品分析

不仅看功能，更看业务逻辑。

## 产品设计原则

简洁、高效、可配置。

## 实施建议

MVP策略、灰度发布、数据监控。`,
      en: `# B2B Product Design: From Requirements to Launch

## B2B Product Characteristics

B2B products are very different from B2C:
- Decision makers and users are separated
- Complex business scenarios
- High switching costs

## Requirements Research

### Customer Interviews

How to design effective interview outlines.

### Competitive Analysis

Not only look at features, but more importantly business logic.

## Product Design Principles

Simple, efficient, configurable.

## Implementation Suggestions

MVP strategy, gray release, data monitoring.`
    }
  },
  {
    id: 10,
    slug: "pm-competency-model-in-ai-era",
    title: { zh: "AI时代产品经理能力模型", en: "Product Manager Competency Model in AI Era" },
    createdAt: "2023-11-25",
    intro: { zh: "AI时代产品经理需要具备哪些能力？如何构建自己的能力体系", en: "What competencies do PMs need in AI era? How to build your competency system" },
    keywords: ["产品经理", "能力模型", "AI", "职业发展"],
    content: {
      zh: `# AI时代产品经理能力模型

## 时代变革

AI正在改变产品经理的工作方式。

## 核心能力

### 技术理解力

不需要写代码，但需要理解技术边界。

### 产品设计能力

基于AI特性的产品设计。

### 数据驱动能力

用数据验证AI效果。

## 学习路径

从基础到进阶的学习建议。

## 心态准备

拥抱变化，终身学习。`,
      en: `# Product Manager Competency Model in AI Era

## Era Transformation

AI is changing the way product managers work.

## Core Competencies

### Technical Understanding

No need to write code, but need to understand technical boundaries.

### Product Design Capability

Product design based on AI characteristics.

### Data-driven Capability

Verify AI effectiveness with data.

## Learning Path

Learning suggestions from basics to advanced.

## Mindset Preparation

Embrace change, lifelong learning.`
    }
  },
  {
    id: 11,
    slug: "how-pm-make-tech-choices",
    title: { zh: "产品经理如何做技术选型", en: "How Product Managers Make Technology Choices" },
    createdAt: "2023-11-20",
    intro: { zh: "产品经理需要懂技术吗？如何进行技术选型的方法论", en: "Do PMs need to understand tech? Methodology for technology selection" },
    keywords: ["技术选型", "产品管理", "架构", "决策"],
    content: {
      zh: `# 产品经理如何做技术选型

## 为什么PM需要关注技术选型

技术选择直接影响产品成败。

## 技术选型原则

1. 业务价值优先
2. 团队能力匹配
3. 生态成熟度
4. 长期可维护性

## 决策流程

1. 明确需求
2. 调研选项
3. 评估对比
4. 小范围验证
5. 全面推广

## 常见技术栈对比

云服务、框架、数据库的选择建议。`,
      en: `# How Product Managers Make Technology Choices

## Why PMs Need to Care About Technology Choices

Technology choices directly affect product success.

## Technology Selection Principles

1. Business value first
2. Team capability match
3. Ecosystem maturity
4. Long-term maintainability

## Decision Process

1. Clarify requirements
2. Research options
3. Evaluate and compare
4. Small-scale verification
5. Full rollout

## Common Tech Stack Comparisons

Cloud services, frameworks, database selection recommendations.`
    }
  },
  {
    id: 12,
    slug: "building-product-platform-from-0",
    title: { zh: "从0到1构建产品中台", en: "Building Product Platform from 0 to 1" },
    createdAt: "2023-11-15",
    intro: { zh: "产品中台建设实践，从架构设计到落地推广", en: "Product platform construction practice, from architecture design to rollout" },
    keywords: ["产品中台", "架构设计", "平台", "企业架构"],
    content: {
      zh: `# 从0到1构建产品中台

## 中台的价值

中台能带来什么：
- 减少重复建设
- 提高效率
- 统一体验

## 中台建设的误区

1. 为了中台而中台
2. 过度设计
3. 没有业务驱动

## 成功要素

1. 业务驱动
2. 分层架构
3. 渐进式推广

## 实践案例分享

中台建设的经验总结。`,
      en: `# Building Product Platform from 0 to 1

## Value of Platform

What can platform bring:
- Reduce duplicate construction
- Improve efficiency
- Unified experience

## Common Mistakes in Platform Building

1. Platform for platform's sake
2. Over-engineering
3. No business driver

## Success Factors

1. Business-driven
2. Layered architecture
3. Progressive rollout

## Practical Case Sharing

Experience summary of platform construction.`
    }
  },
]
