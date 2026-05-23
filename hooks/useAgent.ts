'use client'

import { useState, useCallback } from 'react'
import { callAgentChat } from '@/lib/agent/client'
import type { AgentHistoryMessage, AgentRunOutput } from '@/lib/agent/types'

export function useAgent(locale: 'zh' | 'en' = 'zh') {
  const [isLoading, setIsLoading] = useState(false)
  const [lastResponse, setLastResponse] = useState<AgentRunOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (message: string, history?: AgentHistoryMessage[]) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await callAgentChat({ message, history, locale })
        setLastResponse(result)
        return result
      } catch (err) {
        const msg = err instanceof Error ? err.message : '请求失败'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [locale]
  )

  return {
    sendMessage,
    isLoading,
    lastResponse,
    error,
  }
}
