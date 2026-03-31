import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
  },
  env: {
    NEXT_PUBLIC_COUNTRY: process.env.COUNTRY || 'uk',
    NEXT_PUBLIC_SITE_NAME: process.env.COUNTRY === 'us' ? 'Plumber247 Near Me' : 'PlumberNearMe247',
    NEXT_PUBLIC_DOMAIN: process.env.COUNTRY === 'us' ? 'plumber247nearme.com' : 'plumbernearme247.co.uk',
  },
}

export default nextConfig
