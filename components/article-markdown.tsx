'use client'

import { SafeMarkdown } from '@/components/safe-markdown'

export function ArticleMarkdown({ content, theme }: { content: string; theme: 'dark' | 'light' }) {
  return <SafeMarkdown theme={theme}>{content}</SafeMarkdown>
}
