export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
}

export interface PaginatedResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPage: number
}

export interface User {
  id: number
  username: string
  nickname: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface SkillCate {
  id: number
  cate_name: string
  cate_icon?: string
  sort_num: number
}

export interface Skill {
  id: number
  name: string
  level: number
  cate_id: number
  description?: string
  tags?: string
  icon_url?: string
  sort_num: number
  status: number
  created_at: string
  updated_at: string
}

export interface ProjectCate {
  id: number
  cate_name: string
  sort_num: number
}

export interface Project {
  id: number
  slug: string
  name_zh: string
  name_en: string
  thumbnail?: string
  content_zh: string
  content_en: string
  tags: string
  external_url?: string
  view_count: number
  cate_id: number
  status: number
  sort_num: number
  deleted_at?: string | null
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: number
  nickname: string
  avatar?: string
  signature?: string
  introduction?: string
  years_of_experience?: number
  project_count?: number
  success_rate?: number
  location?: string
  website?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  created_at: string
  updated_at: string
}

export interface ContactInfo {
  id: number
  email: string
  email_displayed: boolean
  phone: string
  phone_displayed: boolean
  wechat_id: string
  wechat_displayed: boolean
  wechat_qrcode?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  created_at: string
  updated_at: string
}

export interface SiteConfig {
  config_key: string
  config_value: string
  description?: string
  type?: string
  created_at: string
  updated_at: string
}

export interface SiteSettingsData {
  site_title: string
  site_description: string
  copyright: string
  favicon: string
  icp_number: string
  ga_id: string
}

export interface StatsData {
  project_count: number
  total_skills: number
  years_of_experience: number
  success_rate: number
  completed_projects: number
  client_satisfaction: number
}

export interface OperationLog {
  id: number
  admin_id: number
  admin_name: string
  action_type: 'login' | 'create' | 'update' | 'delete' | 'backup' | 'restore'
  target_module: string
  target_id?: number
  content: string | Record<string, any>
  ip_address: string
  user_agent?: string
  created_at: string
}

export interface AnalyticsOverview {
  today_uv: number
  today_pv: number
  total_uv: number
  total_pv: number
  avg_duration: number
  bounce_rate: number
}

export interface AnalyticsTrendItem {
  date: string
  uv: number
  pv: number
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userInfo: User
}
