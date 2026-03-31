import { locale } from './locale'

export interface Service {
  key: string
  name: string
  slug: string
  description: string
  shortDesc: string
  priceRange: string
  premium: boolean
  icon: string
  image: string
  features: string[]
}

const s = locale.services
const p = locale.priceRanges

export const services: Service[] = [
  {
    key: 'emergency',
    name: s.emergency,
    slug: s.emergencySlug,
    description: `24/7 emergency plumbing service. Burst pipes, major leaks, flooding — we respond fast when you need us most.`,
    shortDesc: 'Burst pipes, flooding & urgent repairs',
    priceRange: p.emergency,
    premium: false,
    icon: 'emergency',
    image: '/images/services/emergency.jpg',
    features: ['Average 30-minute response time', 'Available 24 hours, 7 days a week', 'No call-out charge', 'Fully qualified & insured'],
  },
  {
    key: 'bathroom',
    name: s.bathroom,
    slug: s.bathroomSlug,
    description: `Complete bathroom installation and fitting service. From design to completion, we handle every aspect of your new bathroom.`,
    shortDesc: 'Full design, supply & fit service',
    priceRange: p.bathroom,
    premium: true,
    icon: 'bathroom',
    image: '/images/services/bathroom.jpg',
    features: ['Free design consultation', 'Full project management', 'All plumbing & tiling included', 'Guaranteed workmanship'],
  },
  {
    key: 'boilerInstall',
    name: s.boilerInstall,
    slug: s.boilerInstallSlug,
    description: `New boiler installation by Gas Safe registered engineers. We supply and fit all major brands with extended warranties.`,
    shortDesc: 'Supply & fit all major brands',
    priceRange: p.boilerInstall,
    premium: true,
    icon: 'boiler',
    image: '/images/services/boiler-install.jpg',
    features: ['Gas Safe registered engineers', 'Up to 10-year manufacturer warranty', 'All major brands available', 'Finance options available'],
  },
  {
    key: 'boilerRepair',
    name: s.boilerRepair,
    slug: s.boilerRepairSlug,
    description: `Fast boiler repair and servicing. We diagnose and fix all makes and models, restoring your heating and hot water quickly.`,
    shortDesc: 'Fast diagnosis & repair, all brands',
    priceRange: p.boilerRepair,
    premium: false,
    icon: 'boiler-repair',
    image: '/images/services/boiler-repair.jpg',
    features: ['Same-day repairs available', 'All makes and models', 'Annual servicing plans', 'Gas Safe certified'],
  },
  {
    key: 'drains',
    name: s.drains,
    slug: s.drainsSlug,
    description: `Professional drain clearance and unblocking. Using the latest equipment including CCTV surveys and high-pressure jetting.`,
    shortDesc: 'CCTV surveys & high-pressure jetting',
    priceRange: p.drains,
    premium: false,
    icon: 'drain',
    image: '/images/services/drain.jpg',
    features: ['CCTV drain surveys', 'High-pressure water jetting', 'Root removal', 'Preventive maintenance plans'],
  },
  {
    key: 'leaks',
    name: s.leaks,
    slug: s.leaksSlug,
    description: `Advanced leak detection and repair using thermal imaging and acoustic equipment. We find and fix leaks with minimal disruption.`,
    shortDesc: 'Thermal imaging & non-invasive detection',
    priceRange: p.leaks,
    premium: false,
    icon: 'leak',
    image: '/images/services/leak.jpg',
    features: ['Non-invasive detection', 'Thermal imaging technology', 'Same-day repairs', 'Insurance report provided'],
  },
  {
    key: 'wetRoom',
    name: s.wetRoom,
    slug: s.wetRoomSlug,
    description: `Bespoke wet room design and installation. Fully waterproofed, stylish and accessible — perfect for modern homes.`,
    shortDesc: 'Bespoke design, fully waterproofed',
    priceRange: p.wetRoom,
    premium: true,
    icon: 'wetroom',
    image: '/images/services/wetroom.jpg',
    features: ['Tanking & waterproofing guaranteed', 'Underfloor heating compatible', 'Accessibility options', 'Premium tile finishes'],
  },
  {
    key: 'centralHeating',
    name: s.centralHeating,
    slug: s.centralHeatingSlug,
    description: `Full central heating system installation and upgrades. Radiators, pipework and controls — designed for maximum efficiency.`,
    shortDesc: 'Full system design & installation',
    priceRange: p.centralHeating,
    premium: true,
    icon: 'heating',
    image: '/images/services/heating.jpg',
    features: ['Full system design', 'Energy-efficient solutions', 'Smart thermostat installation', 'Magnetic filter installation'],
  },
  {
    key: 'underfloor',
    name: s.underfloor,
    slug: s.underfloorSlug,
    description: `Underfloor heating installation for new builds and renovations. Efficient, invisible warmth throughout your home.`,
    shortDesc: 'Efficient invisible warmth',
    priceRange: p.underfloor,
    premium: true,
    icon: 'underfloor',
    image: '/images/services/underfloor.jpg',
    features: ['Wet and electric systems', 'Compatible with all floor types', 'Zone control included', 'Reduces energy bills'],
  },
  {
    key: 'gasSafety',
    name: s.gasSafety,
    slug: s.gasSafetySlug,
    description: `Landlord gas safety certificates and inspections. Legal requirement for all rental properties — fast, reliable service.`,
    shortDesc: 'CP12 certificates for landlords',
    priceRange: p.gasSafety,
    premium: false,
    icon: 'gas',
    image: '/images/services/gas-safety.jpg',
    features: ['Same-day certificates', 'Multi-property discounts', 'Reminder service', 'Fully Gas Safe registered'],
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug)
}
