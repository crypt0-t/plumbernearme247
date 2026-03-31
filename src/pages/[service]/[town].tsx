
import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from '@/components/Layout'
import LeadForm from '@/components/LeadForm'
import NearbyTowns from '@/components/NearbyTowns'
import ServiceCard from '@/components/ServiceCard'
import { services, getServiceBySlug, Service } from '@/lib/services'
import { getTownBySlug, getNearbyTowns, towns, Town } from '@/lib/towns'
import { locale } from '@/lib/locale'
import { generateServiceTownSchema } from '@/lib/seo'
import { CheckIcon, PhoneIcon, ShieldIcon, ClockIcon, StarIcon } from '@/components/Icons'
import Link from 'next/link'

interface TownServicePageProps {
  service: Service
  town: Town
  nearby: (Town & { distance: number })[]
  otherServices: Service[]
}

export default function TownServicePage({ service, town, nearby, otherServices }: TownServicePageProps) {
  const schema = generateServiceTownSchema(service.name, town.name, service.priceRange, service.slug)

  return (
    <Layout
      title={`${service.name} in ${town.name} — Available 24/7`}
      description={`Looking for ${service.name.toLowerCase()} in ${town.name}? ${locale.certification}. Free quotes, fast response. Serving ${town.name} and surrounding areas. Call ${locale.phone}.`}
      canonical={`https://${locale.domain}/${service.slug}/${town.slug}`}
      schema={schema}
    >
      <section className="relative"><div className="relative h-48 md:h-64 w-full overflow-hidden"><img src={service.galleryImage} alt={`${service.name} in ${town.name}`} loading="eager" decoding="async" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 to-navy-950" /></div></section><section className="bg-navy-950">
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
            {/* Main content — 3 cols */}
            <div className="md:col-span-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {service.name} in {town.name}
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Need {service.name.toLowerCase()} in {town.name}? We connect you with qualified, 
                {locale.certification.toLowerCase()} professionals serving {town.name} and the surrounding {town.county} area. 
                Available 24 hours a day, 7 days a week.
              </p>

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

              {/* Service details */}
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

              {/* Pricing */}
              <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-2">
                  {service.name} Cost in {town.name}
                </h2>
                <p className="text-slate-400 mb-4">
                  Typical costs for {service.name.toLowerCase()} in the {town.name} area:
                </p>
                <div className="bg-navy-900 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{service.priceRange}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    Final cost depends on job complexity. Get an exact quote — it&apos;s free.
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                    <h3 className="text-white font-semibold mb-2">
                      How much does {service.name.toLowerCase()} cost in {town.name}?
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {service.name} in {town.name} typically costs {service.priceRange}. 
                      Exact pricing depends on the scope of work. We recommend getting 2-3 quotes 
                      to compare — our service is completely free.
                    </p>
                  </div>
                  <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                    <h3 className="text-white font-semibold mb-2">
                      Do you offer emergency {service.name.toLowerCase()} in {town.name}?
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Yes, we have plumbers available 24/7 across {town.name} and the wider {town.county} area. 
                      For emergencies, call {locale.phone} for immediate assistance.
                    </p>
                  </div>
                  <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                    <h3 className="text-white font-semibold mb-2">
                      Are your plumbers in {town.name} qualified?
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Every plumber in our network is fully vetted, {locale.certification.toLowerCase()}, and carries 
                      public liability insurance. We only work with professionals who meet our strict quality standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar — 2 cols */}
            <div className="md:col-span-2">
              <div className="sticky top-20">
                <LeadForm preselectedService={service.key} town={town.slug} />

                {/* Emergency callout */}
                <div className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-center">
                  <p className="text-white font-semibold mb-2">Need urgent help?</p>
                  <a href={`tel:${locale.phoneTel}`} className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-lg inline-flex items-center gap-2 hover:bg-blue-50 transition-colors">
                    <PhoneIcon className="w-5 h-5" />
                    {locale.phone}
                  </a>
                  <p className="text-blue-100 text-sm mt-2">Available 24 hours, 7 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby towns */}
          <NearbyTowns towns={nearby} serviceSlug={service.slug} serviceName={service.name} />

          {/* Cross-sell other services */}
          <section className="mt-16 pt-12 border-t border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">
              Other Plumbing Services in {town.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {otherServices.slice(0, 5).map(s => (
                <ServiceCard key={s.key} service={s} town={town.slug} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for all service/town combinations
  const paths: { params: { service: string; town: string } }[] = []

  for (const service of services) {
    for (const town of towns) {
      paths.push({ params: { service: service.slug, town: town.slug } })
    }
  }

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const service = getServiceBySlug(params?.service as string)
  const town = getTownBySlug(params?.town as string)

  if (!service || !town) return { notFound: true }

  const nearby = getNearbyTowns(town.slug, 8)
  const otherServices = services.filter(s => s.key !== service.key)

  return {
    props: {
      service,
      town,
      nearby,
      otherServices,
    },
  }
}
