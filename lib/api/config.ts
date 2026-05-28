const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser, use relative paths to the same Vercel deployment
    return ''
  }
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || ''
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
}

export const API_CONFIG = {
  baseUrl: getApiUrl(),
  adminBaseUrl: getApiUrl(),
  timeout: 10000,
}
