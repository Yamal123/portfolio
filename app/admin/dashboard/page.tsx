'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Briefcase, BookOpen, Bot, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: '个人信息', desc: '管理简历、技能、联系方式', icon: User, path: '/admin/profile', color: 'from-blue-500 to-blue-600' },
  { label: '作品集', desc: '管理项目和案例内容', icon: Briefcase, path: '/admin/portfolio', color: 'from-orange-500 to-orange-600' },
  { label: '方法论', desc: '管理文章和博客内容', icon: BookOpen, path: '/admin/articles', color: 'from-green-500 to-emerald-600' },
  { label: 'Agent', desc: '管理AI助手配置和工具', icon: Bot, path: '/admin/agent', color: 'from-purple-500 to-violet-600' },
]

function DashboardContent() {
  return (
    <AdminLayout title="管理总览">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((item, i) => {
          const Icon = item.icon
          return (
            <Link key={i} href={item.path}>
              <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{item.label}</h3>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </AdminLayout>
  )
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>
}
