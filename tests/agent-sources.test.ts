import { describe, expect, it } from 'vitest'
import { collectArticleSources } from '@/lib/agent/sources'

describe('collectArticleSources', () => {
  it('maps article search results into source notes', () => {
    expect(
      collectArticleSources([
        { title: 'A', url: '/blog/a', intro: 'intro a', date: '2026-01-01' },
      ])
    ).toEqual([
      { title: 'A', url: '/blog/a', intro: 'intro a', date: '2026-01-01' },
    ])
  })

  it('deduplicates repeated article URLs', () => {
    expect(
      collectArticleSources([
        { title: 'A', url: '/blog/a', intro: 'one' },
        { title: 'A again', url: '/blog/a', intro: 'two' },
      ])
    ).toEqual([{ title: 'A', url: '/blog/a', intro: 'one' }])
  })
})
