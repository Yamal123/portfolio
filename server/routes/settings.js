const express = require('express')
const router = express.Router()
const db = require('../services')

router.get('/site', (req, res) => {
  const config = db.getSiteConfig()
  res.success(config)
})

router.put('/site', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const oldConfig = JSON.parse(JSON.stringify(db.getSiteConfig()))
  const config = db.updateSiteConfig(req.body)
  
  db.addLog(req.user.id, req.user.nickname, 'update', 'settings', '站点配置', 
    { before: oldConfig, after: config }, req.ip)
  
  res.success(config)
})

module.exports = router