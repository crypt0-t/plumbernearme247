import Layout from '@/components/Layout'
import LeadForm from '@/components/LeadForm'
import { locale } from '@/lib/locale'
import { PhoneIcon, ClockIcon, ShieldIcon, WrenchIcon } from '@/components/Icons'

export default function ContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'Organization',
      name: locale.siteName,
      telephone: locale.phone,
      url: `https://${locale.domain}`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: locale.phone,
        contactType: 'customer service',
        areaServed: 'GB',
        availableLanguage: 'English',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      },
    },
  }

  return (
    <Layout
      title="Contact Us — Get a Free Plumbing Quote"
      description="Contact PlumberNearMe247 for a free plumbing quote. Available 24/7 for emergencies. Call 0800 048 2472 or fill in our online form for a fast response."
      canonical={`https://${locale.domain}/contact`}
      schema={schema}
    >
      {/* Hero */}
      <section className="bg-navy-950 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Whether you need an emergency plumber right now or want to book a bathroom 
            installation for next month, we are here to help. Call us directly or fill in 
            the form below for a free, no-obligation quote.
          </p>
        </div>
      </section>

      <section className="bg-navy-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10">

            {/* Contact Methods */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Details</h2>

              {/* Phone */}
              <a
                href={`tel:${locale.phoneTel}`}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl p-6 flex items-center gap-4 transition-colors block"
              >
                <PhoneIcon className="w-10 h-10 text-white shrink-0" />
                <div>
                  <div className="text-white font-bold text-xl">{locale.phone}</div>
                  <div className="text-blue-200 text-sm">Call now — free from mobiles and landlines</div>
                </div>
              </a>

              {/* Hours */}
              <div className="bg-navy-800 border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ClockIcon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-semibold">Opening Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Emergency Callouts</span>
                    <span className="text-green-400 font-medium">24/7, 365 days</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Quotes &amp; Bookings</span>
                    <span className="text-slate-400">Mon-Sat, 7am-9pm</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Sunday</span>
                    <span className="text-slate-400">8am-6pm</span>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="bg-navy-800 border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldIcon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-semibold">Our Guarantee</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">&#10003;</span>
                    Gas Safe registered engineers only
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">&#10003;</span>
                    Free, no-obligation quotes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">&#10003;</span>
                    No hidden call-out charges
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">&#10003;</span>
                    Work guaranteed and fully insured
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">&#10003;</span>
                    Written quote before any work starts
                  </li>
                </ul>
              </div>

              {/* Response time */}
              <div className="bg-navy-800 border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <WrenchIcon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-semibold">Response Times</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Emergency</span>
                    <span className="text-white font-medium">Within 60 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Urgent repairs</span>
                    <span className="text-white font-medium">Same day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quotes for planned work</span>
                    <span className="text-white font-medium">Within 24 hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Form */}
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold text-white mb-6">Request a Free Quote</h2>
              <p className="text-slate-400 mb-6 text-sm">
                Fill in the form below and a qualified local plumber will get back to you 
                within 24 hours. For emergencies, call us directly on{' '}
                <a href={`tel:${locale.phoneTel}`} className="text-blue-400 hover:text-blue-300">
                  {locale.phone}
                </a>.
              </p>
              <LeadForm />
            </div>

          </div>
        </div>
      </section>
    </Layout>
  )
}
