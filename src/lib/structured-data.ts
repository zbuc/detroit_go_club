import { client } from './sanity'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://detroitgo.club/#website',
    url: 'https://detroitgo.club',
    name: 'Detroit Go Club',
    description: 'Join the Detroit Go Club for casual monthly meetups and community.',
    publisher: {
      '@id': 'https://detroitgo.club/#business',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://detroitgo.club/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
