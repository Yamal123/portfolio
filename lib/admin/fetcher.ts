import { API_CONFIG, TOKEN_KEY } from '@/lib/api/config'
import type { ApiResponse } from '@/types/admin'

export async function fetcher<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, API_CONFIG.timeout)

  try {
    const response = await fetch(`${API_CONFIG.adminBaseUrl}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)

    const data: ApiResponse<T> = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY)
          window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname)
        }
      }
      throw new Error(data.message || '请求失败')
    }

    return data.data
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

export async function post<T = any>(url: string, data?: any): Promise<T> {
  return fetcher<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function put<T = any>(url: string, data?: any): Promise<T> {
  return fetcher<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function del<T = any>(url: string): Promise<T> {
  return fetcher<T>(url, {
    method: 'DELETE',
  })
}
