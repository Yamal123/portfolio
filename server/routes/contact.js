const express = require('express')
const router = express.Router()
const db = require('../services')

router.get('/', (req, res) => {
  const contact = db.getContact()
  if (!contact) {
    return res.error(1004, '联系方式不存在')
  }
  res.success(contact)
})

router.put('/', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const { email, email_displayed, phone, phone_displayed, wechat_id, wechat_qrcode, wechat_displayed } = req.body
  const oldContact = JSON.parse(JSON.stringify(db.getContact()))
  const contact = db.updateContact({ 
    email, email_displayed, phone, phone_displayed, 
    wechat_id, wechat_qrcode, wechat_displayed 
  })
  
  if (contact) {
    db.addLog(req.user.id, req.user.nickname, 'update', 'contact', '联系方式', 
      { before: oldContact, after: contact }, req.ip)
    res.success(contact)
  } else {
    res.error(1020, '更新失败')
  }
})

module.exports = router