import Link from 'next/link'
import { MapPinIcon } from './Icons'

interface NearbyTown {
  name: string
  slug: string
  distance: number
}

interface NearbyTownsProps {
  towns: NearbyTown[]
  serviceSlug: string
  serviceName: string
}

export default function NearbyTowns({ towns, serviceSlug, serviceName }: NearbyTownsProps) {
  if (!towns.length) return null

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <MapPinIcon className="w-5 h-5 text-blue-400" />
        {serviceName} in Nearby Areas
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {towns.map(town => (
          <Link
            key={town.slug}
            href={`/${serviceSlug}/${town.slug}`}
            className="bg-navy-800 border border-white/5 rounded-lg p-4 hover:border-blue-500/30 transition-all group"
          >
            <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">{town.name}</div>
            <div className="text-slate-500 text-xs mt-1">{town.distance} miles away</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
