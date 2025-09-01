import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { draftMode } from 'next/headers'
import Navigation from '@/components/Navigation'
import { VisualEditing } from 'next-sanity'
import { client, sanityFetch, SanityLive } from '@/lib/sanity'
import { ConditionalNavigation } from '@/components/ConditionalNavigation'
import { ConditionalStyles } from '@/components/ConditionalStyles'
import imageUrlBuilder from '@sanity/image-url'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import { generateWebSiteSchema } from '@/lib/structured-data'

const inter = Inter({ subsets: ['latin'] })

const builder = imageUrlBuilder(client)

export const metadata: Metadata = {
  title: 'Detroit Go Club',
  description:
    'Join the Detroit Go Club for casual monthly meetups and community. Learn and play the ancient game of Go in Detroit, Michigan.',
  keywords: ['go', 'weiqi', 'baduk', 'detroit', 'board game', 'strategy', 'club'],
  openGraph: {
    title: 'Detroit Go Club',
    description: 'Join the Detroit Go Club for casual monthly meetups and community.',
    url: 'https://detroitgo.club',
    siteName: 'Detroit Go Club',
    type: 'website',
  },
}

async function getSiteSettings() {
  try {
    const query = `*[_type == "siteSettings"][0]{
      businessInfo,
      socialMedia,
      favicon,
      background
    }`
    const { data } = await sanityFetch({
      query,
      tags: ['siteSettings'],
    })
    return data
  } catch (error) {
    console.error('Failed to fetch site settings for structured data:', error)
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const structuredData = [generateWebSiteSchema()].filter(Boolean)

  const settings = await getSiteSettings()
  const faviconImageUrl = settings?.favicon
    ? builder.image(settings?.favicon).url()?.toString()
    : '/favicon.svg'
  const backgroundImageUrl = settings?.background
    ? builder.image(settings?.background).url()?.toString()
    : undefined

  return (
    <html lang="en">
      <head>
        {structuredData.length > 0 && <StructuredData data={structuredData} />}
        <link rel="icon" href={faviconImageUrl} type="image/svg+xml" />
        {/* Conditional critical CSS for faster FCP */}
        <ConditionalStyles />
      </head>
      <body className={inter.className}>
        <ConditionalNavigation>
          <Navigation />
        </ConditionalNavigation>
        {backgroundImageUrl && (
          <main
            style={{
              backgroundImage: `linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 80%), url('${backgroundImageUrl}')`,
            }}
            className={`bg-cover bg-center bg-repeat bg-fixed w-full`}
          >
            {children}
          </main>
        )}
        {!backgroundImageUrl && <main>{children}</main>}
        {isEnabled && <VisualEditing />}
        <SanityLive />
      </body>
    </html>
  )
}
