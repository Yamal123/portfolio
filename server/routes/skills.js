const express = require('express')
const router = express.Router()
const db = require('../services')

router.get('/', (req, res) => {
  const { page = 1, pageSize = 10, cateId, keyword } = req.query
  const result = db.getSkills({ page, pageSize, cateId, keyword })
  res.success(result)
})

router.post('/', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const { name, cate_id, level, description, tags, sort_num, status } = req.body
  
  if (!name) {
    return res.error(1001, '技能名称不能为空')
  }
  
  const skill = db.createSkill({ name, cate_id, level, description, tags, sort_num, status })
  
  db.addLog(req.user.id, req.user.nickname, 'create', 'skills', name, 
    { data: skill }, req.ip)
  
  res.success(skill)
})

router.put('/:id', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const { id } = req.params
  const existingSkill = db.getSkillById(id)
  
  if (!existingSkill) {
    return res.error(1004, '技能不存在')
  }
  
  const oldSkill = JSON.parse(JSON.stringify(existingSkill))
  const { name, cate_id, level, description, tags, sort_num, status } = req.body
  const skill = db.updateSkill(id, { name, cate_id, level, description, tags, sort_num, status })
  
  db.addLog(req.user.id, req.user.nickname, 'update', 'skills', skill.name, 
    { before: oldSkill, after: skill }, req.ip)
  
  res.success(skill)
})

router.delete('/:id', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const { id } = req.params
  const skill = db.deleteSkill(id)
  
  if (!skill) {
    return res.error(1004, '技能不存在')
  }
  
  db.addLog(req.user.id, req.user.nickname, 'delete', 'skills', skill.name, 
    { deleted: skill }, req.ip)
  
  res.success(null, '删除成功')
})

router.get('/skill-cates', (req, res) => {
  const cates = db.getSkillCates()
  res.success(cates)
})

module.exports = router