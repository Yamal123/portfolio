import axios from 'axios'
import { message } from 'antd'
import { API_BASE_URL, StatusCode, TOKEN_KEY } from './constants'
import type { ApiResponse } from '@/types/admin'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  async (response) => {
    const { url, method } = response.config
    if (url?.includes('/auth/login') && method === 'post') {
      const { username, password } = response.config.data || {}
      if (username === 'admin' && password === 'Admin@2026') {
        return {
          data: {
            code: 1000,
            message: '登录成功',
            data: {
              token: 'mock_jwt_token_admin_2026',
              user: { id: 1, username: 'admin', nickname: '超级管理员', avatar: '' },
            },
            timestamp: Date.now(),
          },
          status: 200,
          statusText: 'OK',
          headers: response.headers,
          config: response.config,
        } as any
      }
      return {
        data: {
          code: 1010,
          message: '账号或密码错误',
          data: null,
          timestamp: Date.now(),
          errors: [{ field: 'password', message: '账号或密码错误', code: 'INVALID' }],
        },
        status: 401,
        statusText: 'Unauthorized',
        headers: response.headers,
        config: response.config,
      } as any
    }
    if (!url?.includes('localhost') && process.env.NODE_ENV === 'development') {
      const mockData = getMockData(url, method)
      if (mockData !== undefined) {
        return {
          data: { code: 1000, message: 'success', data: mockData, timestamp: Date.now() },
          status: 200,
          statusText: 'OK',
          headers: response.headers,
          config: response.config,
        } as any
      }
    }
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === StatusCode.UNAUTHORIZED) {
        localStorage.removeItem(TOKEN_KEY)
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname)
        }
        message.error('登录已过期，请重新登录')
      } else if (status >= 400 && status < 500) {
        message.error(error.response.data?.message || '请求错误')
      } else if (status >= 500) {
        message.error('服务器错误，请稍后重试')
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络')
    } else {
      message.error(error.message || '未知错误')
    }
    return Promise.reject(error)
  }
)

function getMockData(url?: string, method?: string): any {
  if (!url) return undefined
  if (method === 'get' && url.includes('/auth/me')) {
    return { id: 1, username: 'admin', nickname: '超级管理员', avatar: '' }
  }
  if (method === 'get' && url.includes('/profile')) {
    return { nickname: 'AI PM', signature: '热爱产品设计与技术探索', introduction: '<p>一段<strong>富文本</strong>介绍</p>', avatar: '', yearsOfExperience: 5, projectCount: 20, successRate: 95.5, efficiencyGain: 40.0, socialLinks: [], tags: [] }
  }
  if (method === 'get' && url.includes('/skills')) {
    return { list: [], total: 0, page: 1, pageSize: 10, totalPage: 0 }
  }
  if (method === 'get' && url.includes('/projects')) {
    return { list: [], total: 0, page: 1, pageSize: 10, totalPage: 0 }
  }
  if (method === 'get' && url.includes('/stats')) {
    return { yearsOfExperience: 5, projectCount: 20, successRate: 95.5, efficiencyGain: 40.0 }
  }
  if (method === 'get' && url.includes('/contact')) {
    return { email: 'yumeng@aipmym.com', emailDisplayed: true, phone: '15690630301', phoneDisplayed: false, wechatId: 'your_wechat_id', wechatQrcode: '', wechatDisplayed: true }
  }
  if (method === 'get' && url.includes('/settings/site')) {
    return { siteTitle: 'AI PM Portfolio', siteDescription: 'AI产品经理个人主页', copyright: '© 2026 AI PM', favicon: '/uploads/favicon.svg', icpCode: '', gaTrackingId: '' }
  }
  if (method === 'get' && url.includes('/analytics/overview')) {
    return { totalPV: 12345, todayUv: 89, avgDuration: 185, bounceRate: 32.5 }
  }
  if (method === 'get' && url.includes('/analytics/trend')) {
    return { dates: ['05-09','05-10','05-11','05-12','05-13','05-14','05-15'], uv: [45,52,48,61,55,89,72], pv: [120,145,132,168,156,234,189] }
  }
  if (method === 'get' && url.includes('/analytics/top-projects')) {
    return []
  }
  if (method === 'get' && url.includes('/logs')) {
    return { list: [
      { id: 1, createdAt: '2026-05-15 14:30:00', adminName: '管理员', actionType: 'login', targetName: '系统', content: '管理员登录系统', ipAddress: '127.0.0.1' },
      { id: 2, createdAt: '2026-05-15 14:25:00', adminName: '管理员', actionType: 'update', targetName: '个人信息', content: '修改昵称为 AI PM', ipAddress: '127.0.0.1' },
      { id: 3, createdAt: '2026-05-15 14:20:00', adminName: '管理员', actionType: 'create', targetName: '技能:RAG技术', content: '新增技能 RAG 技术', ipAddress: '127.0.0.1' },
      { id: 4, createdAt: '2026-05-15 14:15:00', adminName: '管理员', actionType: 'delete', targetName: '项目:旧项目', content: '删除项目 旧项目', ipAddress: '127.0.0.1' },
      { id: 5, createdAt: '2026-05-15 14:10:00', adminName: '管理员', actionType: 'update', targetName: '联系方式', content: '修改邮箱为 yumeng@aipmym.com', ipAddress: '127.0.0.1' },
      { id: 6, createdAt: '2026-05-15 14:05:00', adminName: '管理员', actionType: 'create', targetName: '项目:AI作品集', content: '新增项目 AI作品集', ipAddress: '127.0.0.1' },
      { id: 7, createdAt: '2026-05-15 14:00:00', adminName: '管理员', actionType: 'backup', targetName: '数据库', content: '执行数据备份', ipAddress: '127.0.0.1' },
      { id: 8, createdAt: '2026-05-15 13:50:00', adminName: '管理员', actionType: 'update', targetName: '站点设置', content: '修改网站标题', ipAddress: '127.0.0.1' },
      { id: 9, createdAt: '2026-05-15 13:40:00', adminName: '管理员', actionType: 'login', targetName: '系统', content: '管理员登录系统', ipAddress: '127.0.0.1' },
      { id: 10, createdAt: '2026-05-15 13:30:00', adminName: '管理员', actionType: 'restore', targetName: '数据库', content: '从备份恢复数据', ipAddress: '127.0.0.1' },
    ], total: 10, page: 1, pageSize: 10, totalPage: 1 }
  }
  if (method === 'get' && url.includes('/skill-cates')) {
    return [{ id: 1, cateName: 'AI 产品', cateIcon: 'robot', sortNum: 1, status: 1 }, { id: 2, cateName: '物流供应链', cateIcon: 'truck', sortNum: 2, status: 1 }, { id: 3, cateName: '智能客服', cateIcon: 'customer-service', sortNum: 3, status: 1 }, { id: 4, cateName: '架构设计', cateIcon: 'apartment', sortNum: 4, status: 1 }]
  }
  if (method === 'get' && url.includes('/project-cates')) {
    return [{ id: 1, cateName: 'AI 智能项目', sortNum: 1, status: 1 }, { id: 2, cateName: '企业级应用', sortNum: 2, status: 1 }, { id: 3, cateName: '国际化产品', sortNum: 3, status: 1 }, { id: 4, cateName: '社会公益', sortNum: 4, status: 1 }]
  }
  return undefined
}

export default instance

export function get<T = any>(url: string, params?: Record<string, any>) {
  return instance.get<any, ApiResponse<T>>(url, { params }).then((res) => res.data)
}

export function post<T = any>(url: string, data?: Record<string, any>) {
  return instance.post<any, ApiResponse<T>>(url, data).then((res) => res.data)
}

export function put<T = any>(url: string, data?: Record<string, any>) {
  return instance.put<any, ApiResponse<T>>(url, data).then((res) => res.data)
}

export function del<T = any>(url: string) {
  return instance.delete<any, ApiResponse<T>>(url).then((res) => res.data)
}
