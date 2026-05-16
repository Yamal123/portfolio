const express = require('express')
const router = express.Router()
const db = require('../services')

router.get('/', (req, res) => {
  const { page = 1, pageSize = 10, actionType, targetModule } = req.query
  const result = db.getLogs({ page, pageSize, actionType, targetModule })
  res.success(result)
})

module.exports = router