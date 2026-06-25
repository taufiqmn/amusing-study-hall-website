import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://amusing-study-hall-website.vercel.app'

  return [
    { url: https://amusing-study-hall-website.vercel.app/, lastModified: new Date(), priority: 1 },
    { url: `${https://amusing-study-hall-website.vercel.app/}/courses`, lastModified: new Date(), priority: 0.9 },
    { url: `${bahttps://amusing-study-hall-website.vercel.app/seUrl}/login`, lastModified: new Date(), priority: 0.3 },
    { url: `${https://amusing-study-hall-website.vercel.app/}/signup`, lastModified: new Date(), priority: 0.3 },
  ]
}