import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { ChatbotWrapper } from "@/components/chatbot"
import { VisitTracker } from "@/components/VisitTracker"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "PM 思钱想厚",
  description:
    "余猛的个人品牌网站 - AI产品经理，专注于将AI技术转化为实际业务价值",
  keywords: [
    "余猛",
    "AI产品经理",
    "PM",
    "AI",
    "产品经理",
    "人工智能",
    "AI助手",
    "Dify",
    "LLM",
    "RAG",
  ],
  authors: [{ name: "余猛" }],
  creator: "余猛",
  publisher: "余猛",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh-CN",
    alternateLocale: "en_US",
    url: "https://yumeng.dev",
    siteName: "PM 思钱想厚",
    title: "PM 思钱想厚",
    description:
      "余猛的个人品牌网站 - AI产品经理，专注于将AI技术转化为实际业务价值",
    images: [
      {
        url: "/images/profile-avatar.png",
        width: 1200,
        height: 630,
        alt: "PM 思钱想厚 - 余猛个人品牌网站",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PM 思钱想厚",
    description:
      "余猛的个人品牌网站 - AI产品经理，专注于将AI技术转化为实际业务价值",
    creator: "@yumeng",
    images: ["/images/profile-avatar.png"],
  },
  alternates: {
    canonical: "https://yumeng.dev",
    languages: {
      "zh-CN": "https://yumeng.dev",
      "en-US": "https://yumeng.dev/en",
    },
  },
  generator: "Next.js",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} antialiased`}>
      <head>
        <link rel="preload" href="/images/portfolioimage.png" as="image" type="image/png" />
        <link rel="preload" href="/images/profile.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/images/background.jpg" as="image" type="image/jpeg" />
        <link rel="dns-prefetch" href="https://medium.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (typeof window === 'undefined') return;
                var key = '__css_recover_once__';
                function hasCoreStylesheet() {
                  try {
                    return Array.from(document.styleSheets).some(function (sheet) {
                      var href = sheet && sheet.href ? String(sheet.href) : '';
                      return href.indexOf('/_next/static/css/app/layout.css') !== -1;
                    });
                  } catch (_error) {
                    return false;
                  }
                }
                window.addEventListener('load', function () {
                  setTimeout(function () {
                    if (hasCoreStylesheet()) {
                      sessionStorage.removeItem(key);
                      return;
                    }
                    if (sessionStorage.getItem(key) === '1') return;
                    sessionStorage.setItem(key, '1');
                    var url = new URL(window.location.href);
                    url.searchParams.set('_css_reload', String(Date.now()));
                    window.location.replace(url.toString());
                  }, 250);
                });
              })();
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://yumeng.dev/#person",
                  name: "Yu Meng",
                  alternateName: "余猛",
                  description:
                    "AI产品经理，专注于将AI技术转化为实际业务价值",
                  jobTitle: ["AI Product Manager", "Product Designer"],
                  url: "https://yumeng.dev",
                  image: "https://yumeng.dev/images/profile-avatar.png",
                  knowsAbout: [
                    "AI",
                    "LLM",
                    "RAG",
                    "AI Agent",
                    "Product Design",
                    "Cross-border Supply Chain",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://yumeng.dev/#website",
                  url: "https://yumeng.dev",
                  name: "PM 思钱想厚",
                  description: "余猛的个人品牌网站",
                  publisher: {
                    "@id": "https://yumeng.dev/#person",
                  },
                  inLanguage: ["zh-CN", "en-US"],
                },
              ],
            }),
          }}
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </head>
      <body className={spaceGrotesk.className}>
        <ThemeProvider>
          <LanguageProvider>
            <VisitTracker />
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <ChatbotWrapper />
      </body>
    </html>
  )
}
