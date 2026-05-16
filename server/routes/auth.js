const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const router = express.Router()
const db = require('../services')
const config = require('../config')

router.post('/login', (req, res) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    return res.error(1001, '用户名和密码不能为空')
  }
  
  const user = db.findUserByUsername(username)
  if (!user) {
    return res.error(1002, '用户名或密码错误')
  }
  
  if (user.status !== 1) {
    return res.error(1002, '账号已被禁用')
  }
  
  const hashedPassword = crypto.createHash('md5').update(password + config.salt).digest('hex')
  if (hashedPassword !== user.password) {
    return res.error(1002, '用户名或密码错误')
  }
  
  const ip = req.ip || req.headers['x-forwarded-for'] || ''
  db.updateUserLogin(user.id, ip)
  
  const token = jwt.sign(
    { id: user.id, username: user.username, nickname: user.nickname },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )
  
  db.addLog(user.id, user.nickname, 'login', 'auth', username, { action: '登录成功' }, ip)
  
  res.success({
    token,
    userInfo: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar
    }
  })
})

router.get('/me', (req, res) => {
  if (!req.user) {
    return res.error(1002, '未登录')
  }
  
  const userInfo = db.getUserById(req.user.id)
  if (!userInfo) {
    return res.error(1004, '用户不存在')
  }
  
  res.success(userInfo)
})

module.exports = router