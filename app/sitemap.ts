import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://amusing-study-hall-website.vercel.app'

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), priority: 0.3 },
  ]
}