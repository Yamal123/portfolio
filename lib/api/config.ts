const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.yumeng.dev'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
}

export const API_CONFIG = {
  baseUrl: getApiUrl(),
  adminBaseUrl: getApiUrl(),
  timeout: 10000,
}

export const TOKEN_KEY = 'admin_token'
