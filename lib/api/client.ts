const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    const result = await response.json()
    if (result.code !== 1000) {
      throw new Error(result.message || 'API Error')
    }
    
    return result.data as T
  } catch (error) {
    console.error('Fetch API error:', error)
    throw error
  }
}
