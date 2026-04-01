import Head from 'next/head'
import Link from 'next/link'
import { locale } from '@/lib/locale'
import { services } from '@/lib/services'
import { PhoneIcon, WrenchIcon } from './Icons'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  canonical?: string
  schema?: object
}

export default function Layout({ children, title, description, canonical, schema }: LayoutProps) {
  const siteTitle = title ? `${title} | ${locale.siteName}` : "Plumber Near Me | Find Trusted Local Plumbers 24/7"
  const siteDesc = description || `Find a reliable plumber near you, available 24/7. Gas Safe registered, free quotes, fast response times. Emergency callouts, boiler repair, bathroom installation and more.`

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`https://${locale.domain}/images/og-default.webp`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDesc} />
        {schema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        )}
      </Head>

      {/* Emergency top bar */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
        <a href={`tel:${locale.phoneTel}`} className="flex items-center justify-center gap-2">
          <PhoneIcon className="w-4 h-4" />
          Emergency? Call {locale.phone} — Available 24/7
        </a>
      </div>

      {/* Nav */}
      <nav className="bg-navy-900/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <WrenchIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{locale.siteName}</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#services" className="text-slate-300 hover:text-white text-sm transition-colors">Services</Link>
            <Link href="/#areas" className="text-slate-300 hover:text-white text-sm transition-colors">Areas</Link>
            <Link href="/about" className="text-slate-300 hover:text-white text-sm transition-colors">About</Link>
            <Link href="/contact" className="text-slate-300 hover:text-white text-sm transition-colors">Contact</Link>
            <a href={`tel:${locale.phoneTel}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              {locale.phone}
            </a>
          </div>

          {/* Mobile menu button */}
          <a href={`tel:${locale.phoneTel}`} className="md:hidden bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
            <PhoneIcon className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <WrenchIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">{locale.siteName}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Professional plumbing services available 24 hours a day, 7 days a week. {locale.certification}. Serving homes and businesses across the UK.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {services.slice(0, 5).map(s => (
                  <li key={s.slug}>
                    <Link href={`/${s.slug}`} className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">More Services</h3>
              <ul className="space-y-2">
                {services.slice(5).map(s => (
                  <li key={s.slug}>
                    <Link href={`/${s.slug}`} className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href={`tel:${locale.phoneTel}`} className="hover:text-blue-400 transition-colors">{locale.phone}</a>
                </li>
                <li>Available 24 hours, 7 days</li>
                <li>{locale.certification}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {locale.siteName}. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
