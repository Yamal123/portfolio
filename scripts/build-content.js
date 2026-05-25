#!/usr/bin/env node

/**
 * Build script: reads content files from content/ directory
 * and generates data/articles.gen.json and data/projects.gen.json
 *
 * Content types supported:
 * - markdown (.md) — inline content
 * - html (.html) — inline content
 * - docx, pptx, pdf, xlsx — serving path reference
 */

const fs = require('fs')
const path = require('path')

const CONTENT_ROOT = path.join(__dirname, '..', 'content')
const ARTICLES_DIR = path.join(CONTENT_ROOT, 'articles')
const PROJECTS_DIR = path.join(CONTENT_ROOT, 'projects')
const DATA_DIR = path.join(__dirname, '..', 'data')

function readMeta(dirPath) {
  const metaPath = path.join(dirPath, 'meta.json')
  if (!fs.existsSync(metaPath)) return null
  return JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
}

function readContent(dirPath, lang) {
  const textExts = ['md', 'html', 'txt']
  for (const ext of textExts) {
    const f = path.join(dirPath, `content.${lang}.${ext}`)
    if (fs.existsSync(f)) {
      return { text: fs.readFileSync(f, 'utf-8'), type: ext === 'html' ? 'html' : 'markdown' }
    }
  }
  // Binary files - return a download reference
  const binExts = ['docx', 'pptx', 'pdf', 'xlsx']
  for (const ext of binExts) {
    const f = path.join(dirPath, `content.${lang}.${ext}`)
    if (fs.existsSync(f)) {
      const relPath = path.relative(CONTENT_ROOT, dirPath)
      return { text: '', type: ext, file: `/content/${relPath}/content.${lang}.${ext}` }
    }
  }
  return { text: '', type: 'none' }
}

function buildArticles() {
  const articles = []
  if (!fs.existsSync(ARTICLES_DIR)) return

  const dirs = fs.readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())

  for (const dir of dirs) {
    const dirPath = path.join(ARTICLES_DIR, dir.name)
    const meta = readMeta(dirPath)
    if (!meta) continue

    const zhContent = readContent(dirPath, 'zh')
    const enContent = readContent(dirPath, 'en')

    articles.push({
      id: meta.id,
      slug: meta.slug || dir.name,
      title: { zh: meta.titleZh, en: meta.titleEn },
      createdAt: meta.createdAt,
      intro: { zh: meta.introZh || '', en: meta.introEn || '' },
      keywords: meta.keywords || [],
      contentType: zhContent.type,
      contentFile: zhContent.file || null,
      content: { zh: zhContent.text, en: enContent.text },
    })
  }

  fs.writeFileSync(path.join(DATA_DIR, 'articles.gen.json'), JSON.stringify(articles, null, 2))
  console.log(`Generated data/articles.gen.json with ${articles.length} articles`)
}

function buildProjects() {
  const projects = []
  if (!fs.existsSync(PROJECTS_DIR)) return

  const dirs = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())

  for (const dir of dirs) {
    const dirPath = path.join(PROJECTS_DIR, dir.name)
    const meta = readMeta(dirPath)
    if (!meta) continue

    const zhContent = readContent(dirPath, 'zh')
    const enContent = readContent(dirPath, 'en')

    projects.push({
      id: meta.id,
      slug: meta.slug || dir.name,
      name: { zh: meta.titleZh, en: meta.titleEn },
      thumbnail: meta.thumbnail || '',
      type: { zh: meta.typeZh || '个人项目', en: meta.typeEn || 'Personal Project' },
      intro: { zh: meta.introZh || '', en: meta.introEn || '' },
      keywords: meta.keywords || [],
      createdAt: meta.createdAt || new Date().toISOString().slice(0, 10),
      emoji: meta.emoji || '📦',
      problem: { zh: meta.problemZh || '', en: meta.problemEn || '' },
      action: { zh: meta.actionZh || '', en: meta.actionEn || '' },
      result: { zh: meta.resultZh || '', en: meta.resultEn || '' },
      tags: meta.tags || [],
      content: { zh: zhContent.text, en: enContent.text },
      contentType: zhContent.type,
      contentFile: zhContent.file || null,
      externalUrl: meta.externalUrl || '',
      view_count: meta.view_count || 0,
    })
  }

  fs.writeFileSync(path.join(DATA_DIR, 'projects.gen.json'), JSON.stringify(projects, null, 2))
  console.log(`Generated data/projects.gen.json with ${projects.length} projects`)
}

// Ensure directories exist
fs.mkdirSync(ARTICLES_DIR, { recursive: true })
fs.mkdirSync(PROJECTS_DIR, { recursive: true })

buildArticles()
buildProjects()
