const express = require('express')
const router = express.Router()
const db = require('../services')

router.get('/', (req, res) => {
  const stats = db.getStats()
  res.success(stats)
})

router.put('/', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const { years_of_experience, project_count, success_rate, efficiency_gain } = req.body
  const stats = db.updateStats({ years_of_experience, project_count, success_rate, efficiency_gain })
  
  db.addLog(req.user.id, req.user.nickname, 'update', 'stats', '统计数据', 
    { data: stats }, req.ip)
  
  res.success(stats)
})

module.exports = router