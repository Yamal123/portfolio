import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Fetching Medium RSS feed...")
    const response = await fetch("https://medium.com/@infoarturogrande/feed", {
      next: { revalidate: 900 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Medium RSS feed")
    }

    const rssText = await response.text()
    console.log("[v0] RSS feed length:", rssText.length)
    
    const itemMatches = rssText.match(/<item>([\s\S]*?)<\/item>/g) || []
    console.log("[v0] Number of items found in RSS:", itemMatches.length)

    const posts = parseRSSFeed(rssText)
    console.log("[v0] Number of posts parsed:", posts.length)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching Medium posts:", error)
    return NextResponse.json({ posts: [] }, { status: 500 })
  }
}

function parseRSSFeed(rssText: string) {
  const posts: any[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const items = rssText.match(itemRegex) || []

  items.forEach((item) => {
    const titleMatch = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/)
    const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
    const descriptionMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)
    const contentMatch = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)

    if (titleMatch && linkMatch) {
      let imageUrl = null

      if (contentMatch?.[1]) {
        const contentImageMatch = contentMatch[1].match(/<img[^>]+src="([^">]+)"[^>]*>/)
        if (contentImageMatch?.[1]) {
          imageUrl = contentImageMatch[1]
        }
      }

      if (!imageUrl && descriptionMatch?.[1]) {
        const descImageMatch = descriptionMatch[1].match(/<img[^>]+src="([^">]+)"[^>]*>/)
        if (descImageMatch?.[1]) {
          imageUrl = descImageMatch[1]
        }
      }

      if (!imageUrl) {
        const thumbnailMatch = item.match(/<media:thumbnail[^>]+url="([^">]+)"/)
        if (thumbnailMatch?.[1]) {
          imageUrl = thumbnailMatch[1]
        }
      }

      if (!imageUrl) {
        const mediaMatch = item.match(/<media:content[^>]+url="([^">]+)"/)
        if (mediaMatch?.[1]) {
          imageUrl = mediaMatch[1]
        }
      }

      let cleanDescription = ""
      if (descriptionMatch?.[1]) {
        cleanDescription = descriptionMatch[1]
          .replace(/<[^>]*>/g, "")
          .replace(/&[^;]+;/g, " ")
          .replace(/\s+/g, " ")
          .trim()

        if (cleanDescription.length > 150) {
          cleanDescription = cleanDescription.substring(0, 150) + "..."
        }
      }

      if (!cleanDescription) {
        cleanDescription = "Read this article on Medium to learn more."
      }

      posts.push({
        title: titleMatch[1] || "Untitled Article",
        link: linkMatch[1],
        pubDate: pubDateMatch?.[1] || "",
        description: cleanDescription,
        image: imageUrl,
      })
    }
  })

  return posts
}
