const crypto = require('crypto')
const initialData = require('../data/initialData')
const config = require('../config')

function formatDate(date) {
  const d = new Date(date)
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

class DataService {
  constructor() {
    this.data = JSON.parse(JSON.stringify(initialData))
    this.idCounters = {
      adminUsers: 1,
      siteConfig: 6,
      userProfile: 1,
      contactInfo: 1,
      userTags: 7,
      skillCates: 4,
      projectCates: 4,
      skills: 16,
      projects: 8,
      visitStats: 0,
      adminLogs: 0
    }
    
    this.initializeCounters()
  }

  initializeCounters() {
    Object.keys(this.data).forEach(key => {
      if (Array.isArray(this.data[key]) && this.data[key].length > 0) {
        const maxId = Math.max(...this.data[key].map(item => item.id))
        this.idCounters[key] = maxId
      }
    })
  }

  nextId(table) {
    this.idCounters[table] = (this.idCounters[table] || 0) + 1
    return this.idCounters[table]
  }

  addLog(adminId, adminName, actionType, targetModule, targetName, content, ip) {
    const log = {
      id: this.nextId('adminLogs'),
      admin_id: adminId || 0,
      admin_name: adminName || '',
      action_type: actionType,
      target_module: targetModule || '',
      target_name: targetName || '',
      content: typeof content === 'object' ? JSON.stringify(content) : content || '',
      ip_address: ip || '',
      created_at: formatDate(new Date())
    }
    this.data.adminLogs.unshift(log)
    return log
  }

  paginate(array, page = 1, pageSize = 10) {
    const total = array.length
    const totalPage = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const list = array.slice(start, start + pageSize)
    return { list, total, page: Number(page), pageSize: Number(pageSize), totalPage }
  }

  findUserByUsername(username) {
    return this.data.adminUsers.find(u => u.username === username)
  }

  updateUserLogin(id, ip) {
    const user = this.data.adminUsers.find(u => u.id === id)
    if (user) {
      user.login_ip = ip
      user.login_at = formatDate(new Date())
      user.fail_count = 0
      user.updated_at = formatDate(new Date())
    }
    return user
  }

  getUserById(id) {
    const user = this.data.adminUsers.find(u => u.id === id)
    if (user) {
      const { password, salt, ...safeUser } = user
      return safeUser
    }
    return null
  }

  getProfile() {
    return this.data.userProfile[0] || null
  }

  updateProfile(data) {
    if (this.data.userProfile.length > 0) {
      Object.assign(this.data.userProfile[0], data, { updated_at: formatDate(new Date()) })
      return this.data.userProfile[0]
    }
    return null
  }

  getSkills(query = {}) {
    let result = [...this.data.skills]
    
    if (query.cateId) {
      result = result.filter(s => s.cate_id === Number(query.cateId))
    }
    if (query.keyword) {
      const kw = query.keyword.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(kw) || s.description.toLowerCase().includes(kw))
    }
    if (query.status !== undefined) {
      result = result.filter(s => s.status === Number(query.status))
    }
    
    result.sort((a, b) => a.sort_num - b.sort_num)
    return this.paginate(result, query.page, query.pageSize)
  }

  getSkillById(id) {
    return this.data.skills.find(s => s.id === Number(id))
  }

  createSkill(data) {
    const skill = {
      id: this.nextId('skills'),
      cate_id: data.cate_id || 0,
      name: data.name || '',
      level: data.level || 0,
      description: data.description || '',
      tags: data.tags || '',
      sort_num: data.sort_num || 0,
      status: data.status !== undefined ? data.status : 1,
      created_at: formatDate(new Date()),
      updated_at: formatDate(new Date())
    }
    this.data.skills.push(skill)
    return skill
  }

  updateSkill(id, data) {
    const skill = this.data.skills.find(s => s.id === Number(id))
    if (skill) {
      Object.assign(skill, data, { updated_at: formatDate(new Date()) })
    }
    return skill
  }

  deleteSkill(id) {
    const index = this.data.skills.findIndex(s => s.id === Number(id))
    if (index !== -1) {
      return this.data.skills.splice(index, 1)[0]
    }
    return null
  }

  getSkillCates() {
    return this.data.skillCates.filter(c => c.status === 1).sort((a, b) => a.sort_num - b.sort_num)
  }

  getProjects(query = {}) {
    let result = this.data.projects.filter(p => !p.deleted_at)
    
    if (query.cateId) {
      result = result.filter(p => p.cate_id === Number(query.cateId))
    }
    if (query.status !== undefined && query.status !== '') {
      result = result.filter(p => p.status === Number(query.status))
    }
    if (query.keyword) {
      const kw = query.keyword.toLowerCase()
      result = result.filter(p => 
        p.name_zh.toLowerCase().includes(kw) || 
        p.name_en.toLowerCase().includes(kw) ||
        p.slug.toLowerCase().includes(kw)
      )
    }
    
    result.sort((a, b) => a.sort_num - b.sort_num)
    return this.paginate(result, query.page, query.pageSize)
  }

  getProjectById(id) {
    return this.data.projects.find(p => p.id === Number(id))
  }

  createProject(data) {
    const project = {
      id: this.nextId('projects'),
      slug: data.slug || '',
      cate_id: data.cate_id || 0,
      name_zh: data.name_zh || '',
      name_en: data.name_en || '',
      type_zh: data.type_zh || '个人项目',
      type_en: data.type_en || 'Personal Project',
      intro_zh: data.intro_zh || '',
      intro_en: data.intro_en || '',
      problem_zh: data.problem_zh || '',
      problem_en: data.problem_en || '',
      action_zh: data.action_zh || '',
      action_en: data.action_en || '',
      result_zh: data.result_zh || '',
      result_en: data.result_en || '',
      thumbnail: data.thumbnail || '',
      content_zh: data.content_zh || '',
      content_en: data.content_en || '',
      keywords: data.keywords || '',
      tags: data.tags || '',
      emoji: data.emoji || '📦',
      external_url: data.external_url || '',
      view_count: 0,
      sort_num: data.sort_num || 0,
      status: data.status !== undefined ? data.status : 1,
      deleted_at: null,
      created_at: formatDate(new Date()),
      updated_at: formatDate(new Date())
    }
    this.data.projects.push(project)
    return project
  }

  updateProject(id, data) {
    const project = this.data.projects.find(p => p.id === Number(id))
    if (project) {
      Object.assign(project, data, { updated_at: formatDate(new Date()) })
    }
    return project
  }

  softDeleteProject(id) {
    const project = this.data.projects.find(p => p.id === Number(id))
    if (project) {
      project.deleted_at = formatDate(new Date())
      project.updated_at = formatDate(new Date())
    }
    return project
  }

  getProjectCates() {
    return this.data.projectCates.filter(c => c.status === 1).sort((a, b) => a.sort_num - b.sort_num)
  }

  getStats() {
    const profile = this.getProfile()
    return {
      years_of_experience: profile?.years_of_experience || 5,
      project_count: this.data.projects.filter(p => !p.deleted_at).length,
      success_rate: profile?.success_rate || 95.0,
      efficiency_gain: profile?.efficiency_gain || 40.0,
      total_skills: this.data.skills.length,
      active_skills: this.data.skills.filter(s => s.status === 1).length,
      total_views: this.data.projects.reduce((sum, p) => sum + (p.view_count || 0), 0),
      total_visits: this.data.visitStats.length
    }
  }

  updateStats(data) {
    const profile = this.getProfile()
    if (profile) {
      Object.assign(profile, data, { updated_at: formatDate(new Date()) })
    }
    return this.getStats()
  }

  getContact() {
    return this.data.contactInfo[0] || null
  }

  updateContact(data) {
    if (this.data.contactInfo.length > 0) {
      Object.assign(this.data.contactInfo[0], data, { updated_at: formatDate(new Date()) })
      return this.data.contactInfo[0]
    }
    return null
  }

  getSiteConfig() {
    const configObj = {}
    this.data.siteConfig.forEach(c => {
      configObj[c.config_key] = c.config_value
    })
    return configObj
  }

  updateSiteConfig(data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        const existing = this.data.siteConfig.find(c => c.config_key === key)
        if (existing) {
          existing.config_value = data[key]
          existing.updated_at = formatDate(new Date())
        } else {
          this.data.siteConfig.push({
            id: this.nextId('siteConfig'),
            config_key: key,
            config_value: data[key],
            remark: '',
            created_at: formatDate(new Date()),
            updated_at: formatDate(new Date())
          })
        }
      })
    }
    return this.getSiteConfig()
  }

  getAnalyticsOverview() {
    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    
    const allVisits = this.data.visitStats
    const todayVisits = allVisits.filter(v => v.visit_date === today)
    const weekVisits = allVisits.filter(v => v.visit_date >= sevenDaysAgo)
    
    const uniqueIPsToday = new Set(todayVisits.map(v => v.ip_address))
    const uniqueIPsWeek = new Set(weekVisits.map(v => v.ip_address))
    
    const projectViews = {}
    this.data.projects.filter(p => !p.deleted_at).forEach(p => {
      projectViews[p.slug] = p.view_count || 0
    })

    return {
      total_pv: allVisits.length + this.data.projects.reduce((sum, p) => sum + (p.view_count || 0), 0),
      total_uv: new Set(allVisits.map(v => v.ip_address)).size,
      today_pv: todayVisits.length,
      today_uv: uniqueIPsToday.size,
      week_pv: weekVisits.length,
      week_uv: uniqueIPsWeek.size,
      total_projects: this.data.projects.filter(p => !p.deleted_at).length,
      total_skills: this.data.skills.filter(s => s.status === 1).length,
      top_projects: Object.entries(projectViews)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([slug, views]) => ({ slug, views }))
    }
  }

  getAnalyticsTrend(days = 7) {
    const result = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().slice(0, 10)
      const dayVisits = this.data.visitStats.filter(v => v.visit_date === dateStr)
      
      result.push({
        date: dateStr,
        uv: new Set(dayVisits.map(v => v.ip_address)).size,
        pv: dayVisits.length
      })
    }
    
    return result
  }

  getTopProjects(limit = 10) {
    return this.data.projects
      .filter(p => !p.deleted_at)
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, limit)
      .map(p => ({
        id: p.id,
        slug: p.slug,
        name_zh: p.name_zh,
        name_en: p.name_en,
        thumbnail: p.thumbnail,
        view_count: p.view_count || 0
      }))
  }

  getLogs(query = {}) {
    let result = [...this.data.adminLogs]
    
    if (query.actionType) {
      result = result.filter(l => l.action_type === query.actionType)
    }
    if (query.targetModule) {
      result = result.filter(l => l.target_module === query.targetModule)
    }
    
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return this.paginate(result, query.page, query.pageSize)
  }

  recordVisit(ip, userAgent, pagePath, duration = 0) {
    const visit = {
      id: this.nextId('visitStats'),
      visit_date: new Date().toISOString().slice(0, 10),
      ip_address: ip || '',
      user_agent: userAgent || '',
      page_path: pagePath || '/',
      duration: duration,
      created_at: formatDate(new Date())
    }
    this.data.visitStats.push(visit)
    return visit
  }

  incrementProjectView(slug) {
    const project = this.data.projects.find(p => p.slug === slug)
    if (project) {
      project.view_count = (project.view_count || 0) + 1
    }
    return project
  }

  getPublicProfile() {
    const profile = this.getProfile()
    if (!profile) return null
    const { id, created_at, updated_at, ...publicData } = profile
    return publicData
  }

  getPublicSkills(cateId) {
    let result = this.data.skills.filter(s => s.status === 1)
    if (cateId) {
      result = result.filter(s => s.cate_id === Number(cateId))
    }
    return result.sort((a, b) => a.sort_num - b.sort_num)
  }

  getPublicProjects(cateId) {
    let result = this.data.projects.filter(p => !p.deleted_at && p.status === 1)
    if (cateId) {
      result = result.filter(p => p.cate_id === Number(cateId))
    }
    return result.sort((a, b) => a.sort_num - b.sort_num)
  }

  getProjectBySlug(slug) {
    const project = this.data.projects.find(p => p.slug === slug && !p.deleted_at && p.status === 1)
    if (!project) return null
    return project
  }

  getPublicContact() {
    const contact = this.getContact()
    if (!contact) return null
    return {
      email: contact.email_displayed ? contact.email : '',
      phone: contact.phone_displayed ? contact.phone : '',
      wechat_id: contact.wechat_displayed ? contact.wechat_id : '',
      wechat_qrcode: contact.wechat_displayed ? contact.wechat_qrcode : ''
    }
  }

  getPublicSettings() {
    const config = this.getSiteConfig()
    return {
      site_title: config.site_title || 'AI PM Portfolio',
      site_description: config.site_description || '',
      copyright: config.copyright || ''
    }
  }
}

module.exports = new DataService()