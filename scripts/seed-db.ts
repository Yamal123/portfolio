import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { eq } from 'drizzle-orm'
import { config as loadEnv } from 'dotenv'
import { getDb } from '../lib/db'
import { agentConfigs, articles, profiles, projects, skills } from '../lib/db/schema'

loadEnv({ path: join(process.cwd(), '.env.local') })
loadEnv()

async function main() {
  const contentRoot = join(process.cwd(), 'content')
  const db = getDb()

  const profile = JSON.parse(await readFile(join(contentRoot, 'profile', 'meta.json'), 'utf8'))
  const existingProfile = (await db.select({ id: profiles.id }).from(profiles).limit(1))[0]
  const profileValues = {
    nickname: profile.nickname, avatar: profile.avatar, titleZh: profile.titleZh, titleEn: profile.titleEn,
    bioZh: profile.bioZh, bioEn: profile.bioEn, yearsOfExperience: profile.yearsOfExperience,
    successRate: profile.successRate, efficiencyGain: profile.efficiencyGain, email: profile.contact.email,
    phone: profile.contact.phone, wechatId: profile.contact.wechatId, wechatQrcode: profile.contact.wechatQrcode,
    linkedin: profile.contact.linkedin, github: profile.contact.github, zhihu: profile.contact.zhihu,
    emailDisplayed: profile.contact.emailDisplayed, phoneDisplayed: profile.contact.phoneDisplayed,
    wechatDisplayed: profile.contact.wechatDisplayed, experiences: profile.experiences,
  }
  if (existingProfile) await db.update(profiles).set(profileValues).where(eq(profiles.id, existingProfile.id))
  else await db.insert(profiles).values(profileValues)

  const seededSkills = profile.skills.map((skill: any, index: number) => ({
    nameZh: skill.nameZh, nameEn: skill.nameEn, level: skill.level, category: skill.category, sortOrder: index,
  }))
  if ((await db.select({ id: skills.id }).from(skills).limit(1)).length === 0) {
    await db.insert(skills).values(seededSkills)
  }

  for (const directory of await readdir(join(contentRoot, 'projects'))) {
    if (directory.startsWith('.')) continue
    const root = join(contentRoot, 'projects', directory)
    const meta = JSON.parse(await readFile(join(root, 'meta.json'), 'utf8'))
    const contentZh = await readFile(join(root, 'content.zh.md'), 'utf8').catch(() => '')
    const contentEn = await readFile(join(root, 'content.en.md'), 'utf8').catch(() => '')
    const values = {
      slug: meta.slug || directory, nameZh: meta.titleZh, nameEn: meta.titleEn, thumbnail: meta.thumbnail || '',
      typeZh: meta.typeZh || '', typeEn: meta.typeEn || '', introZh: meta.introZh || '', introEn: meta.introEn || '',
      keywords: meta.keywords || [], tags: meta.tags || [], emoji: meta.emoji || '', problemZh: meta.problemZh || '',
      problemEn: meta.problemEn || '', actionZh: meta.actionZh || '', actionEn: meta.actionEn || '', resultZh: meta.resultZh || '',
      resultEn: meta.resultEn || '', contentZh, contentEn, externalUrl: meta.externalUrl || '', createdAt: new Date(meta.createdAt),
    }
    await db.insert(projects).values(values).onConflictDoUpdate({ target: projects.slug, set: values })
  }

  for (const directory of await readdir(join(contentRoot, 'articles'))) {
    if (directory.startsWith('.')) continue
    const root = join(contentRoot, 'articles', directory)
    const meta = JSON.parse(await readFile(join(root, 'meta.json'), 'utf8'))
    const contentZh = await readFile(join(root, 'content.zh.md'), 'utf8').catch(() => '')
    const contentEn = await readFile(join(root, 'content.en.md'), 'utf8').catch(() => '')
    const values = {
      slug: meta.slug || directory, titleZh: meta.titleZh, titleEn: meta.titleEn, introZh: meta.introZh || '',
      introEn: meta.introEn || '', keywords: meta.keywords || [], contentZh, contentEn, publishedAt: new Date(meta.createdAt),
    }
    await db.insert(articles).values(values).onConflictDoUpdate({ target: articles.slug, set: values })
  }

  const agentConfig = JSON.parse(await readFile(join(contentRoot, 'agent', 'config.json'), 'utf8'))
  const existingConfig = (await db.select({ id: agentConfigs.id }).from(agentConfigs).limit(1))[0]
  const agentValues = {
    mode: agentConfig.mode, provider: agentConfig.provider, model: agentConfig.model, baseUrl: agentConfig.baseUrl,
    maxToolRounds: agentConfig.maxToolRounds, systemPrompt: agentConfig.systemPrompt,
    welcomeMessage: agentConfig.welcomeMessage, quickQuestions: agentConfig.quickQuestions,
  }
  if (existingConfig) await db.update(agentConfigs).set(agentValues).where(eq(agentConfigs.id, existingConfig.id))
  else await db.insert(agentConfigs).values(agentValues)

  console.log('Seeded live portfolio content and Agent configuration.')
}

void main()
