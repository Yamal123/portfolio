import axios from 'axios'
import { message } from 'antd'
import { API_BASE_URL, StatusCode } from './constants'
import type { ApiResponse } from '@/types/admin'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === StatusCode.UNAUTHORIZED) {
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
      message.error('网络连接失败，请稍后重试')
    } else {
      message.error(error.message || '未知错误')
    }
    return Promise.reject(error)
  }
)

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
