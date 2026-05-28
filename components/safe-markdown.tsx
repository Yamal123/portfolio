'use client'

import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function safeHref(href?: string) {
  if (!href) return null
  if (href.startsWith('/') || href.startsWith('#')) return href
  try {
    const parsed = new URL(href)
    return ['https:', 'http:', 'mailto:'].includes(parsed.protocol) ? href : null
  } catch {
    return null
  }
}

export function SafeMarkdown({ children, compact = false }: { children: string; compact?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        a({ href, children: label }) {
          const url = safeHref(href)
          if (!url) return <span>{label}</span>
          const external = !url.startsWith('/') && !url.startsWith('#')
          return (
            <a href={url} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="text-orange-500 underline underline-offset-2">
              {label}
            </a>
          )
        },
        p({ children: value }) {
          return <p className={compact ? 'my-1 whitespace-pre-wrap' : 'my-3 leading-relaxed'}>{value}</p>
        },
        ul({ children: value }) { return <ul className="my-3 ml-5 list-disc space-y-1">{value}</ul> },
        ol({ children: value }) { return <ol className="my-3 ml-5 list-decimal space-y-1">{value}</ol> },
        blockquote({ children: value }) { return <blockquote className="my-4 border-l-4 border-orange-500 pl-4 italic">{value}</blockquote> },
        code({ className, children: value }) {
          return <code className={`${className || ''} rounded bg-gray-200 px-1 py-0.5 font-mono text-xs dark:bg-gray-800`}>{value}</code>
        },
        pre({ children: value }) {
          return <pre className="my-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">{value}</pre>
        },
        table({ children: value }) { return <div className="my-5 overflow-x-auto"><table className="w-full border-collapse text-sm">{value}</table></div> },
        th({ children: value }) { return <th className="border p-2 text-left font-semibold">{value}</th> },
        td({ children: value }) { return <td className="border p-2">{value}</td> },
        img({ src, alt }) {
          const safe = safeHref(typeof src === 'string' ? src : undefined)
          return safe ? <img src={safe} alt={alt || ''} className="my-6 h-auto w-full rounded-lg" /> : null
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export function MarkdownText({ children }: { children?: ReactNode }) {
  return <>{children}</>
}
