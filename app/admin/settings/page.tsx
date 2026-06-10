'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { passwordPolicyError } from '@/lib/auth'

function SettingsContent() {
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('请完整填写密码信息')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的新密码不一致')
      return
    }
    const policyError = passwordPolicyError(newPassword)
    if (policyError) {
      toast.error(policyError)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || '修改失败')
        return
      }
      toast.success(data.message || '密码已修改')
      router.push('/admin/login')
    } catch {
      toast.error('网络连接失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="系统设置">
      <div className="h-full overflow-y-auto p-4">
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2 font-medium text-slate-950">
            <Lock className="h-4 w-4 text-orange-500" />
            修改密码
          </div>
          <p className="mt-2 leading-6">
            新密码至少 8 位，并且需要在数字、小写字母、大写字母、特殊字符中至少满足 3 类。修改成功后会自动退出并要求重新登录。
          </p>
        </div>

        <form onSubmit={submit} className="max-w-xl space-y-4 rounded-lg border border-slate-200 bg-white p-5">
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            <span>旧密码</span>
            <Input type="password" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} disabled={loading} />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            <span>新密码</span>
            <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} disabled={loading} />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            <span>确认新密码</span>
            <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={loading} />
          </label>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存修改
          </Button>
        </form>
      </div>
    </AdminLayout>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}
