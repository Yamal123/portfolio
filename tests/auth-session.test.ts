import { describe, expect, it, vi } from 'vitest'
import {
  TOKEN_EXPIRY,
  createSession,
  getRequestFingerprint,
  getSessionFromRequest,
  verifySession,
} from '@/lib/auth'

describe('auth session token', () => {
  it('creates and verifies a valid session', () => {
    const token = createSession({ username: 'admin', id: 1, sessionVersion: 2, fingerprint: 'browser-fingerprint' })
    const parsed = verifySession(token, 'browser-fingerprint')
    expect(parsed).toEqual(expect.objectContaining({ username: 'admin', id: 1, sessionVersion: 2, fingerprint: 'browser-fingerprint' }))
  })

  it('rejects tampered session', () => {
    const token = createSession({ username: 'admin', id: 1, sessionVersion: 2, fingerprint: 'browser-fingerprint' })
    expect(verifySession(`${token}x`, 'browser-fingerprint')).toBeNull()
  })

  it('rejects expired session', () => {
    const nowSpy = vi.spyOn(Date, 'now')
    nowSpy.mockReturnValue(1_000)
    const token = createSession({ username: 'admin', id: 1, sessionVersion: 2, fingerprint: 'browser-fingerprint' })
    nowSpy.mockReturnValue(1_000 + TOKEN_EXPIRY + 1)
    expect(verifySession(token, 'browser-fingerprint')).toBeNull()
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

describe('request fingerprint', () => {
  it('stays stable when only forwarded-for changes', () => {
    const commonHeaders = {
      'user-agent': 'Mozilla/5.0',
      'accept-language': 'zh-CN,zh;q=0.9',
    }

    const first = new Request('http://localhost/api', {
      headers: { ...commonHeaders, 'x-forwarded-for': '127.0.0.1' },
    })
    const second = new Request('http://localhost/api', {
      headers: { ...commonHeaders, 'x-forwarded-for': '10.0.0.8' },
    })

    expect(getRequestFingerprint(first)).toBe(getRequestFingerprint(second))
  })
})
