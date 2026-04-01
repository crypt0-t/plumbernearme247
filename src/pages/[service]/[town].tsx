import { GetStaticProps, GetStaticPaths } from 'next'
import fs from 'fs'
import path from 'path'
import Layout from '@/components/Layout'
import LeadForm from '@/components/LeadForm'
import NearbyTowns from '@/components/NearbyTowns'
import { services, getServiceBySlug, Service } from '@/lib/services'
import { getTownBySlug, getNearbyTowns, towns, Town } from '@/lib/towns'
import { locale } from '@/lib/locale'
import { generateServiceTownSchema } from '@/lib/seo'
import { CheckIcon, PhoneIcon, ShieldIcon, ClockIcon, StarIcon } from '@/components/Icons'
import Link from 'next/link'

interface ContentData {
  town?: string
  title?: string
  metaDescription?: string
  h1?: string
  intro?: string
  localContext?: string
  serviceDetail?: string
  pricingGuide?: string
  whyLocal?: string
  localContent?: string
  faqs?: Array<{ q?: string; a?: string; question?: string; answer?: string }>
  ctaText?: string
}

interface TownServicePageProps {
  service: Service
  town: Town
  nearby: (Town & { distance: number })[]
  otherServices: Service[]
  content: ContentData | null
}

export default function TownServicePage({ service, town, nearby, otherServices, content }: TownServicePageProps) {
  const schema = generateServiceTownSchema(service.name, town.name, service.priceRange, service.slug)

  const title = content?.title || `${service.name} in ${town.name} — Available 24/7`
  const description = content?.metaDescription || `Looking for ${service.name.toLowerCase()} in ${town.name}? ${locale.certification}. Free quotes, fast response. Call ${locale.phone}.`
  const h1 = content?.h1 || `${service.name} in ${town.name}`
  const intro = content?.intro || content?.localContent || `Need ${service.name.toLowerCase()} in ${town.name}? We connect you with qualified, ${locale.certification.toLowerCase()} professionals serving ${town.name} and the surrounding ${town.county} area.`
  const localContext = content?.localContext
  const serviceDetail = content?.serviceDetail
  const pricingGuide = content?.pricingGuide
  const whyLocal = content?.whyLocal
  const faqs = content?.faqs || []
  const ctaText = content?.ctaText

  return (
    <Layout
      title={title}
      description={description}
      canonical={`https://${locale.domain}/${service.slug}/${town.slug}`}
      schema={schema}
    >
      {/* Hero image */}
      <section className="relative">
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <img src={service.galleryImage} alt={`${service.name} in ${town.name}`} loading="eager" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 to-navy-950" />
        </div>
      </section>

      <section className="bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">

          {/* Breadcrumb */}
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-blue-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${service.slug}`} className="hover:text-blue-400">{service.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{town.name}</span>
          </nav>

          <div className="grid md:grid-cols-5 gap-10">

            {/* Main content */}
            <div className="md:col-span-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{h1}</h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">{intro}</p>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-navy-800 border border-white/5 rounded-lg p-4 flex items-center gap-3">
                  <ShieldIcon className="w-6 h-6 text-blue-400 shrink-0" />
                  <span className="text-sm text-slate-300">{locale.certification}</span>
                </div>
                <div className="bg-navy-800 border border-white/5 rounded-lg p-4 flex items-center gap-3">
                  <ClockIcon className="w-6 h-6 text-blue-400 shrink-0" />
                  <span className="text-sm text-slate-300">Same-Day Service</span>
                </div>
                <div className="bg-navy-800 border border-white/5 rounded-lg p-4 flex items-center gap-3">
                  <StarIcon className="w-6 h-6 text-yellow-400 shrink-0" />
                  <span className="text-sm text-slate-300">4.8 Star Average</span>
                </div>
                <div className="bg-navy-800 border border-white/5 rounded-lg p-4 flex items-center gap-3">
                  <CheckIcon className="w-6 h-6 text-green-400 shrink-0" />
                  <span className="text-sm text-slate-300">Free Quotes</span>
                </div>
              </div>

              {/* Local Context — unique Sonnet content */}
              {localContext && (
                <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Plumbing in {town.name} — What You Need to Know</h2>
                  <p className="text-slate-300 leading-relaxed">{localContext}</p>
                </div>
              )}

              {/* Service Detail */}
              {serviceDetail ? (
                <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">How We Work</h2>
                  <p className="text-slate-300 leading-relaxed">{serviceDetail}</p>
                </div>
              ) : (
                <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">What&apos;s Included</h2>
                  <ul className="space-y-3">
                    {service.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-slate-300">
                        <CheckIcon className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-2">{service.name} Cost in {town.name}</h2>
                {pricingGuide ? (
                  <p className="text-slate-300 leading-relaxed">{pricingGuide}</p>
                ) : (
                  <>
                    <p className="text-slate-400 mb-4">Typical costs for {service.name.toLowerCase()} in the {town.name} area:</p>
                    <div className="bg-navy-900 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">{service.priceRange}</div>
                      <div className="text-sm text-slate-400 mt-1">Final cost depends on job complexity. Get an exact quote — it&apos;s free.</div>
                    </div>
                  </>
                )}
              </div>

              {/* Why Local */}
              {whyLocal && (
                <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Why Choose a Local {town.name} Specialist</h2>
                  <p className="text-slate-300 leading-relaxed">{whyLocal}</p>
                </div>
              )}

              {/* FAQ */}
              {faqs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {faqs.map((faq, i) => {
                      const q = faq.q || faq.question || ''
                      const a = faq.a || faq.answer || ''
                      return (
                        <div key={i} className="bg-navy-800 border border-white/5 rounded-lg p-5">
                          <h3 className="text-white font-semibold mb-2">{q}</h3>
                          <p className="text-slate-400 text-sm">{a}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Fallback FAQs if no content */}
              {faqs.length === 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                      <h3 className="text-white font-semibold mb-2">How much does {service.name.toLowerCase()} cost in {town.name}?</h3>
                      <p className="text-slate-400 text-sm">{service.name} in {town.name} typically costs {service.priceRange}. Exact pricing depends on the scope of work. We recommend getting 2-3 quotes to compare — our service is completely free.</p>
                    </div>
                    <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                      <h3 className="text-white font-semibold mb-2">Do you offer emergency {service.name.toLowerCase()} in {town.name}?</h3>
                      <p className="text-slate-400 text-sm">Yes, we have plumbers available 24/7 across {town.name} and the wider {town.county} area. For emergencies, call {locale.phone} for immediate assistance.</p>
                    </div>
                    <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                      <h3 className="text-white font-semibold mb-2">Are your plumbers in {town.name} qualified?</h3>
                      <p className="text-slate-400 text-sm">Every plumber in our network is fully vetted, {locale.certification.toLowerCase()}, and carries public liability insurance. We only work with professionals who meet our strict quality standards.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA text */}
              {ctaText && (
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 mb-8">
                  <p className="text-slate-300 leading-relaxed">{ctaText}</p>
                </div>
              )}

              {/* Other services in this town */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Other Services in {town.name}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {otherServices.map(s => (
                    <Link key={s.slug} href={`/${s.slug}/${town.slug}`} className="bg-navy-800 border border-white/5 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                      <div className="text-sm font-medium text-white">{s.name}</div>
                      <div className="text-xs text-blue-400 mt-1">{s.priceRange}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Nearby towns */}
              <NearbyTowns towns={nearby.map(t => ({ name: t.name, slug: t.slug, distance: Math.round(t.distance) }))} serviceSlug={service.slug} serviceName={service.name} />
            </div>

            {/* Sidebar */}
            <div className="md:col-span-2">
              <div className="sticky top-20">
                <LeadForm preselectedService={service.key} town={town.slug} />
                <div className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-center">
                  <div className="text-white font-bold text-lg mb-1">Emergency?</div>
                  <div className="text-blue-100 text-sm mb-3">Call us 24/7 — we answer immediately</div>
                  <a href={`tel:${locale.phone}`} className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors">
                    <PhoneIcon className="w-5 h-5" />
                    {locale.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = []
  for (const service of services) {
    for (const town of towns) {
      paths.push({ params: { service: service.slug, town: town.slug } })
    }
  }
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const serviceSlug = params?.service as string
  const townSlug = params?.town as string

  const service = getServiceBySlug(serviceSlug)
  const town = getTownBySlug(townSlug)

  if (!service || !town) return { notFound: true }

  const nearby = getNearbyTowns(townSlug, 6)
  const otherServices = services.filter(s => s.slug !== serviceSlug)

  // Load content
  let content: ContentData | null = null
  const contentPath = path.join(process.cwd(), 'src/data/content', serviceSlug, `${townSlug}.json`)
  if (fs.existsSync(contentPath)) {
    try {
      content = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
    } catch (e) {
      content = null
    }
  }

  return {
    props: {
      service,
      town,
      nearby,
      otherServices,
      content
    }
  }
}
