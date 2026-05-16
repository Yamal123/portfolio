export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
}

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE = 1

export const TOKEN_KEY = 'admin_token'

export const MENU_ITEMS = [
  { key: 'dashboard', label: '仪表盘', icon: 'DashboardOutlined', path: '/admin/dashboard' },
  { key: 'profile', label: '个人主页信息', icon: 'UserOutlined', path: '/admin/profile' },
  { key: 'skills', label: '专业技能', icon: 'ThunderboltOutlined', path: '/admin/skills' },
  { key: 'projects', label: '项目案例', icon: 'ProjectOutlined', path: '/admin/projects' },
  { key: 'stats', label: '履历数据', icon: 'CalendarOutlined', path: '/admin/stats' },
  { key: 'contact', label: '联系方式', icon: 'PhoneOutlined', path: '/admin/contact' },
  { key: 'settings', label: '系统设置', icon: 'SettingOutlined', path: '/admin/settings' },
  { key: 'analytics', label: '数据统计', icon: 'BarChartOutlined', path: '/admin/analytics' },
] as const

export const SKILL_CATEGORIES = ['前端开发', '后端开发', 'DevOps', '数据库', '工具软件'] as const

export const PROJECT_TAGS = ['React', 'Vue', 'Node.js', 'Python', 'TypeScript', 'Next.js', '其他'] as const
