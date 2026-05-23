import { API_CONFIG } from './config'

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${path}`
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, API_CONFIG.timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    const result = await response.json()
    if (result.code !== 1000) {
      throw new Error(result.message || 'API Error')
    }
    
    return result.data as T
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    console.error('Fetch API error:', error)
    throw error
  }
}

export async function publicFetcher<T>(url: string): Promise<T> {
  return fetchAPI<T>(url)
}
