import { join } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { generateDailyIndustryUpdate, pushIndustryUpdateToFeishu } from '../lib/industry/service'

loadEnv({ path: join(process.cwd(), '.env.local') })
loadEnv()

async function main() {
  const date = process.argv[2]
  const update = await generateDailyIndustryUpdate(date)
  console.log(`Generated industry update: ${update.slug}`)
  if (process.env.FEISHU_WEBHOOK_URL) {
    await pushIndustryUpdateToFeishu(update.slug)
    console.log('Pushed industry update to Feishu.')
  } else {
    console.log('Skipped Feishu push: FEISHU_WEBHOOK_URL is not configured.')
  }
}

void main()
