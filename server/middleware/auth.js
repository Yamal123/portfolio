const jwt = require('jsonwebtoken')
const config = require('../config')

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ code: 1002, message: '未登录或token无效', data: null, timestamp: Date.now() })
  }
  
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (err) {
    return res.json({ code: 1002, message: 'token已过期或无效', data: null, timestamp: Date.now() })
  }
}

module.exports = authMiddleware