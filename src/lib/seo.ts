import { locale } from './locale'

export function generateServiceTownSchema(service: string, town: string, priceRange: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `${service} in ${town}`,
        provider: {
          '@type': 'LocalBusiness',
          name: locale.siteName,
          telephone: locale.phone,
          url: `https://${locale.domain}`,
          areaServed: { '@type': 'City', name: town },
          priceRange: priceRange,
        },
        areaServed: { '@type': 'City', name: town },
        description: `Professional ${service.toLowerCase()} service in ${town}. Available 24/7. ${locale.certification}.`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${locale.domain}` },
          { '@type': 'ListItem', position: 2, name: service, item: `https://${locale.domain}/${slug}` },
          { '@type': 'ListItem', position: 3, name: town },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How much does ${service.toLowerCase()} cost in ${town}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${service} in ${town} typically costs ${priceRange}. Contact us for a free, no-obligation quote.`,
            },
          },
          {
            '@type': 'Question',
            name: `Do you offer emergency ${service.toLowerCase()} in ${town}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, we provide 24/7 emergency plumbing services across ${town} and surrounding areas. Call ${locale.phone} for immediate assistance.`,
            },
          },
        ],
      },
    ],
  }
}

export function generateHomepageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: locale.siteName,
    description: locale.tagline,
    url: `https://${locale.domain}`,
    telephone: locale.phone,
    areaServed: { '@type': 'Country', name: locale.country === 'uk' ? 'United Kingdom' : 'United States' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2,847',
      bestRating: '5',
    },
  }
}
