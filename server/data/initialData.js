const crypto = require('crypto')

function formatDate(date) {
  const d = new Date(date)
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

module.exports = {
  adminUsers: [
    {
      id: 1,
      username: 'admin',
      password: crypto.createHash('md5').update('Admin@2026' + 'aipmym_salt_2026_v1').digest('hex'),
      salt: 'aipmym_salt_2026_v1',
      nickname: '超级管理员',
      avatar: '',
      login_ip: '',
      login_at: null,
      fail_count: 0,
      locked_until: null,
      status: 1,
      created_at: formatDate(new Date()),
      updated_at: formatDate(new Date())
    }
  ],

  siteConfig: [
    { id: 1, config_key: 'site_title', config_value: 'AI PM Portfolio', remark: '网站标题', created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 2, config_key: 'site_description', config_value: 'AI产品经理个人主页', remark: 'SEO描述', created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 3, config_key: 'copyright', config_value: '© 2026 AI PM', remark: '页脚版权', created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 4, config_key: 'favicon', config_value: '/uploads/favicon.svg', remark: '网站图标URL', created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 5, config_key: 'icp_code', config_value: '', remark: 'ICP备案号', created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 6, config_key: 'ga_tracking_id', config_value: '', remark: 'Google Analytics追踪ID', created_at: formatDate(new Date()), updated_at: formatDate(new Date()) }
  ],

  userProfile: [
    {
      id: 1,
      nickname: 'AI PM',
      signature: '热爱产品设计与技术探索，专注供应链和AI Agent领域。奔赴山海，记录烟火。',
      introduction: '<p>热爱<strong>产品设计</strong>与<strong>技术探索</strong>，专注供应链和 <strong>AI Agent</strong> 领域。</p><p>热爱摄影、旅行与美食，奔赴山海，记录烟火。</p>',
      avatar: '',
      years_of_experience: 5,
      project_count: 20,
      success_rate: 95.0,
      efficiency_gain: 40.0,
      created_at: formatDate(new Date()),
      updated_at: formatDate(new Date())
    }
  ],

  contactInfo: [
    {
      id: 1,
      email: 'yumeng@aipmym.com',
      email_displayed: 1,
      phone: '15690630301',
      phone_displayed: 0,
      wechat_id: 'your_wechat_id',
      wechat_qrcode: '',
      wechat_displayed: 1,
      created_at: formatDate(new Date()),
      updated_at: formatDate(new Date())
    }
  ],

  userTags: [
    { id: 1, tag_name: '产品设计', bg_color: '#fff7e6', text_color: '#d46b08', sort_num: 1, is_enabled: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 2, tag_name: '技术探索', bg_color: '#e6fffb', text_color: '#13c2c2', sort_num: 2, is_enabled: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 3, tag_name: '供应链', bg_color: '#fff0f6', text_color: '#eb2f96', sort_num: 3, is_enabled: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 4, tag_name: 'AI Agent', bg_color: '#f9f0ff', text_color: '#722ed1', sort_num: 4, is_enabled: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 5, tag_name: '摄影', bg_color: '#fffbe6', text_color: '#d48806', sort_num: 5, is_enabled: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 6, tag_name: '旅行', bg_color: '#e6fffb', text_color: '#13c2c2', sort_num: 6, is_enabled: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 7, tag_name: '美食', bg_color: '#fff7e6', text_color: '#fa8c16', sort_num: 7, is_enabled: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) }
  ],

  skillCates: [
    { id: 1, cate_name: 'AI 产品', cate_icon: 'robot', sort_num: 1, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 2, cate_name: '物流供应链', cate_icon: 'truck', sort_num: 2, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 3, cate_name: '智能客服', cate_icon: 'customer-service', sort_num: 3, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 4, cate_name: '架构设计', cate_icon: 'apartment', sort_num: 4, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) }
  ],

  projectCates: [
    { id: 1, cate_name: 'AI 智能项目', sort_num: 1, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 2, cate_name: '企业级应用', sort_num: 2, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 3, cate_name: '国际化产品', sort_num: 3, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 4, cate_name: '社会公益', sort_num: 4, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) }
  ],

  skills: [
    { id: 1, cate_id: 1, name: 'AI Agent 设计', level: 95, description: '设计和实现自主AI代理系统', tags: 'AI,Agent', sort_num: 1, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 2, cate_id: 1, name: 'RAG 技术', level: 90, description: '检索增强生成技术应用', tags: 'RAG,LLM', sort_num: 2, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 3, cate_id: 1, name: '意图识别', level: 88, description: 'NLP意图识别与分类', tags: 'NLP,ML', sort_num: 3, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 4, cate_id: 1, name: 'LLM 应用', level: 92, description: '大语言模型应用开发', tags: 'LLM,AI', sort_num: 4, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 5, cate_id: 2, name: '需求分析', level: 95, description: '用户需求调研与分析', tags: '产品,需求', sort_num: 1, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 6, cate_id: 2, name: '产品设计', level: 90, description: '产品原型与交互设计', tags: 'UI/UX,设计', sort_num: 2, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 7, cate_id: 2, name: '数据分析', level: 85, description: '业务数据分析与洞察', tags: '数据,分析', sort_num: 3, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 8, cate_id: 2, name: '用户研究', level: 82, description: '用户体验研究方法', tags: 'UX,研究', sort_num: 4, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 9, cate_id: 3, name: 'React/Next.js', level: 75, description: '现代前端框架开发', tags: 'React,Next.js', sort_num: 1, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 10, cate_id: 3, name: 'TypeScript', level: 70, description: '类型安全JavaScript开发', tags: 'TS,前端', sort_num: 2, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 11, cate_id: 3, name: 'SQL & Database', level: 72, description: '数据库设计与SQL优化', tags: 'SQL,数据库', sort_num: 3, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 12, cate_id: 3, name: 'API Design', level: 78, description: 'RESTful API设计与开发', tags: 'API,后端', sort_num: 4, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 13, cate_id: 4, name: '跨团队协作', level: 95, description: '多团队协同工作能力', tags: '协作,沟通', sort_num: 1, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 14, cate_id: 4, name: '项目管理', level: 88, description: '敏捷项目管理方法', tags: '管理,敏捷', sort_num: 2, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 15, cate_id: 4, name: '沟通表达', level: 90, description: '高效沟通与演示能力', tags: '沟通,表达', sort_num: 3, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) },
    { id: 16, cate_id: 4, name: '创新思维', level: 85, description: '创新方法论与实践', tags: '创新,思维', sort_num: 4, status: 1, created_at: formatDate(new Date()), updated_at: formatDate(new Date()) }
  ],

  projects: [
    {
      id: 1,
      slug: 'ai-portfolio',
      cate_id: 1,
      name_zh: 'AI 产品经理作品集',
      name_en: 'AI Product Manager Portfolio',
      thumbnail: '/images/portfolio/saiaconfportada.png',
      content_zh: '# AI 产品经理作品集\n\n这是一个现代化的个人作品网站，专为 AI 产品经理打造。\n\n## 技术栈\n- **前端框架**: Next.js 14 (App Router)\n- **UI 库**: React 19 + TypeScript\n- **样式**: Tailwind CSS\n- **组件库**: Radix UI',
      content_en: '# AI Product Manager Portfolio\n\nThis is a modern personal portfolio website, designed for AI Product Managers.\n\n## Tech Stack\n- **Frontend**: Next.js 14 (App Router)\n- **UI Library**: React 19 + TypeScript\n- **Styling**: Tailwind CSS\n- **Components**: Radix UI',
      tags: 'Next.js,React,TypeScript,Tailwind CSS',
      external_url: '',
      view_count: 156,
      sort_num: 1,
      status: 1,
      deleted_at: null,
      created_at: formatDate(new Date('2026-05-15')),
      updated_at: formatDate(new Date())
    },
    {
      id: 2,
      slug: 'rag-knowledge-base',
      cate_id: 1,
      name_zh: '企业级知识库问答系统',
      name_en: 'Enterprise Knowledge Base Q&A System',
      thumbnail: '/images/portfolio/baiaportada.png',
      content_zh: '# 企业级知识库问答系统\n\n基于RAG技术的智能问答系统，支持文档上传、向量检索和智能回答。',
      content_en: '# Enterprise Knowledge Base Q&A System\n\nIntelligent Q&A system based on RAG technology.',
      tags: 'RAG,LLM,Vector DB,Pinecone',
      external_url: '',
      view_count: 89,
      sort_num: 2,
      status: 1,
      deleted_at: null,
      created_at: formatDate(new Date('2026-05-10')),
      updated_at: formatDate(new Date())
    },
    {
      id: 3,
      slug: 'ai-agent-platform',
      cate_id: 1,
      name_zh: 'Multi-Agent 协作平台',
      name_en: 'Multi-Agent Collaboration Platform',
      thumbnail: '/images/portfolio/betrustyportada.png',
      content_zh: '# Multi-Agent 协作平台\n\n支持单Agent到Multi-Agent的协作架构，用于物流追踪和异常预警。',
      content_en: '# Multi-Agent Collaboration Platform\n\nSupport single to multi-agent collaboration architecture.',
      tags: 'AI Agent,Multi-Agent,物流',
      external_url: '',
      view_count: 124,
      sort_num: 3,
      status: 1,
      deleted_at: null,
      created_at: formatDate(new Date('2026-05-05')),
      updated_at: formatDate(new Date())
    },
    {
      id: 4,
      slug: 'middle-east-logistics',
      cate_id: 3,
      name_zh: '中东跨境物流平台',
      name_en: 'Middle East Cross-border Logistics Platform',
      thumbnail: '/images/portfolio/eluterportada.png',
      content_zh: '# 中东跨境物流平台\n\n支持8个国家/地区的跨境物流服务，99.5%合规通过率。',
      content_en: '# Middle East Cross-border Logistics Platform\n\nCross-border logistics for 8 countries/regions.',
      tags: '物流,国际化,中东,合规',
      external_url: '',
      view_count: 203,
      sort_num: 4,
      status: 1,
      deleted_at: null,
      created_at: formatDate(new Date('2026-04-20')),
      updated_at: formatDate(new Date())
    },
    {
      id: 5,
      slug: 'intelligent-customer-service',
      cate_id: 2,
      name_zh: '兔智星智能客服系统',
      name_en: 'Tuzhixing Intelligent Customer Service',
      thumbnail: '/images/portfolio/c2tportada.png',
      content_zh: '# 兔智星智能客服系统\n\n92%意图识别准确率，25%用户满意度提升的智能客服解决方案。',
      content_en: '# Tuzhixing Intelligent Customer Service\n\n92% intent recognition accuracy.',
      tags: 'NLP,意图识别,客服,对话系统',
      external_url: '',
      view_count: 167,
      sort_num: 5,
      status: 1,
      deleted_at: null,
      created_at: formatDate(new Date('2026-04-10')),
      updated_at: formatDate(new Date())
    },
    {
      id: 6,
      slug: 'supply-chain-digital',
      cate_id: 2,
      name_zh: '供应链数字化中台',
      name_en: 'Supply Chain Digital Platform',
      thumbnail: '/images/portfolio/glocalportada.png',
      content_zh: '# 供应链数字化中台\n\n统一数据口径，打破数据孤岛，实现数据驱动决策。',
      content_en: '# Supply Chain Digital Platform\n\nData-driven decision making platform.',
      tags: '中台,供应链,数据,数字化',
      external_url: '',
      view_count: 98,
      sort_num: 6,
      status: 1,
      deleted_at: null,
      created_at: formatDate(new Date('2026-03-25')),
      updated_at: formatDate(new Date())
    },
    {
      id: 7,
      slug: 'pet-fund-me',
      cate_id: 4,
      name_zh: 'PetFundMe 宠物众筹平台',
      name_en: 'PetFundMe Pet Crowdfunding Platform',
      thumbnail: '/images/portfolio/petfundmeportada.png',
      content_zh: '# PetFundMe 宠物众筹平台\n\n社会公益项目，为流浪动物提供医疗救助众筹服务。',
      content_en: '# PetFundMe Pet Crowdfunding Platform\n\nSocial welfare project for stray animals.',
      tags: '公益,众筹,宠物,社会责任',
      external_url: '',
      view_count: 234,
      sort_num: 7,
      status: 1,
      deleted_at: null,
      created_at: formatDate(new Date('2026-03-15')),
      updated_at: formatDate(new Date())
    },
    {
      id: 8,
      slug: 'provacy-system',
      cate_id: 2,
      name_zh: 'Provacy 隐私合规系统',
      name_en: 'Provacy Privacy Compliance System',
      thumbnail: '/images/portfolio/provacyportada.png',
      content_zh: '# Provacy 隐私合规系统\n\n企业级隐私数据管理与合规检测系统。',
      content_en: '# Provacy Privacy Compliance System\n\nEnterprise privacy compliance system.',
      tags: '隐私,合规,GDPR,安全',
      external_url: '',
      view_count: 76,
      sort_num: 8,
      status: 1,
      deleted_at: null,
      created_at: formatDate(new Date('2026-03-01')),
      updated_at: formatDate(new Date())
    }
  ],

  visitStats: [],
  
  adminLogs: []
}