import { describe, expect, it } from 'vitest'
import {
  SITE_NAV_ITEMS,
  getNavDestination,
  getNavLabel,
} from '@/lib/site-navigation'

describe('site navigation', () => {
  it('keeps the same menu order across the site', () => {
    expect(SITE_NAV_ITEMS.map((item) => item.id)).toEqual([
      'home',
      'portfolio',
      'blog',
      'industry',
      'about',
    ])
  })

  it('renders consistent labels for zh and en', () => {
    expect(SITE_NAV_ITEMS.map((item) => getNavLabel(item, 'zh'))).toEqual([
      '首页',
      '作品集',
      '方法论',
      '行业动态',
      '关于我',
    ])
    expect(SITE_NAV_ITEMS.map((item) => getNavLabel(item, 'en'))).toEqual([
      'Home',
      'Portfolio',
      'Methodology',
      'Industry',
      'About',
    ])
  })

  it('uses scroll targets on the home page and routes on subpages', () => {
    const homeNav = getNavDestination(SITE_NAV_ITEMS[1], true)
    const subpageNav = getNavDestination(SITE_NAV_ITEMS[1], false)

    expect(homeNav).toEqual({ type: 'scroll', targetId: 'portfolio' })
    expect(subpageNav).toEqual({ type: 'link', href: '/portfolio' })
  })
})
