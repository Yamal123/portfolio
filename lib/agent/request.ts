import { z } from 'zod'

export const agentChatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000),
  })).max(10).optional().default([]),
  locale: z.enum(['zh', 'en']).optional().default('zh'),
}).superRefine((value, context) => {
  const total = value.history.reduce((sum, message) => sum + message.content.length, 0)
  if (total > 10000) context.addIssue({ code: z.ZodIssueCode.custom, message: '历史消息总长度过长', path: ['history'] })
})

const buckets = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

export function consumeAgentRequest(ip: string, now = Date.now()) {
  const current = buckets.get(ip)
  if (!current || current.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }
  if (current.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }
  current.count += 1
  return { allowed: true, retryAfter: 0 }
}

export function resetAgentRateLimits() {
  buckets.clear()
}
