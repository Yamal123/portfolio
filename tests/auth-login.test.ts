import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/auth/login/route'

describe('admin login route', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('allows the fixed admin account in production without external login env vars', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ADMIN_USERNAME', '')
    vi.stubEnv('ADMIN_PASSWORD', '')
    vi.stubEnv('ADMIN_SESSION_SECRET', '')
    vi.stubEnv('ADMIN_JWT_SECRET', '')

    const response = await POST(new Request('https://www.aipmym.com/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'Admin@2026' }),
    }))

    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body).toMatchObject({ code: 0, message: '登录成功' })
    expect(response.headers.get('set-cookie')).toContain('admin_session=')
  })

  it('rejects the wrong fixed admin password', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ADMIN_USERNAME', '')
    vi.stubEnv('ADMIN_PASSWORD', '')

    const response = await POST(new Request('https://www.aipmym.com/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'wrong-password' }),
    }))

    expect(response.status).toBe(401)
  })
})
