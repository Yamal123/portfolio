export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'admin' | 'editor'
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon?: string
  description?: string
  sortOrder: number
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  coverImage?: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
  techStack: string[]
  sortOrder: number
  isVisible: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: string
  title: string
  content: string
  summary?: string
  coverImage?: string
  tags: string[]
  category: string
  status: 'draft' | 'published'
  viewCount: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ContactInfo {
  id: string
  type: 'email' | 'phone' | 'wechat' | 'github' | 'linkedin' | 'other'
  label: string
  value: string
  icon?: string
  url?: string
  sortOrder: number
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  id: string
  siteName: string
  siteDescription?: string
  siteLogo?: string
  favicon?: string
  seoKeywords?: string
  seoDescription?: string
  themeColor?: string
  analyticsId?: string
  updatedAt: string
}

export interface OperationLog {
  id: string
  userId: string
  username: string
  action: string
  module: string
  targetId?: string
  detail?: string
  ip?: string
  userAgent?: string
  createdAt: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: User
}

export interface DashboardStats {
  totalProjects: number
  totalSkills: number
  totalArticles: number
  totalViews: number
  recentLogs: OperationLog[]
  projectTrend: { date: string; count: number }[]
  categoryDistribution: { name: string; value: number }[]
}
