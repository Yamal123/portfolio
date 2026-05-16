const express = require('express')
const router = express.Router()
const db = require('../services')

router.get('/overview', (req, res) => {
  const overview = db.getAnalyticsOverview()
  res.success(overview)
})

router.get('/trend', (req, res) => {
  const days = parseInt(req.query.days) || 7
  const trend = db.getAnalyticsTrend(days)
  res.success(trend)
})

router.get('/top-projects', (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const topProjects = db.getTopProjects(limit)
  res.success(topProjects)
})

module.exports = router