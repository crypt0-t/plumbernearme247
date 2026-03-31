import townsData from '../data/uk-towns.json'

export interface Town {
  name: string
  slug: string
  region: string
  county: string
  population: number
  lat: number
  lng: number
}

export const towns: Town[] = townsData as Town[]

export function getTownBySlug(slug: string): Town | undefined {
  return towns.find(t => t.slug === slug)
}

export function getTownsByRegion(region: string): Town[] {
  return towns.filter(t => t.region === region)
}

// Haversine distance in miles
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getNearbyTowns(slug: string, limit = 8): (Town & { distance: number })[] {
  const town = getTownBySlug(slug)
  if (!town) return []

  return towns
    .filter(t => t.slug !== slug)
    .map(t => ({
      ...t,
      distance: Math.round(haversine(town.lat, town.lng, t.lat, t.lng) * 10) / 10
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}

export function getAllTownSlugs(): string[] {
  return towns.map(t => t.slug)
}
