import { GetServerSideProps } from 'next'
import { services } from '@/lib/services'
import { towns } from '@/lib/towns'
import { locale } from '@/lib/locale'

function Sitemap() { return null }

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const domain = `https://${locale.domain}`

  const staticPages = [
    '', '/about', '/contact',
    ...services.map(s => `/${s.slug}`),
  ]

  const townPages: string[] = []
  for (const service of services) {
    for (const town of towns) {
      townPages.push(`/${service.slug}/${town.slug}`)
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(path => `  <url>
    <loc>${domain}${path}</loc>
    <changefreq>${path === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${townPages.map(path => `  <url>
    <loc>${domain}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default Sitemap
