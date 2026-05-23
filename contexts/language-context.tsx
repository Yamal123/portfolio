"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "zh" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  zh: {
    // Navbar
    "nav.home": "首页",
    "nav.about": "关于我",
    "nav.portfolio": "项目案例",
    "nav.experience": "工作经历",
    "nav.skills": "技能",
    "nav.contact": "联系方式",

    // Hero Section
    "hero.greeting": "欢迎来到我的个人作品集",
    "hero.title": "用AI重新定义产品边界",
    "hero.subtitle": "AI产品经理 | 供应链系统专家 | 大模型应用落地专家",
    "hero.card1": "AI解决率 88%",
    "hero.card2": "人工咨询量降低 30%",
    "hero.card3": "客服查询时长缩短 45%",
    "hero.card4": "交付周期缩短 45%",

    // About Section
    "about.title": "关于我",
    "about.bio1":
      "余猛，2年AI产品经理实战经验，深度理解LLM（大语言模型）、RAG（检索增强生成）、Agent（智能体）技术原理。",
    "about.bio2":
      "主导基于Dify的企业级大模型应用从0到1落地，具备AI客服、智能助手、工单自动化等完整产品落地经验。",
    "about.bio3":
      "擅长数据驱动产品迭代，具备国际化产品视野（中东、拉美），能打造可复制的海外AI产品方案。",
    "about.cta": "联系我",

    // Experience Section
    "experience.title": "工作经历",
    "experience.jitu.title": "极兔速递",
    "experience.jitu.role1": "AI客服产品经理",
    "experience.jitu.desc1": "基于Dify的AI Agent系统，AI解决率88%，工单处理效率提升40%",
    "experience.jitu.role2": "供应链产品经理&PMO",
    "experience.jitu.desc2": "负责中东业务系统适配，支撑业务规模化拓展",
    "experience.lanjing.title": "浙江蓝景科技",
    "experience.lanjing.role": "供应链产品经理",
    "experience.lanjing.desc": "WMS/TMS/OMS系统从0到1落地，渔业区块链电子联单",
    "experience.wewei.title": "杭州微未计算机",
    "experience.wewei.role": "AI产品经理",
    "experience.wewei.desc": "NLP文字校对SaaS，短视频舆情监测平台",

    // Portfolio Section
    "portfolio.title": "项目案例",
    "portfolio.subtitle": "基于真实项目的AI产品落地案例",
    "portfolio.tuzhixing.title": "兔智星智能助手",
    "portfolio.tuzhixing.desc": "巴西市场，基于Dify+GPT-4o，问答准确率88%，日均调用300+次",
    "portfolio.jitu.title": "极兔AI客服体系",
    "portfolio.jitu.desc": "Multi-Agent协作系统，工单自动化，处理效率提升40%",
    "portfolio.middleeast.title": "中东物流业务系统",
    "portfolio.middleeast.desc": "适配阿联酋、沙特、科威特，破解地址混乱、合规复杂、清关繁琐",
    "portfolio.haihaoyouni.title": "海好有你公益平台",
    "portfolio.haihaoyouni.desc": "海洋生态治理数字化，入选浙江省共同富裕最佳实践",

    // Skills Section
    "skills.title": "技术能力",
    "skills.aiPlatforms": "AI平台",
    "skills.agentTech": "Agent技术",
    "skills.data": "数据能力",
    "skills.design": "设计工具",
    "skills.aiTools": "AI工具",

    // Footer
    "footer.portfolio": "项目案例",
    "footer.about": "关于我",
    "footer.experience": "工作经历",
    "footer.connect": "联系我",
    "footer.connect.project": "有项目想法？",
    "footer.connect.touch": "联系我",
    "footer.made": "用 ❤️ 和 AI 构建",
    "footer.phone": "电话",
    "footer.email": "邮箱",
  },
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.about": "About",
    "nav.portfolio": "Portfolio",
    "nav.experience": "Experience",
    "nav.skills": "Skills",
    "nav.contact": "Contact",

    // Hero Section
    "hero.greeting": "Welcome to My Portfolio",
    "hero.title": "Redefining Product Boundaries with AI",
    "hero.subtitle": "AI Product Manager | Supply Chain Expert | LLM Application Specialist",
    "hero.card1": "88% AI Resolution Rate",
    "hero.card2": "30% Reduction in Manual Inquiries",
    "hero.card3": "45% Faster Customer Service Queries",
    "hero.card4": "45% Shorter Delivery Cycles",

    // About Section
    "about.title": "About Me",
    "about.bio1":
      "Yu Meng, 2 years of hands-on AI Product Management experience, with deep understanding of LLM, RAG, and Agent technologies.",
    "about.bio2":
      "Led enterprise-grade LLM applications from 0 to 1 based on Dify, with proven experience in AI customer service, intelligent assistants, and ticket automation.",
    "about.bio3":
      "Skilled in data-driven product iteration with international product perspective (Middle East, Latin America), capable of building replicable overseas AI product solutions.",
    "about.cta": "Contact Me",

    // Experience Section
    "experience.title": "Experience",
    "experience.jitu.title": "J&T Express",
    "experience.jitu.role1": "AI Customer Service PM",
    "experience.jitu.desc1": "Dify-based AI Agent system, 88% AI resolution rate, 40% improvement in ticket processing",
    "experience.jitu.role2": "Supply Chain PM & PMO",
    "experience.jitu.desc2": "Led Middle East business system adaptation, supporting business scale-up",
    "experience.lanjing.title": "Zhejiang Lanjing Tech",
    "experience.lanjing.role": "Supply Chain PM",
    "experience.lanjing.desc": "WMS/TMS/OMS systems from 0 to 1, fisheries blockchain electronic manifest",
    "experience.wewei.title": "Hangzhou Weiwei Computer",
    "experience.wewei.role": "AI Product Manager",
    "experience.wewei.desc": "NLP text proofreading SaaS, short video public opinion monitoring platform",

    // Portfolio Section
    "portfolio.title": "Case Studies",
    "portfolio.subtitle": "Real-world AI product implementation cases",
    "portfolio.tuzhixing.title": "Tuzhixing Smart Assistant",
    "portfolio.tuzhixing.desc": "Brazil market, Dify+GPT-4o based, 88% Q&A accuracy, 300+ daily calls",
    "portfolio.jitu.title": "J&T AI Customer Service",
    "portfolio.jitu.desc": "Multi-Agent collaboration system, ticket automation, 40% efficiency improvement",
    "portfolio.middleeast.title": "Middle East Logistics System",
    "portfolio.middleeast.desc": "Adapted for UAE, Saudi Arabia, Kuwait, solving address, compliance and customs challenges",
    "portfolio.haihaoyouni.title": "Haihao You Ni Public Platform",
    "portfolio.haihaoyouni.desc": "Marine ecological governance digitization, selected as Zhejiang best practice",

    // Skills Section
    "skills.title": "Skills",
    "skills.aiPlatforms": "AI Platforms",
    "skills.agentTech": "Agent Technology",
    "skills.data": "Data Capabilities",
    "skills.design": "Design Tools",
    "skills.aiTools": "AI Tools",

    // Footer
    "footer.portfolio": "Portfolio",
    "footer.about": "About",
    "footer.experience": "Experience",
    "footer.connect": "Get in Touch",
    "footer.connect.project": "Have a project idea?",
    "footer.connect.touch": "Contact me",
    "footer.made": "Built with ❤️ and AI",
    "footer.phone": "Phone",
    "footer.email": "Email",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
