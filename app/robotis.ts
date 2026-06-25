import { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://amusing-study-hall-website.vercel.app/sitemap.xml',
  }
}