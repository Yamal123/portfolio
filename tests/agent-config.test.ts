import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/content/repository', () => ({
  getAgentConfig: vi.fn(),
}))

import { getAgentConfig } from '@/lib/content/repository'
import { getRuntimeAgentConfig, resolveAgentMode } from '@/lib/agent/config'

const mockedGetAgentConfig = vi.mocked(getAgentConfig)

describe('agent runtime config', () => {
  beforeEach(() => {
    mockedGetAgentConfig.mockReset()
    vi.unstubAllEnvs()
  })

  it('falls back to a default rules config when stored config is missing', async () => {
    mockedGetAgentConfig.mockResolvedValueOnce(null as never)

    const config = await getRuntimeAgentConfig()

    expect(config.mode).toBe('rules')
    expect(config.apiKeyConfigured).toBe(false)
    expect(config.welcomeMessage.zh).toContain('智能助手')
    expect(config.quickQuestions.length).toBeGreaterThan(0)
  })

  it('resolves rules mode when only fallback config is available', async () => {
    mockedGetAgentConfig.mockResolvedValueOnce(null as never)

    await expect(resolveAgentMode()).resolves.toBe('rules')
  })
})
