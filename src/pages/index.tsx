import Layout from '@/components/Layout'
import ServiceCard from '@/components/ServiceCard'
import LeadForm from '@/components/LeadForm'
import { services } from '@/lib/services'
import { locale } from '@/lib/locale'
import { towns } from '@/lib/towns'
import { generateHomepageSchema } from '@/lib/seo'
import { ShieldIcon, ClockIcon, StarIcon, CheckIcon, PhoneIcon, BoltIcon } from '@/components/Icons'
import Link from 'next/link'

export default function Home() {
  const topTowns = towns.slice(0, 40)
  const remaining = towns.length - 40

  return (
    <Layout schema={generateHomepageSchema()}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-blue-700/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-sm font-medium">Available 24/7 — 365 days a year</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Trusted Local Plumbers,{' '}
              <span className="text-blue-400">Near You</span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              From emergency repairs to full bathroom installations. {locale.certification}. 
              Get matched with qualified plumbers in your area — free, no-obligation quotes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#quote" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors text-center">
                Get Free Quote
              </a>
              <a href={`tel:${locale.phoneTel}`} className="border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                {locale.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-white/5 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <ShieldIcon className="w-8 h-8 text-blue-400 shrink-0" />
              <div><div className="text-white text-sm font-semibold">{locale.certification}</div><div className="text-slate-400 text-xs">Fully vetted professionals</div></div>
            </div>
            <div className="flex items-center gap-3">
              <StarIcon className="w-8 h-8 text-yellow-400 shrink-0" />
              <div><div className="text-white text-sm font-semibold">4.8 Star Rating</div><div className="text-slate-400 text-xs">From 2,847 reviews</div></div>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="w-8 h-8 text-blue-400 shrink-0" />
              <div><div className="text-white text-sm font-semibold">Same-Day Service</div><div className="text-slate-400 text-xs">Fast response guaranteed</div></div>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="w-8 h-8 text-green-400 shrink-0" />
              <div><div className="text-white text-sm font-semibold">Work Guaranteed</div><div className="text-slate-400 text-xs">12-month workmanship warranty</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From emergency call-outs to full bathroom installations, we cover every plumbing need.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {services.map(service => (
            <ServiceCard key={service.key} service={service} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Three simple steps to get your plumbing sorted</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Tell Us What You Need', desc: 'Fill in our quick form with your service type, urgency, and location.' },
              { step: '2', title: 'Get Matched', desc: 'We match you with up to 3 qualified, vetted plumbers in your area.' },
              { step: '3', title: 'Job Done', desc: 'Compare quotes, choose your plumber, and get the work completed. Simple.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick quote form */}
      <section id="quote" className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Your Free Quote</h2>
            <p className="text-slate-400 text-lg mb-8">
              Tell us about your job and we&apos;ll match you with qualified local plumbers. No obligation, completely free.
            </p>
            <ul className="space-y-3">
              {[
                'Free, no-obligation quotes',
                'Up to 3 local plumber quotes',
                `All plumbers ${locale.certification}`,
                'Response within 30 minutes',
                'No call-out charges on quotes',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-slate-300">
                  <CheckIcon className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <BoltIcon className="w-10 h-10 text-white shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white">Plumbing Emergency?</h2>
              <p className="text-blue-100">Don&apos;t wait. Our emergency plumbers are available 24/7.</p>
            </div>
          </div>
          <a href={`tel:${locale.phoneTel}`} className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors whitespace-nowrap flex items-center gap-2">
            <PhoneIcon className="w-5 h-5" />
            Call {locale.phone}
          </a>
        </div>
      </section>

      {/* Areas we cover */}
      <section id="areas" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Areas We Cover</h2>
          <p className="text-slate-400 text-lg">
            Professional plumbing services across {towns.length}+ towns and cities
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {topTowns.map(town => (
            <Link
              key={town.slug}
              href={`/emergency-plumber/${town.slug}`}
              className="bg-navy-800 border border-white/5 hover:border-blue-500/30 rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-blue-400 transition-all"
            >
              {town.name}
            </Link>
          ))}
          {remaining > 0 && (
            <span className="bg-navy-800 border border-blue-500/20 rounded-lg px-4 py-2 text-sm text-blue-400 font-medium">
              + {remaining} more areas
            </span>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2,847', label: 'Happy Customers' },
              { value: '24/7', label: 'Availability' },
              { value: `${towns.length}+`, label: 'Areas Covered' },
              { value: '30 min', label: 'Avg Response' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
