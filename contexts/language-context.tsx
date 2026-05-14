"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "zh" | "en" | "es"

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
    "nav.home": "Inicio",
    "nav.about": "Bio",
    "nav.portfolio": "Portafolio",
    "nav.podcast": "Podcast",
    "nav.articles": "Artículos",
    "nav.talks": "Charlas",
    "nav.streaming": "Streaming",
    "nav.celo": "Celo",
    "nav.contact": "Contacto",

    // Hero Section
    "hero.greeting": "Bienvenido a mi **portfolio personal**",
    "hero.title": "Programo con IA y hago crecer productos que la gente ama",
    "hero.card1": "Experto en diseño de productos escalables y marketing.",
    "hero.card2": "Apasionado por Web3, IA y sostenibilidad.",
    "hero.card3": "Trabajo remoto en más de 15 países como nómada digital.",
    "hero.card4": "Ayudé a más de 40 empresas con soluciones impactantes.",

    // Trusted By Section
    "trustedBy.title": "Confían en mí",
    "trustedBy.subtitle":
      "Empresas y organizaciones que han confiado en mi experiencia para impulsar su transformación digital y estrategias de crecimiento.",

    // Portfolio Section
    "portfolio.title": "Portfolio",
    "portfolio.subtitle":
      "Casos de estudio y proyectos de diseño que muestran soluciones centradas en el usuario para productos digitales",

    // About Section
    "about.title": "ACERCA DE MÍ",
    "about.bio1":
      "Arturo Grande (Salta, 1995) es *diseñador multimedia*, *emprendedor* y *entusiasta de la tecnología*. Se desempeñó como *Director Nacional de Marketing* en *AIESEC* en Argentina y España, y es fundador y profesor en *[DESAFIA]*, un programa que acompaña a emprendedores en la creación y escalado de *productos digitales* con proyección global.",
    "about.bio2":
      "Ha participado como orador en *eventos de UX y tecnología*, co-organizó *SAIAConf*, y dicta clases en los programas de posgrado en *Negocios Digitales (UCEMA)* y *CriptoEconomía (UNCUYO)*. Ha liderado *estrategias de producto y marketing* en *empresas fintech*, impulsando *innovacion digital* y *crecimiento escalable* en LATAM.",
    "about.bio3":
      "Es *Embajador de v0* y *Celo Argentina*, impulsando la adopción de herramientas de desarrollo y *tecnologías Web3* en la región. Es graduado de la *[Polkadot Blockchain Academy X]* y fue seleccionado como *Scholar* en el track de *Organizadores de la Comunidad Ethereum ARG* de *[Devconnect]* 2025.",
    "about.links.title": "Enlaces",
    "about.cta": "CONTACTAR",

    // Companies Section
    "companies.eluter.title": "Más sobre Eluter",
    "companies.eluter.description":
      "**Eluter** es una **plataforma fintech** que simplifica los **pagos globales** y el **intercambio de divisas** para empresas en Argentina. Permite a las empresas enviar, recibir y convertir **ARS, USD, EUR y stablecoins** con **velocidad, transparencia y cumplimiento**, ayudando a **importadores, exportadores y empresas de e-commerce** a crecer internacionalmente.",
    "companies.eluter.button": "Más información",
    "companies.desafia.title": "Más sobre DESAFIA",
    "companies.desafia.description":
      "**DESAFIA** es una **plataforma educativa** fundada por **Arturo Grande** que ayuda a **emprendedores y profesionales** a crear y escalar **productos digitales**. Con un enfoque práctico en **estrategia, diseño, producto, marketing y finanzas**, DESAFIA entrena a la próxima generación de **builders en LATAM** para lanzar y hacer crecer sus **startups globalmente**.",
    "companies.desafia.button": "Más información",

    // Talks Section
    "talks.title": "Charlas y Talleres",
    "talks.description":
      "Soy un **speaker internacional**, brindando charlas prácticas y talleres sobre **Diseño UX, Marketing, Sostenibilidad**, y **tecnologías exponenciales** como **crypto, blockchain e Inteligencia Artificial**. Mi enfoque combina **teoría y experiencia práctica** para empoderar **emprendedores y profesionales** en la **era digital**.",
    "talks.cta": "SOLICITAR CHARLA/TALLER",
    "talks.argentina": "Argentina",
    "talks.international": "Internacional",

    // Blog Section
    "blog.title": "Artículos y Casos de Estudio",
    "blog.subtitle":
      "Insights sobre diseño, tecnología y estrategia de negocio desde proyectos reales y trabajo con clientes",
    "blog.readMore": "Leer en Medium",
    "blog.noArticles": "No se encontraron artículos. ¡Vuelve pronto!",
    "blog.viewAll": "Ver Últimos 10 Artículos",

    // Footer
    "footer.portfolio": "PORTAFOLIO",
    "footer.portfolio.design": "Diseño de Productos",
    "footer.about": "ACERCA DE MÍ",
    "footer.about.bio": "Biografía Corta",
    "footer.about.talks": "Charlas y Talleres",
    "footer.about.articles": "Artículos",
    "footer.connect": "CONECTEMOS",
    "footer.connect.project": "¿Tienes un proyecto en mente?",
    "footer.connect.touch": "Ponte en contacto",
    "footer.made": "HECHO POR",

    // Podcast Section
    "podcast.title": "Artu Grande Podcast",
    "podcast.description1":
      "Un espacio de **charlas auténticas** con las mentes que están moldeando el futuro de la **tecnología, la IA, blockchain** y la **cultura digital**.",
    "podcast.description2":
      "Desde **Salta, Argentina**, Artu Grande comparte **conversaciones profundas y cercanas** con **fundadores, creadores e innovadores** que construyen **productos globales** desde cualquier lugar.",
    "podcast.description3":
      "Con la calidez de un **mate** y la mirada puesta en lo que viene, este podcast busca **inspirar, educar** y **abrir oportunidades** para **comunidades emergentes**.",
    "podcast.stats": "El podcast cuenta con más de **275.000 reproducciones** y está disponible en **X, YouTube y Spotify**.",
    "podcast.latestEpisodes": "Últimos Episodios",

    // Streaming Section
    "streaming.title": "Transmisión en Vivo",
    "streaming.backHome": "Volver al Inicio",
    "streaming.description":
      "Acompáñame en vivo para discusiones sobre diseño, tecnología y emprendimiento. Sígueme mientras comparto insights, trabajo en proyectos y me conecto con la comunidad.",
    "streaming.joinWhatsApp": "Únete al Grupo de WhatsApp",

    // Celo Section
    "celo.backHome": "Volver al Inicio",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en" || savedLanguage === "es")) {
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
