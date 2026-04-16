import Layout from '@/components/Layout'
import { locale } from '@/lib/locale'
import { services } from '@/lib/services'
import { towns } from '@/lib/towns'
import { ShieldIcon, ClockIcon, StarIcon, CheckIcon, PhoneIcon, WrenchIcon } from '@/components/Icons'
import Link from 'next/link'

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale.siteName,
    url: `https://${locale.domain}`,
    telephone: locale.phone,
    description: `Professional plumbing services available 24/7 across ${towns.length}+ UK towns. Gas Safe registered engineers for emergency callouts, bathroom installations, boiler repairs and more.`,
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    serviceType: services.map(s => s.name),
  }

  return (
    <Layout
      title="About Us — Trusted Local Plumbers Across the UK"
      description={`${locale.siteName} connects homeowners with Gas Safe registered plumbers in ${towns.length}+ UK towns. 24/7 emergency cover, free quotes, no call-out charges.`}
      canonical={`https://${locale.domain}/about`}
      schema={schema}
    >
      {/* Hero */}
      <section className="bg-navy-950 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            About {locale.siteName}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            We connect UK homeowners with qualified, Gas Safe registered plumbers — fast. 
            Whether it is a burst pipe at 3am or a full bathroom renovation, our network of 
            vetted professionals covers {towns.length}+ towns and cities across the country.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">What We Do</h2>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              Finding a reliable plumber should not be a gamble. Too many homeowners have been 
              let down by no-shows, vague quotes, and unqualified tradespeople. {locale.siteName} 
              exists to fix that problem.
            </p>
            <p>
              We maintain a network of plumbing professionals across every major town and city 
              in the UK. Every plumber in our network is Gas Safe registered, fully insured, and 
              vetted for quality of work. When you submit a request through our site, we match 
              you with the right professional for the job — based on your location, the type of 
              work needed, and availability.
            </p>
            <p>
              Our service covers {services.length} core plumbing categories, from emergency 
              call-outs and leak repairs to full bathroom installations and central heating 
              systems. We operate 24 hours a day, 7 days a week, 365 days a year.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-950 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-navy-800 border border-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold text-blue-400 mb-2">{towns.length}+</div>
              <div className="text-sm text-slate-400">UK Towns Covered</div>
            </div>
            <div className="bg-navy-800 border border-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold text-blue-400 mb-2">{services.length}</div>
              <div className="text-sm text-slate-400">Service Categories</div>
            </div>
            <div className="bg-navy-800 border border-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-slate-400">Emergency Cover</div>
            </div>
            <div className="bg-navy-800 border border-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold text-blue-400 mb-2">4.8</div>
              <div className="text-sm text-slate-400">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Why Homeowners Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-navy-800 border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldIcon className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Gas Safe Registered</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every plumber in our network holds a valid Gas Safe registration. We verify 
                credentials before anyone joins our platform and run regular checks to ensure 
                ongoing compliance.
              </p>
            </div>
            <div className="bg-navy-800 border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Fast Response Times</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                For emergency jobs, our target is a plumber at your door within 60 minutes. 
                For scheduled work like bathroom installations and boiler fitting, we offer 
                same-week availability in most areas.
              </p>
            </div>
            <div className="bg-navy-800 border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <StarIcon className="w-8 h-8 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Free Quotes</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                No call-out charge, no obligation. Every plumber in our network provides a
                clear, written quote before starting work, so you know exactly what you are
                paying for.
              </p>
            </div>
            <div className="bg-navy-800 border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckIcon className="w-8 h-8 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Nationwide Coverage</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                From London to Edinburgh, Bristol to Newcastle — we cover {towns.length}+ 
                towns across England, Scotland, Wales, and Northern Ireland. Wherever you are 
                in the UK, there is a qualified plumber near you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="bg-navy-950 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map(s => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="bg-navy-800 border border-white/5 rounded-lg p-4 hover:border-blue-500/30 transition-colors flex items-center gap-4"
              >
                <WrenchIcon className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <div className="text-white font-medium">{s.name}</div>
                  <div className="text-slate-500 text-sm">{s.shortDesc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need a Plumber?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get a free, no-obligation quote from a qualified local plumber today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${locale.phoneTel}`}
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <PhoneIcon className="w-5 h-5" />
              Call {locale.phone}
            </a>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Request a Quote Online
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
