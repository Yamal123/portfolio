const express = require('express')
const cors = require('cors')
const config = require('./config')
const responseMiddleware = require('./middleware/response')
const authMiddleware = require('./middleware/auth')

const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const skillsRoutes = require('./routes/skills')
const projectsRoutes = require('./routes/projects')
const statsRoutes = require('./routes/stats')
const contactRoutes = require('./routes/contact')
const settingsRoutes = require('./routes/settings')
const analyticsRoutes = require('./routes/analytics')
const logsRoutes = require('./routes/logs')

const app = express()

app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(responseMiddleware)

app.get('/api/health', (req, res) => {
  res.success({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/visit', (req, res) => {
  const db = require('./services')
  const { page_path, duration } = req.body
  const ip = req.ip || req.headers['x-forwarded-for'] || ''
  const userAgent = req.headers['user-agent'] || ''
  
  db.recordVisit(ip, userAgent, page_path, duration)
  res.success(null, '记录成功')
})

app.post('/api/project/:slug/view', (req, res) => {
  const db = require('./services')
  const { slug } = req.params
  const project = db.incrementProjectView(slug)
  if (project) {
    res.success({ view_count: project.view_count })
  } else {
    res.success(null)
  }
})

app.use('/api/auth', authRoutes)

app.get('/api/skill-cates', (req, res) => {
  const db = require('./services')
  res.success(db.getSkillCates())
})

app.get('/api/project-cates', (req, res) => {
  const db = require('./services')
  res.success(db.getProjectCates())
})

app.get('/api/public/profile', (req, res) => {
  const db = require('./services')
  res.success(db.getPublicProfile())
})

app.get('/api/public/skills', (req, res) => {
  const db = require('./services')
  const { cateId } = req.query
  res.success(db.getPublicSkills(cateId))
})

app.get('/api/public/projects', (req, res) => {
  const db = require('./services')
  const { cateId, slug } = req.query
  if (slug) {
    const project = db.getProjectBySlug(slug)
    return res.success(project || null)
  }
  res.success(db.getPublicProjects(cateId))
})

app.get('/api/public/contact', (req, res) => {
  const db = require('./services')
  res.success(db.getPublicContact())
})

app.get('/api/public/settings', (req, res) => {
  const db = require('./services')
  res.success(db.getPublicSettings())
})

app.use('/api/profile', authMiddleware, profileRoutes)
app.use('/api/skills', authMiddleware, skillsRoutes)
app.use('/api/projects', authMiddleware, projectsRoutes)
app.use('/api/stats', authMiddleware, statsRoutes)
app.use('/api/contact', authMiddleware, contactRoutes)
app.use('/api/settings', authMiddleware, settingsRoutes)
app.use('/api/analytics', authMiddleware, analyticsRoutes)
app.use('/api/logs', authMiddleware, logsRoutes)

app.use((req, res) => {
  res.error(1004, '接口不存在')
})

app.use((err, req, res, next) => {
  console.error('Server Error:', err)
  res.error(1020, '服务器内部错误')
})

const PORT = config.port
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║     AI PM Portfolio Admin Server      ║
  ╠════════════════════════════════════════╣
  ║  Server running on: http://localhost:${PORT}  ║
  ║  API Base URL: http://localhost:${PORT}/api   ║
  ╠════════════════════════════════════════╣
  ║  Default Account:                      ║
  ║    Username: admin                     ║
  ║    Password: Admin@2026                ║
  ╚════════════════════════════════════════╝
  `)
})
