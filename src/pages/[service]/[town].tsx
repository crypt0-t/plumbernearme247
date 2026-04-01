import { GetStaticProps, GetStaticPaths } from 'next'
import fs from 'fs'
import path from 'path'
import Layout from '@/components/Layout'
import LeadForm from '@/components/LeadForm'
import NearbyTowns from '@/components/NearbyTowns'
import { services, getServiceBySlug, Service } from '@/lib/services'
import { getTownBySlug, getNearbyTowns, towns, Town, getWaterHardnessLabel, getWaterHardnessColour } from '@/lib/towns'
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
  localParagraph?: string
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
  const description = content?.metaDescription || `Need ${service.name.toLowerCase()} in ${town.name}? ${locale.certification}. Fast response, free quotes. Serving all of ${town.county}.`
  const h1 = content?.h1 || `${service.name} in ${town.name}`
  const intro = content?.intro || content?.localContent || `Need ${service.name.toLowerCase()} in ${town.name}? We connect you with qualified, ${locale.certification.toLowerCase()} professionals serving ${town.name} and the surrounding ${town.county} area.`
  const localContext = content?.localContext || content?.localParagraph
  const serviceDetail = content?.serviceDetail
  const pricingGuide = content?.pricingGuide
  const whyLocal = content?.whyLocal
  const faqs = content?.faqs || []

  // Enriched town data
  const water = town.waterHardness
  const property = town.propertyAge
  const labour = town.labourCost
  const gas = town.gasGrid
  const climate = town.climate
  const floodRisk = town.floodRisk

  // Service-specific pricing from real regional data
  const getServicePrice = () => {
    if (!labour) return service.priceRange
    switch (service.slug) {
      case 'emergency-plumber': return `£${labour.emergencyCallout - 30}–£${labour.emergencyCallout + 80}`
      case 'bathroom-installation': return `£${(labour.bathInstallAvg * 0.7).toLocaleString('en-GB', {maximumFractionDigits:0})}–£${(labour.bathInstallAvg * 1.4).toLocaleString('en-GB', {maximumFractionDigits:0})}`
      case 'boiler-repair': return `£${labour.emergencyCallout}–£${labour.emergencyCallout + 200}`
      case 'boiler-installation': return `£${(labour.bathInstallAvg * 0.25).toLocaleString('en-GB', {maximumFractionDigits:0})}–£${(labour.bathInstallAvg * 0.45).toLocaleString('en-GB', {maximumFractionDigits:0})}`
      case 'blocked-drains': return `£${Math.round(labour.emergencyCallout * 0.5)}–£${labour.emergencyCallout}`
      case 'leak-repair': return `£${Math.round(labour.emergencyCallout * 0.6)}–£${labour.emergencyCallout + 100}`
      case 'wet-room-installation': return `£${(labour.bathInstallAvg * 0.6).toLocaleString('en-GB', {maximumFractionDigits:0})}–£${(labour.bathInstallAvg * 1.1).toLocaleString('en-GB', {maximumFractionDigits:0})}`
      case 'underfloor-heating': return `£${(labour.bathInstallAvg * 0.3).toLocaleString('en-GB', {maximumFractionDigits:0})}–£${(labour.bathInstallAvg * 0.7).toLocaleString('en-GB', {maximumFractionDigits:0})}`
      case 'central-heating': return `£${(labour.bathInstallAvg * 0.35).toLocaleString('en-GB', {maximumFractionDigits:0})}–£${(labour.bathInstallAvg * 0.65).toLocaleString('en-GB', {maximumFractionDigits:0})}`
      case 'gas-engineer': return `£${Math.round(labour.emergencyCallout * 0.6)}–£${labour.emergencyCallout + 50}`
      default: return service.priceRange
    }
  }

  const servicePrice = getServicePrice()

  // Water hardness warning for relevant services
  const showWaterWarning = water && ['hard', 'very-hard'].includes(water.zone) &&
    ['boiler-repair', 'boiler-installation', 'central-heating', 'emergency-plumber'].includes(service.slug)

  // Freeze risk warning
  const showFreezeWarning = climate && ['high', 'medium-high'].includes(climate.freezeRisk) &&
    ['emergency-plumber', 'leak-repair'].includes(service.slug)

  // Off-grid warning — don't show boiler gas services for heavily off-grid areas
  const isOffGridArea = gas && gas.onGrid < 60

  return (
    <Layout
      title={title}
      description={description}
      canonical={`https://${locale.domain}/${service.slug}/${town.slug}`}
      schema={schema}
    >
      {/* Hero */}
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

              {/* LOCAL DATA PANEL — unique per town, zero Claude credits */}
              {(water || property || floodRisk || climate) && (
                <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Plumbing Conditions in {town.name}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">

                    {/* Water hardness */}
                    {water && (
                      <div className="bg-navy-900 rounded-lg p-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Water Hardness</div>
                        <div className={`text-lg font-bold mb-1 ${getWaterHardnessColour(water.zone)}`}>
                          {getWaterHardnessLabel(water.zone)}
                        </div>
                        <div className="text-xs text-slate-400">{water.mgL}mg/l CaCO₃</div>
                      </div>
                    )}

                    {/* Property era */}
                    {property && (
                      <div className="bg-navy-900 rounded-lg p-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Housing Stock</div>
                        <div className="text-lg font-bold text-white mb-1">{property.pre1919}% Pre-1919</div>
                        <div className="text-xs text-slate-400">{property.dominant}</div>
                      </div>
                    )}

                    {/* Flood risk */}
                    {floodRisk && (
                      <div className="bg-navy-900 rounded-lg p-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Flood Risk</div>
                        <div className={`text-lg font-bold mb-1 ${floodRisk === 'high' ? 'text-red-400' : floodRisk === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                          {floodRisk.charAt(0).toUpperCase() + floodRisk.slice(1)}
                        </div>
                        <div className="text-xs text-slate-400">Environment Agency data</div>
                      </div>
                    )}

                    {/* Climate */}
                    {climate && (
                      <div className="bg-navy-900 rounded-lg p-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Freeze Risk</div>
                        <div className={`text-lg font-bold mb-1 ${climate.freezeRisk === 'high' ? 'text-red-400' : climate.freezeRisk.includes('medium') ? 'text-yellow-400' : 'text-green-400'}`}>
                          {climate.freezeRisk.charAt(0).toUpperCase() + climate.freezeRisk.slice(1).replace('-', ' ')}
                        </div>
                        <div className="text-xs text-slate-400">{climate.zone} climate</div>
                      </div>
                    )}
                  </div>

                  {/* Water hardness description */}
                  {water && (
                    <p className="text-sm text-slate-400 leading-relaxed">{water.description}
                      {showWaterWarning && ` Regular descaling and annual servicing is particularly important in ${town.name}.`}
                    </p>
                  )}

                  {/* Property age context */}
                  {property && (
                    <p className="text-sm text-slate-400 leading-relaxed mt-2">{property.era}. {property.pre1919 > 20 ? `With ${property.pre1919}% of properties built before 1919, older pipework and drainage systems are common — specialist knowledge of period properties matters.` : property.newbuild > 12 ? `New build properties in ${town.name} often require specialist warranty-aware plumbers familiar with developer snag lists.` : `Post-war housing stock typically uses copper or early plastic pipework — modern replacement parts are readily available.`}</p>
                  )}
                </div>
              )}

              {/* Sonnet local context — only shows if generated */}
              {localContext && (
                <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">{service.name} in {town.name} — Local Expertise</h2>
                  <p className="text-slate-300 leading-relaxed">{localContext}</p>
                </div>
              )}

              {/* Service detail */}
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

              {/* Pricing — real regional data */}
              <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-2">{service.name} Cost in {town.name}</h2>
                {pricingGuide ? (
                  <p className="text-slate-300 leading-relaxed">{pricingGuide}</p>
                ) : (
                  <>
                    <p className="text-slate-400 mb-4 text-sm">
                      Typical {service.name.toLowerCase()} costs in {town.name}
                      {labour && labour.index !== 100 && ` — ${labour.note.toLowerCase()}`}:
                    </p>
                    <div className="bg-navy-900 rounded-lg p-4 mb-4">
                      <div className="text-2xl font-bold text-blue-400">{servicePrice}</div>
                      <div className="text-sm text-slate-400 mt-1">Based on {town.county} regional rates. Final cost depends on job complexity.</div>
                    </div>
                    {labour && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-navy-900 rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">Day rate</div>
                          <div className="text-white font-semibold">£{labour.avgDayRate}/day</div>
                        </div>
                        <div className="bg-navy-900 rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">vs national avg</div>
                          <div className={`font-semibold ${labour.index > 100 ? 'text-orange-400' : labour.index < 95 ? 'text-green-400' : 'text-white'}`}>
                            {labour.index > 100 ? `+${labour.index - 100}%` : labour.index < 100 ? `-${100 - labour.index}%` : 'Average'}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Off-grid notice */}
              {isOffGridArea && ['boiler-installation', 'central-heating', 'gas-engineer'].includes(service.slug) && (
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 mb-8">
                  <h3 className="text-amber-400 font-bold mb-2">Off-Gas-Grid Area</h3>
                  <p className="text-slate-300 text-sm">{town.name} has a significant proportion of properties not connected to the mains gas network. {gas?.note} Our engineers are experienced with oil boilers, LPG systems, and heat pumps for off-grid properties.</p>
                </div>
              )}

              {/* Flood risk notice */}
              {floodRisk === 'high' && ['emergency-plumber', 'blocked-drains', 'leak-repair'].includes(service.slug) && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
                  <h3 className="text-blue-400 font-bold mb-2">Flood Risk Area</h3>
                  <p className="text-slate-300 text-sm">{town.name} has elevated flood risk according to Environment Agency data. Our emergency plumbers are experienced with flood damage, drain clearance, and emergency pump-out services.</p>
                </div>
              )}

              {/* Freeze risk notice */}
              {showFreezeWarning && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
                  <h3 className="text-blue-400 font-bold mb-2">Winter Freeze Risk</h3>
                  <p className="text-slate-300 text-sm">{climate?.note}. Burst pipes from frozen water are one of the most common winter emergencies in {town.name}. If you suspect frozen pipes, call immediately — acting fast can prevent significant damage.</p>
                </div>
              )}

              {/* Why local */}
              {whyLocal ? (
                <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Why Choose a Local {town.name} Specialist</h2>
                  <p className="text-slate-300 leading-relaxed">{whyLocal}</p>
                </div>
              ) : (
                <div className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Why Choose a Local {town.name} Specialist</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckIcon className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Local plumbers know {town.name}&apos;s water supply characteristics — {water ? getWaterHardnessLabel(water.zone).toLowerCase() + ' water requires specific expertise' : 'local knowledge matters'}</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckIcon className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Familiar with {town.county} property types — {property ? property.dominant : 'local housing stock'}</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckIcon className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Faster response — engineers based in and around {town.name}</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckIcon className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>All engineers are {locale.certification.toLowerCase()} and fully insured</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* FAQs */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.length > 0 ? faqs.map((faq, i) => {
                    const q = faq.q || faq.question || ''
                    const a = faq.a || faq.answer || ''
                    return (
                      <div key={i} className="bg-navy-800 border border-white/5 rounded-lg p-5">
                        <h3 className="text-white font-semibold mb-2">{q}</h3>
                        <p className="text-slate-400 text-sm">{a}</p>
                      </div>
                    )
                  }) : (
                    <>
                      <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                        <h3 className="text-white font-semibold mb-2">How much does {service.name.toLowerCase()} cost in {town.name}?</h3>
                        <p className="text-slate-400 text-sm">{service.name} in {town.name} typically costs {servicePrice}. {labour && labour.index !== 100 ? labour.note + '. ' : ''}Final cost depends on job complexity and parts required. Get a free quote to confirm your exact price.</p>
                      </div>
                      <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                        <h3 className="text-white font-semibold mb-2">Do you cover emergency call-outs in {town.name}?</h3>
                        <p className="text-slate-400 text-sm">Yes — we have engineers available 24/7 across {town.name} and the wider {town.county} area. Emergency response typically within 1-2 hours. Call {locale.phone} for immediate assistance.</p>
                      </div>
                      <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                        <h3 className="text-white font-semibold mb-2">Are your plumbers in {town.name} Gas Safe registered?</h3>
                        <p className="text-slate-400 text-sm">Every engineer in our network is Gas Safe registered and fully insured. You can ask to see their Gas Safe ID card before any work begins — this is your legal right.</p>
                      </div>
                      {water && ['hard', 'very-hard'].includes(water.zone) && (
                        <div className="bg-navy-800 border border-white/5 rounded-lg p-5">
                          <h3 className="text-white font-semibold mb-2">Does hard water in {town.name} affect my boiler?</h3>
                          <p className="text-slate-400 text-sm">{town.name} has {getWaterHardnessLabel(water.zone).toLowerCase()} water at {water.mgL}mg/l. This causes limescale buildup inside boilers and pipes over time. Annual servicing is essential, and a scale inhibitor is strongly recommended for new boiler installations.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Other services */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Other Plumbing Services in {town.name}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {otherServices.slice(0, 6).map(s => (
                    <Link key={s.slug} href={`/${s.slug}/${town.slug}`} className="bg-navy-800 border border-white/5 hover:border-blue-500/50 rounded-lg p-4 text-sm text-slate-300 hover:text-blue-400 transition-colors">
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="md:col-span-2">
              <div className="sticky top-8">
                <LeadForm preselectedService={service.slug} town={town.name} />

                {/* Quick stats */}
                <div className="mt-6 bg-navy-800 border border-white/5 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">{town.name} at a Glance</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">County</span>
                      <span className="text-white">{town.county}</span>
                    </div>
                    {water && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Water</span>
                        <span className={getWaterHardnessColour(water.zone)}>{getWaterHardnessLabel(water.zone)}</span>
                      </div>
                    )}
                    {property && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pre-1919 homes</span>
                        <span className="text-white">{property.pre1919}%</span>
                      </div>
                    )}
                    {floodRisk && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Flood risk</span>
                        <span className={floodRisk === 'high' ? 'text-red-400' : floodRisk === 'medium' ? 'text-yellow-400' : 'text-green-400'}>
                          {floodRisk.charAt(0).toUpperCase() + floodRisk.slice(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Typical call-out</span>
                      <span className="text-white">{labour ? `£${labour.emergencyCallout - 30}–£${labour.emergencyCallout + 80}` : service.priceRange}</span>
                    </div>
                  </div>
                </div>

                <NearbyTowns towns={nearby} serviceSlug={service.slug} serviceName={service.name} />
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

  let content: ContentData | null = null
  const contentPath = path.join(process.cwd(), 'src/data/content', serviceSlug, `${townSlug}.json`)
  if (fs.existsSync(contentPath)) {
    try {
      content = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
    } catch { content = null }
  }

  return {
    props: {
      service,
      town: JSON.parse(JSON.stringify(town)),
      nearby: JSON.parse(JSON.stringify(nearby)),
      otherServices,
      content
    }
  }
}
