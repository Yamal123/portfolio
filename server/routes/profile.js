const express = require('express')
const router = express.Router()
const db = require('../services')

router.get('/', (req, res) => {
  const profile = db.getProfile()
  if (!profile) {
    return res.error(1004, '个人主页信息不存在')
  }
  res.success(profile)
})

router.put('/', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const allowedFields = ['nickname', 'signature', 'introduction', 'avatar', 'years_of_experience', 'project_count', 'success_rate', 'efficiency_gain']
  const updateData = {}
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field]
    }
  })
  
  const oldProfile = JSON.parse(JSON.stringify(db.getProfile()))
  const profile = db.updateProfile(updateData)
  
  if (profile) {
    db.addLog(req.user.id, req.user.nickname, 'update', 'profile', profile.nickname, 
      { before: oldProfile, after: profile }, req.ip)
    res.success(profile)
  } else {
    res.error(1020, '更新失败')
  }
})

module.exports = router