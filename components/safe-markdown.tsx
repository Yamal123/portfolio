'use client'

import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type ThemeMode = 'dark' | 'light'

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

function getMarkdownTheme(theme: ThemeMode) {
  return {
    pageText: theme === 'dark' ? 'text-gray-300' : 'text-gray-800',
    heading: theme === 'dark' ? 'text-white' : 'text-gray-950',
    subtle: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    border: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
    surface: theme === 'dark' ? 'bg-gray-950/60' : 'bg-gray-50',
    codeInline: theme === 'dark' ? 'bg-gray-900 text-orange-300 border border-gray-800' : 'bg-orange-50 text-orange-700 border border-orange-100',
    codeBlock: theme === 'dark' ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-gray-50 text-gray-800 border-gray-200',
    quote: theme === 'dark' ? 'border-orange-500 bg-orange-500/10 text-gray-200' : 'border-orange-500 bg-orange-50 text-gray-700',
    link: theme === 'dark' ? 'text-orange-300 hover:text-orange-200' : 'text-orange-600 hover:text-orange-700',
  }
}

export function SafeMarkdown({
  children,
  compact = false,
  theme = 'light',
}: {
  children: string
  compact?: boolean
  theme?: ThemeMode
}) {
  const styles = getMarkdownTheme(theme)

  return (
    <div className={compact ? 'space-y-3 break-words text-sm leading-6' : 'space-y-5 break-words text-[15px] leading-8 sm:text-[16px]'}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a({ href, children: label }) {
            const url = safeHref(href)
            if (!url) return <span>{label}</span>
            const external = !url.startsWith('/') && !url.startsWith('#')
            return (
              <a
                href={url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={`font-medium underline underline-offset-4 decoration-1 transition-colors ${styles.link}`}
              >
                {label}
              </a>
            )
          },
          p({ children: value }) {
            return <p className={compact ? 'my-1 whitespace-pre-wrap' : `my-0 ${styles.pageText}`}>{value}</p>
          },
          h1({ children: value }) {
            return <h1 className={`mb-3 mt-8 text-3xl font-bold tracking-tight ${styles.heading}`}>{value}</h1>
          },
          h2({ children: value }) {
            return <h2 className={`mb-3 mt-7 text-2xl font-semibold tracking-tight ${styles.heading}`}>{value}</h2>
          },
          h3({ children: value }) {
            return <h3 className={`mb-2 mt-6 text-xl font-semibold ${styles.heading}`}>{value}</h3>
          },
          h4({ children: value }) {
            return <h4 className={`mb-2 mt-5 text-lg font-semibold ${styles.heading}`}>{value}</h4>
          },
          strong({ children: value }) {
            return <strong className={theme === 'dark' ? 'font-semibold text-white' : 'font-semibold text-gray-950'}>{value}</strong>
          },
          em({ children: value }) {
            return <em className="italic">{value}</em>
          },
          ul({ children: value }) {
            return <ul className="my-3 ml-5 list-disc space-y-2 marker:text-orange-500">{value}</ul>
          },
          ol({ children: value }) {
            return <ol className="my-3 ml-5 list-decimal space-y-2 marker:text-orange-500">{value}</ol>
          },
          li({ children: value }) {
            return <li className="pl-1 leading-7">{value}</li>
          },
          blockquote({ children: value }) {
            return (
              <blockquote className={`my-5 rounded-r-2xl border-l-4 px-4 py-3 italic ${styles.quote}`}>
                {value}
              </blockquote>
            )
          },
          code({ className, children: value }) {
            const isBlock = Boolean(className?.includes('language-'))
            if (isBlock) {
              return (
                <code className={`block overflow-x-auto rounded-2xl border px-4 py-3 font-mono text-[13px] leading-7 ${styles.codeBlock}`}>
                  {value}
                </code>
              )
            }
            return (
              <code className={`rounded-md px-1.5 py-0.5 font-mono text-[0.9em] ${styles.codeInline}`}>
                {value}
              </code>
            )
          },
          pre({ children: value }) {
            return <div className="my-5 overflow-x-auto">{value}</div>
          },
          table({ children: value }) {
            return (
              <div className={`my-6 overflow-x-auto rounded-2xl border ${styles.border} ${styles.surface}`}>
                <table className="w-full border-collapse text-sm">{value}</table>
              </div>
            )
          },
          thead({ children: value }) {
            return <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>{value}</thead>
          },
          th({ children: value }) {
            return <th className={`border-b px-4 py-3 text-left font-semibold ${styles.border}`}>{value}</th>
          },
          td({ children: value }) {
            return <td className={`border-b px-4 py-3 align-top ${styles.border}`}>{value}</td>
          },
          hr() {
            return <hr className={`my-8 border-t ${styles.border}`} />
          },
          img({ src, alt }) {
            const safe = safeHref(typeof src === 'string' ? src : undefined)
            return safe ? (
              <img
                src={safe}
                alt={alt || ''}
                className={`my-6 h-auto w-full rounded-2xl border shadow-lg ${styles.border}`}
              />
            ) : null
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export function MarkdownText({ children }: { children?: ReactNode }) {
  return <>{children}</>
}
