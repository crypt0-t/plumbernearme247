import Link from 'next/link'
import { Service } from '@/lib/services'
import { ServiceIcon, ArrowRightIcon } from './Icons'

interface ServiceCardProps {
  service: Service
  town?: string
}

export default function ServiceCard({ service, town }: ServiceCardProps) {
  const href = town ? `/${service.slug}/${town}` : `/${service.slug}`

  return (
    <Link href={href} className="group block">
      <div className="bg-navy-800 border border-white/5 rounded-xl p-6 hover:border-blue-500/30 hover:bg-navy-700/50 transition-all h-full flex flex-col">
        {service.premium && (
          <div className="inline-flex self-start px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-3">
            Premium
          </div>
        )}
        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
          <ServiceIcon service={service.key} className="w-6 h-6" />
        </div>
        <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">{service.name}</h3>
        <p className="text-slate-400 text-sm mb-3 flex-1">{service.shortDesc}</p>
        <div className="flex items-center justify-between">
          <span className="text-blue-400 text-sm font-medium">{service.priceRange}</span>
          <ArrowRightIcon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  )
}
