import Link from 'next/link'
import Image from 'next/image'
import { Service } from '@/lib/services'
import { ArrowRightIcon } from './Icons'

interface ServiceCardProps {
  service: Service
  town?: string
}

export default function ServiceCard({ service, town }: ServiceCardProps) {
  const href = town ? `/${service.slug}/${town}` : `/${service.slug}`

  return (
    <Link href={href} className="group block">
      <div className="bg-navy-800 border border-white/5 rounded-xl overflow-hidden hover:border-blue-500/30 hover:bg-navy-700/50 transition-all h-full flex flex-col">
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          {service.premium && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600/90 backdrop-blur-sm rounded text-white text-[10px] font-bold uppercase tracking-wider">
              Premium
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors text-sm">{service.name}</h3>
          <p className="text-slate-400 text-xs mb-3 flex-1 line-clamp-2">{service.shortDesc}</p>
          <div className="flex items-center justify-between">
            <span className="text-blue-400 text-xs font-medium">{service.priceRange}</span>
            <ArrowRightIcon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  )
}
