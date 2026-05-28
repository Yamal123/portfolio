'use client'

import { SafeMarkdown } from '@/components/safe-markdown'

export function ArticleMarkdown({ content }: { content: string; theme: string }) {
  return <SafeMarkdown>{content}</SafeMarkdown>
}
