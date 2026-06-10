import { and, asc, desc, eq, ilike, isNull, or } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { agentConfigs, articles, industryUpdates, profiles, projects, skills } from '@/lib/db/schema'
import type { AgentConfigInput, ArticleInput, IndustryUpdateInput, ProfileInput, ProjectInput, SkillInput } from './contracts'

function projectView(row: typeof projects.$inferSelect) {
  return {
    id: row.id,
    slug: row.slug,
    name: { zh: row.nameZh, en: row.nameEn },
    thumbnail: row.thumbnail,
    type: { zh: row.typeZh, en: row.typeEn },
    intro: { zh: row.introZh, en: row.introEn },
    keywords: row.keywords,
    tags: row.tags,
    emoji: row.emoji,
    problem: { zh: row.problemZh, en: row.problemEn },
    action: { zh: row.actionZh, en: row.actionEn },
    result: { zh: row.resultZh, en: row.resultEn },
    content: { zh: row.contentZh, en: row.contentEn },
    externalUrl: row.externalUrl,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString().slice(0, 10),
  }
}

function articleView(row: typeof articles.$inferSelect) {
  return {
    id: row.id,
    slug: row.slug,
    title: { zh: row.titleZh, en: row.titleEn },
    intro: { zh: row.introZh, en: row.introEn },
    keywords: row.keywords,
    content: { zh: row.contentZh, en: row.contentEn },
    published: row.published,
    wasPublished: row.wasPublished,
    createdAt: row.publishedAt.toISOString().slice(0, 10),
  }
}

function industryUpdateView(row: typeof industryUpdates.$inferSelect): IndustryUpdateInput {
  return {
    id: row.id,
    slug: row.slug,
    title: { zh: row.titleZh, en: row.titleEn },
    intro: { zh: row.introZh, en: row.introEn },
    keywords: row.keywords,
    content: { zh: row.contentZh, en: row.contentEn },
    coverImage: row.coverImage,
    sources: row.sources,
    newsItems: row.newsItems as IndustryUpdateInput['newsItems'],
    techItems: row.techItems as IndustryUpdateInput['techItems'],
    published: row.published,
    createdAt: row.publishedAt.toISOString().slice(0, 10),
  }
}

function profileView(row: typeof profiles.$inferSelect) {
  return {
    nickname: row.nickname,
    avatar: row.avatar,
    titleZh: row.titleZh,
    titleEn: row.titleEn,
    bioZh: row.bioZh,
    bioEn: row.bioEn,
    yearsOfExperience: row.yearsOfExperience,
    successRate: row.successRate,
    efficiencyGain: row.efficiencyGain,
    contact: {
      email: row.email,
      phone: row.phone,
      wechatId: row.wechatId,
      wechatQrcode: row.wechatQrcode,
      linkedin: row.linkedin,
      github: row.github,
      zhihu: row.zhihu,
      emailDisplayed: row.emailDisplayed,
      phoneDisplayed: row.phoneDisplayed,
      wechatDisplayed: row.wechatDisplayed,
    },
    experiences: row.experiences,
  }
}

export async function getProfile() {
  const row = (await getDb().select().from(profiles).limit(1))[0]
  return row ? profileView(row) : null
}

export async function getPublicProfile() {
  const profile = await getProfile()
  if (!profile) return null
  return {
    ...profile,
    contact: {
      ...profile.contact,
      email: profile.contact.emailDisplayed ? profile.contact.email : '',
      phone: profile.contact.phoneDisplayed ? profile.contact.phone : '',
      wechatId: profile.contact.wechatDisplayed ? profile.contact.wechatId : '',
      wechatQrcode: profile.contact.wechatDisplayed ? profile.contact.wechatQrcode : '',
    },
  }
}

export async function saveProfile(input: ProfileInput) {
  const values = {
    nickname: input.nickname, avatar: input.avatar, titleZh: input.titleZh, titleEn: input.titleEn,
    bioZh: input.bioZh, bioEn: input.bioEn, yearsOfExperience: input.yearsOfExperience,
    successRate: input.successRate, efficiencyGain: input.efficiencyGain, email: input.contact.email,
    phone: input.contact.phone, wechatId: input.contact.wechatId, wechatQrcode: input.contact.wechatQrcode,
    linkedin: input.contact.linkedin, github: input.contact.github, zhihu: input.contact.zhihu,
    emailDisplayed: input.contact.emailDisplayed, phoneDisplayed: input.contact.phoneDisplayed,
    wechatDisplayed: input.contact.wechatDisplayed, experiences: input.experiences, updatedAt: new Date(),
  }
  const existing = (await getDb().select({ id: profiles.id }).from(profiles).limit(1))[0]
  const row = existing
    ? (await getDb().update(profiles).set(values).where(eq(profiles.id, existing.id)).returning())[0]
    : (await getDb().insert(profiles).values(values).returning())[0]
  return profileView(row)
}

export async function listProjects(options: { admin?: boolean; query?: string } = {}) {
  const filters = options.admin
    ? [isNull(projects.deletedAt)]
    : [isNull(projects.deletedAt), eq(projects.published, true)]
  if (options.query) {
    filters.push(or(
      ilike(projects.nameZh, `%${options.query}%`),
      ilike(projects.nameEn, `%${options.query}%`),
      ilike(projects.introZh, `%${options.query}%`)
    )!)
  }
  const rows = await getDb().select().from(projects).where(and(...filters)).orderBy(asc(projects.sortOrder), desc(projects.createdAt))
  return rows.map(projectView)
}

export async function getProject(slug: string, admin = false) {
  const row = (await getDb().select().from(projects).where(and(
    eq(projects.slug, slug), isNull(projects.deletedAt),
    ...(admin ? [] : [eq(projects.published, true)])
  )).limit(1))[0]
  return row ? projectView(row) : null
}

export async function saveProject(input: ProjectInput, update = false) {
  const createdAt = input.createdAt ? new Date(input.createdAt) : new Date()
  const values = {
    slug: input.slug, nameZh: input.name.zh, nameEn: input.name.en, thumbnail: input.thumbnail,
    typeZh: input.type.zh, typeEn: input.type.en, introZh: input.intro.zh, introEn: input.intro.en,
    keywords: input.keywords, tags: input.tags, emoji: input.emoji, problemZh: input.problem.zh,
    problemEn: input.problem.en, actionZh: input.action.zh, actionEn: input.action.en,
    resultZh: input.result.zh, resultEn: input.result.en, contentZh: input.content.zh,
    contentEn: input.content.en, externalUrl: input.externalUrl, published: input.published,
    sortOrder: input.sortOrder, updatedAt: new Date(),
  }
  if (update) {
    const row = (await getDb().update(projects).set(values).where(eq(projects.slug, input.slug)).returning())[0]
    if (!row) throw new Error('Project not found')
    return projectView(row)
  }
  const row = (await getDb().insert(projects).values({ ...values, createdAt }).returning())[0]
  return projectView(row)
}

export async function deleteProject(slug: string) {
  return getDb().update(projects).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(projects.slug, slug)).returning()
}

export async function listArticles(options: { admin?: boolean; query?: string } = {}) {
  const filters = options.admin
    ? [isNull(articles.deletedAt)]
    : [isNull(articles.deletedAt), eq(articles.published, true)]
  if (options.query) {
    filters.push(or(ilike(articles.titleZh, `%${options.query}%`), ilike(articles.titleEn, `%${options.query}%`), ilike(articles.introZh, `%${options.query}%`))!)
  }
  const rows = await getDb().select().from(articles).where(and(...filters)).orderBy(desc(articles.publishedAt))
  return rows.map(articleView)
}

export async function getArticle(slug: string, admin = false) {
  const row = (await getDb().select().from(articles).where(and(
    eq(articles.slug, slug), isNull(articles.deletedAt),
    ...(admin ? [] : [eq(articles.published, true)])
  )).limit(1))[0]
  return row ? articleView(row) : null
}

export async function saveArticle(input: ArticleInput, update = false) {
  const existingRow = update
    ? (await getDb().select().from(articles).where(eq(articles.slug, input.slug)).limit(1))[0]
    : null
  const wasPublished = input.wasPublished ?? existingRow?.wasPublished ?? (input.published ? true : false)
  const values = {
    slug: input.slug, titleZh: input.title.zh, titleEn: input.title.en, introZh: input.intro.zh,
    introEn: input.intro.en, keywords: input.keywords, contentZh: input.content.zh, contentEn: input.content.en,
    published: input.published, wasPublished: wasPublished ?? false, publishedAt: new Date(input.createdAt), updatedAt: new Date(),
  }
  const row = update
    ? (await getDb().update(articles).set(values).where(eq(articles.slug, input.slug)).returning())[0]
    : (await getDb().insert(articles).values(values).returning())[0]
  if (!row) throw new Error('Article not found')
  return articleView(row)
}

export async function deleteArticle(slug: string) {
  return getDb().update(articles).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(articles.slug, slug)).returning()
}

export async function listIndustryUpdates(options: { admin?: boolean; query?: string } = {}) {
  const filters = options.admin
    ? [isNull(industryUpdates.deletedAt)]
    : [isNull(industryUpdates.deletedAt), eq(industryUpdates.published, true)]
  if (options.query) {
    filters.push(or(
      ilike(industryUpdates.titleZh, `%${options.query}%`),
      ilike(industryUpdates.titleEn, `%${options.query}%`),
      ilike(industryUpdates.introZh, `%${options.query}%`),
      ilike(industryUpdates.contentZh, `%${options.query}%`),
    )!)
  }
  const rows = await getDb().select().from(industryUpdates).where(and(...filters)).orderBy(desc(industryUpdates.publishedAt))
  return rows.map(industryUpdateView)
}

export async function getIndustryUpdate(slug: string, admin = false) {
  const row = (await getDb().select().from(industryUpdates).where(and(
    eq(industryUpdates.slug, slug), isNull(industryUpdates.deletedAt),
    ...(admin ? [] : [eq(industryUpdates.published, true)])
  )).limit(1))[0]
  return row ? industryUpdateView(row) : null
}

export async function saveIndustryUpdate(input: IndustryUpdateInput, update = false) {
  const values = {
    slug: input.slug, titleZh: input.title.zh, titleEn: input.title.en, introZh: input.intro.zh,
    introEn: input.intro.en, keywords: input.keywords, contentZh: input.content.zh, contentEn: input.content.en,
    coverImage: input.coverImage, sources: input.sources, newsItems: input.newsItems, techItems: input.techItems,
    published: input.published, publishedAt: new Date(input.createdAt), updatedAt: new Date(),
  }
  const row = update
    ? (await getDb().update(industryUpdates).set(values).where(eq(industryUpdates.slug, input.slug)).returning())[0]
    : (await getDb().insert(industryUpdates).values(values).onConflictDoUpdate({ target: industryUpdates.slug, set: values }).returning())[0]
  if (!row) throw new Error('Industry update not found')
  return industryUpdateView(row)
}

export async function deleteIndustryUpdate(slug: string) {
  return getDb().update(industryUpdates).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(industryUpdates.slug, slug)).returning()
}

export async function listSkills(query = '', category?: string) {
  const filters = [eq(skills.enabled, true)]
  if (category) filters.push(eq(skills.category, category))
  if (query) filters.push(or(ilike(skills.nameZh, `%${query}%`), ilike(skills.nameEn, `%${query}%`))!)
  return getDb().select().from(skills).where(and(...filters)).orderBy(asc(skills.sortOrder))
}

export async function listAdminSkills() {
  return getDb().select().from(skills).orderBy(asc(skills.sortOrder))
}

export async function saveSkill(input: SkillInput, update = false) {
  const values = { nameZh: input.nameZh, nameEn: input.nameEn, level: input.level, category: input.category, sortOrder: input.sortOrder, enabled: input.enabled, updatedAt: new Date() }
  if (update && input.id) {
    return (await getDb().update(skills).set(values).where(eq(skills.id, input.id)).returning())[0]
  }
  return (await getDb().insert(skills).values(values).returning())[0]
}

export async function deleteSkill(id: number) {
  return getDb().delete(skills).where(eq(skills.id, id)).returning()
}

export async function getAgentConfig() {
  return (await getDb().select().from(agentConfigs).limit(1))[0] || null
}

export async function saveAgentConfig(input: AgentConfigInput) {
  const existing = (await getDb().select({ id: agentConfigs.id }).from(agentConfigs).limit(1))[0]
  const values = { ...input, updatedAt: new Date() }
  return existing
    ? (await getDb().update(agentConfigs).set(values).where(eq(agentConfigs.id, existing.id)).returning())[0]
    : (await getDb().insert(agentConfigs).values(values).returning())[0]
}
