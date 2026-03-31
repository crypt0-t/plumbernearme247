import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from '@/components/Layout'
import LeadForm from '@/components/LeadForm'
import ServiceCard from '@/components/ServiceCard'
import { services, getServiceBySlug, Service } from '@/lib/services'
import { towns } from '@/lib/towns'
import { locale } from '@/lib/locale'
import { CheckIcon, StarIcon } from '@/components/Icons'
import Link from 'next/link'

interface ServicePageProps {
  service: Service
  otherServices: Service[]
}

export default function ServicePage({ service, otherServices }: ServicePageProps) {
  const topTowns = towns.slice(0, 60)

  return (
    <Layout
      title={`${service.name} — Professional & Reliable`}
      description={`Professional ${service.name.toLowerCase()} service. ${locale.certification}. Available 24/7 across ${towns.length}+ locations. Free quotes, fast response. Call ${locale.phone}.`}
      canonical={`https://${locale.domain}/${service.slug}`}
    >
      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <nav className="text-sm text-slate-400 mb-6">
                <Link href="/" className="hover:text-blue-400">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{service.name}</span>
              </nav>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                {service.name}
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {service.description} Get matched with qualified, {locale.certification.toLowerCase()} professionals in your area.
              </p>

              <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">Typical Cost: {service.priceRange}</span>
                </div>
                <ul className="space-y-2">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckIcon className="w-4 h-4 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <LeadForm preselectedService={service.key} />
          </div>
        </div>
      </section>

      {/* Find by town */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-6">Find {service.name} Near You</h2>
        <div className="flex flex-wrap gap-2">
          {topTowns.map(town => (
            <Link
              key={town.slug}
              href={`/${service.slug}/${town.slug}`}
              className="bg-navy-800 border border-white/5 hover:border-blue-500/30 rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-blue-400 transition-all"
            >
              {service.name} in {town.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Other services */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white mb-6">Other Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {otherServices.map(s => (
            <ServiceCard key={s.key} service={s} />
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: services.map(s => ({ params: { service: s.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const service = getServiceBySlug(params?.service as string)
  if (!service) return { notFound: true }

  const otherServices = services.filter(s => s.key !== service.key)

  return {
    props: { service, otherServices },
  }
}
