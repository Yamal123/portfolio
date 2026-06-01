export type SiteLanguage = 'zh' | 'en'

export type NavDestination =
  | { type: 'scroll'; targetId: string }
  | { type: 'link'; href: string }

export interface SiteNavItem {
  id: 'home' | 'portfolio' | 'blog' | 'industry' | 'about'
  href: string
  sectionId: string
  labels: Record<SiteLanguage, string>
}

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  {
    id: 'home',
    href: '/',
    sectionId: 'home',
    labels: { zh: '首页', en: 'Home' },
  },
  {
    id: 'portfolio',
    href: '/portfolio',
    sectionId: 'portfolio',
    labels: { zh: '作品集', en: 'Portfolio' },
  },
  {
    id: 'blog',
    href: '/blog',
    sectionId: 'blog',
    labels: { zh: '方法论', en: 'Methodology' },
  },
  {
    id: 'industry',
    href: '/industry',
    sectionId: 'industry',
    labels: { zh: '行业动态', en: 'Industry' },
  },
  {
    id: 'about',
    href: '/#about',
    sectionId: 'about',
    labels: { zh: '关于我', en: 'About' },
  },
]

export function getNavLabel(item: SiteNavItem, language: SiteLanguage) {
  return item.labels[language]
}

export function getNavDestination(item: SiteNavItem, isHomePage: boolean): NavDestination {
  if (isHomePage) {
    return { type: 'scroll', targetId: item.sectionId }
  }

  return { type: 'link', href: item.href }
}
