const express = require('express')
const router = express.Router()
const db = require('../services')

router.get('/', (req, res) => {
  const { page = 1, pageSize = 10, cateId, status, keyword } = req.query
  const result = db.getProjects({ page, pageSize, cateId, status, keyword })
  res.success(result)
})

router.post('/', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const { slug, cate_id, name_zh, name_en, thumbnail, content_zh, content_en, tags, external_url, sort_num, status } = req.body
  
  if (!slug || !name_zh) {
    return res.error(1001, '项目标识符和中文名称不能为空')
  }
  
  const existingSlug = db.data.projects.find(p => p.slug === slug && !p.deleted_at)
  if (existingSlug) {
    return res.error(1005, '项目标识符已存在')
  }
  
  const project = db.createProject({ 
    slug, cate_id, name_zh, name_en, thumbnail, content_zh, content_en, 
    tags, external_url, sort_num, status 
  })
  
  db.addLog(req.user.id, req.user.nickname, 'create', 'projects', name_zh, 
    { data: project }, req.ip)
  
  res.success(project)
})

router.put('/:id', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const { id } = req.params
  const existingProject = db.getProjectById(id)
  
  if (!existingProject) {
    return res.error(1004, '项目不存在')
  }
  
  const oldProject = JSON.parse(JSON.stringify(existingProject))
  const { slug, cate_id, name_zh, name_en, thumbnail, content_zh, content_en, tags, external_url, sort_num, status } = req.body
  
  if (slug && slug !== existingProject.slug) {
    const slugExists = db.data.projects.find(p => p.slug === slug && p.id !== Number(id) && !p.deleted_at)
    if (slugExists) {
      return res.error(1005, '项目标识符已存在')
    }
  }
  
  const project = db.updateProject(id, { 
    slug, cate_id, name_zh, name_en, thumbnail, content_zh, content_en, 
    tags, external_url, sort_num, status 
  })
  
  db.addLog(req.user.id, req.user.nickname, 'update', 'projects', project.name_zh, 
    { before: oldProject, after: project }, req.ip)
  
  res.success(project)
})

router.delete('/:id', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const { id } = req.params
  const project = db.softDeleteProject(id)
  
  if (!project) {
    return res.error(1004, '项目不存在')
  }
  
  db.addLog(req.user.id, req.user.nickname, 'delete', 'projects', project.name_zh, 
    { deleted: project }, req.ip)
  
  res.success(null, '删除成功')
})

router.get('/project-cates', (req, res) => {
  const cates = db.getProjectCates()
  res.success(cates)
})

module.exports = router