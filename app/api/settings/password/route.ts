import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkAuth } from '@/lib/auth/middleware'
import { passwordPolicyError, sessionCookie, hashAdminPassword, SESSION_COOKIE } from '@/lib/auth'
import { getSystemStore } from '@/lib/admin/system-store'

const passwordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmPassword: z.string().min(1),
})

export async function PUT(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth

  const parsed = passwordSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ code: 1001, message: '参数格式错误' }, { status: 400 })
  }

  const { oldPassword, newPassword, confirmPassword } = parsed.data
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ code: 1001, message: '两次输入的新密码不一致' }, { status: 400 })
  }
  const policyError = passwordPolicyError(newPassword)
  if (policyError) {
    return NextResponse.json({ code: 1001, message: policyError }, { status: 400 })
  }

  const store = getSystemStore()
  const user = store.getAdminUserById(auth.id)
  if (!user) {
    return NextResponse.json({ code: 1002, message: '未登录或登录已过期' }, { status: 401 })
  }
  if (hashAdminPassword(oldPassword, user.salt) !== user.password) {
    return NextResponse.json({ code: 1002, message: '旧密码不正确' }, { status: 401 })
  }
  if (hashAdminPassword(newPassword, user.salt) === user.password) {
    return NextResponse.json({ code: 1001, message: '新密码不能与旧密码相同' }, { status: 400 })
  }

  store.updateAdminPassword(user.id, newPassword)
  const response = NextResponse.json({ code: 0, message: '密码已修改，请重新登录' })
  response.cookies.set({ ...sessionCookie('', 0), name: SESSION_COOKIE })
  return response
}
