import { beforeEach, describe, expect, it, vi } from 'vitest'
import { runRulesAgent } from '@/lib/agent/rules'
import { executeTool } from '@/lib/agent/executor'

vi.mock('@/lib/agent/executor', () => ({
  executeTool: vi.fn(),
}))

const mockedExecuteTool = vi.mocked(executeTool)

describe('rules agent routing', () => {
  beforeEach(() => {
    mockedExecuteTool.mockReset()
  })

  it('prioritizes project tool intent over faq keyword match', async () => {
    mockedExecuteTool.mockResolvedValueOnce({
      data: {
        total: 1,
        items: [{ id: 1, name: 'AI Agent', type: 'AI', intro: 'desc', tags: ['ai'], url: '/portfolio/ai-agent' }],
      },
    } as never)

    const result = await runRulesAgent({ message: '有哪些项目作品？', locale: 'zh' })
    expect(mockedExecuteTool).toHaveBeenCalledWith(
      'search_projects',
      expect.objectContaining({ limit: 5 }),
    )
    expect(result.type).toBe('project')
    expect(result.toolsUsed).toContain('search_projects')
  })

  it('returns contact data through tool', async () => {
    mockedExecuteTool.mockResolvedValueOnce({
      data: {
        email: 'hi@example.com',
        links: [{ label: 'GitHub', url: 'https://github.com/example' }],
      },
    } as never)

    const result = await runRulesAgent({ message: '怎么联系作者', locale: 'zh' })
    expect(mockedExecuteTool).toHaveBeenCalledWith('get_contact_info')
    expect(result.content).toContain('hi@example.com')
    expect(result.toolsUsed).toContain('get_contact_info')
  })
})
