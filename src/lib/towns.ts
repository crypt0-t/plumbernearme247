import townsData from '../data/uk-towns-enriched.json'

export interface WaterHardness {
  zone: string
  mgL: number
  description: string
}

export interface PropertyAge {
  pre1919: number
  interwar: number
  postwar: number
  modern: number
  newbuild: number
  dominant: string
  era: string
}

export interface LabourCost {
  index: number
  avgDayRate: number
  bathInstallAvg: number
  emergencyCallout: number
  note: string
}

export interface GasGrid {
  onGrid: number
  note: string
}

export interface Climate {
  zone: string
  freezeRisk: string
  note: string
}

export interface PopulationBand {
  band: string
  label: string
  demand: string
}

export interface Town {
  name: string
  slug: string
  region: string
  county: string
  population: number
  lat: number
  lng: number
  enriched?: boolean
  waterHardness?: WaterHardness
  propertyAge?: PropertyAge
  labourCost?: LabourCost
  floodRisk?: string
  gasGrid?: GasGrid
  climate?: Climate
  populationBand?: PopulationBand
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
  const R = 3959
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

// Water hardness label for display
export function getWaterHardnessLabel(zone: string): string {
  const labels: Record<string, string> = {
    'very-soft': 'Very Soft',
    'soft': 'Soft',
    'moderately-soft': 'Moderately Soft',
    'moderately-hard': 'Moderately Hard',
    'hard': 'Hard',
    'very-hard': 'Very Hard',
  }
  return labels[zone] || 'Moderate'
}

// Water hardness colour for UI
export function getWaterHardnessColour(zone: string): string {
  const colours: Record<string, string> = {
    'very-soft': 'text-blue-300',
    'soft': 'text-blue-400',
    'moderately-soft': 'text-green-400',
    'moderately-hard': 'text-yellow-400',
    'hard': 'text-orange-400',
    'very-hard': 'text-red-400',
  }
  return colours[zone] || 'text-slate-300'
}
