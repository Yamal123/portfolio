import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/contexts/theme-context"

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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://arturogrande.com/#person",
                  name: "Arturo Grande",
                  alternateName: "Artu Grande",
                  description:
                    "Vibecoder, product designer y growth strategist especializado en Web3, IA y sostenibilidad",
                  jobTitle: ["Vibecoder", "Growth Strategist", "Product Designer", "UX Designer"],
                  worksFor: [
                    {
                      "@type": "Organization",
                      "@id": "https://arturogrande.com/#eluter",
                      name: "Eluter",
                      url: "https://www.eluter.com/",
                      description: "Fintech company powering global payments for Latin American businesses",
                    },
                    {
                      "@type": "Organization",
                      "@id": "https://arturogrande.com/#desafia",
                      name: "DESAFIA",
                      url: "https://desafia.tech/",
                      description: "Program that helps entrepreneurs build and scale digital products globally",
                    },
                  ],
                  nationality: "Argentina",
                  birthPlace: "Salta, Argentina",
                  url: "https://arturogrande.com",
                  image: "https://arturogrande.com/images/profile.jpg",
                  sameAs: [
                    "https://www.linkedin.com/in/arturogrande/",
                    "https://medium.com/@infoarturogrande",
                    "https://twitter.com/artugrandey",
                    "https://www.instagram.com/artugrandey/",
                    "https://v0.app/user/artugrandey",
                  ],
                  knowsAbout: [
                    "Web3",
                    "Blockchain",
                    "AI",
                    "UX Design",
                    "Product Design",
                    "Growth Strategy",
                    "Sustainability",
                    "Digital Nomad",
                    "Fintech",
                    "Cryptocurrency",
                  ],
                  alumniOf: "AIESEC",
                  hasOccupation: {
                    "@type": "Occupation",
                    name: "Vibecoder & Growth Strategist",
                    description:
                      "Specializes in scaling digital products through UX design, Web3 integration, and AI implementation",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://arturogrande.com/#website",
                  url: "https://arturogrande.com",
                  name: "Artu Grande Portfolio",
                  description: "Portfolio profesional de Artu Grande - Vibecoder & Growth Strategist",
                  publisher: {
                    "@id": "https://arturogrande.com/#person",
                  },
                  inLanguage: ["es-AR", "en-US"],
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://arturogrande.com/?s={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://arturogrande.com/#eluter",
                  name: "Eluter",
                  url: "https://www.eluter.com/",
                  description: "Fintech company powering global payments for Latin American businesses",
                  employee: {
                    "@id": "https://arturogrande.com/#person",
                  },
                  industry: "Financial Technology",
                },
                {
                  "@type": "Organization",
                  "@id": "https://arturogrande.com/#desafia",
                  name: "DESAFIA",
                  url: "https://desafia.tech/",
                  description: "Program that helps entrepreneurs build and scale digital products globally",
                  founder: {
                    "@id": "https://arturogrande.com/#person",
                  },
                  industry: "Education Technology",
                },
                {
                  "@type": "ItemList",
                  "@id": "https://arturogrande.com/#portfolio",
                  name: "Product Design Portfolio",
                  description: "UX & Web3 case studies by Artu Grande",
                  numberOfItems: 14,
                  itemListElement: [
                    {
                      "@type": "CreativeWork",
                      name: "Trebly - Redefining Lotteries",
                      description: "UX design case study for blockchain lottery platform",
                      url: "https://medium.com/@infoarturogrande/trebly-redefining-lotteries-with-no-losses-27bfad6506ec",
                      creator: { "@id": "https://arturogrande.com/#person" },
                      about: ["UX Design", "Blockchain", "Fintech"],
                    },
                    {
                      "@type": "CreativeWork",
                      name: "Eluter - Global Payments Platform",
                      description: "Product design for Latin American fintech payments",
                      url: "https://medium.com/@infoarturogrande/eluter-powering-global-payments-for-latin-american-businesses-405c32462b8e",
                      creator: { "@id": "https://arturogrande.com/#person" },
                      about: ["Product Design", "Fintech", "Payments"],
                    },
                    {
                      "@type": "CreativeWork",
                      name: "BeTrusty - Property Rentals",
                      description: "UX design for blockchain property rental platform",
                      url: "https://medium.com/@infoarturogrande/how-betrusty-transforms-property-rentals-3503ddcb8e9c",
                      creator: { "@id": "https://arturogrande.com/#person" },
                      about: ["UX Design", "Real Estate", "Blockchain"],
                    },
                  ],
                },
                {
                  "@type": "Blog",
                  "@id": "https://arturogrande.com/#blog",
                  name: "Artu Grande Articles",
                  description: "Web3, AI & UX insights by Artu Grande",
                  url: "https://medium.com/@infoarturogrande",
                  author: { "@id": "https://arturogrande.com/#person" },
                  inLanguage: ["en", "es"],
                  about: ["Web3", "AI", "UX Design", "Product Design", "Blockchain", "Sustainability"],
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
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}