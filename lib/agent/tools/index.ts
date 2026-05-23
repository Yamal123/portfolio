import type { AgentTool } from '../types'
import { searchProjectsTool } from './search-projects'
import { listSkillsTool } from './list-skills'
import { searchArticlesTool } from './search-articles'
import { getContactTool } from './get-contact'
import { getSiteInfoTool } from './get-site-info'

export const agentTools: AgentTool[] = [
  searchProjectsTool,
  listSkillsTool,
  searchArticlesTool,
  getContactTool,
  getSiteInfoTool,
]

export const agentToolsByName = Object.fromEntries(
  agentTools.map((t) => [t.name, t])
) as Record<string, AgentTool>
