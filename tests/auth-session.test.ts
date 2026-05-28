import { describe, expect, it, vi } from 'vitest'
import { createSession, getSessionFromRequest, verifySession } from '@/lib/auth'

describe('auth session token', () => {
  it('creates and verifies a valid session', () => {
    const token = createSession({ username: 'admin', id: 1 })
    const parsed = verifySession(token)
    expect(parsed).toEqual({ username: 'admin', id: 1 })
  })

  it('rejects tampered session', () => {
    const token = createSession({ username: 'admin', id: 1 })
    expect(verifySession(`${token}x`)).toBeNull()
  })

  it('rejects expired session', () => {
    const nowSpy = vi.spyOn(Date, 'now')
    nowSpy.mockReturnValue(1_000)
    const token = createSession({ username: 'admin', id: 1 })
    nowSpy.mockReturnValue(1_000 + 2 * 60 * 60 * 1000 + 1)
    expect(verifySession(token)).toBeNull()
    nowSpy.mockRestore()
  })
})

describe('auth cookie parsing', () => {
  it('reads session cookie from request headers', () => {
    const request = new Request('http://localhost/api', {
      headers: { cookie: 'a=b; admin_session=token123; c=d' },
    })
    expect(getSessionFromRequest(request)).toBe('token123')
  })
})
