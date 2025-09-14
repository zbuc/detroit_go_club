import { sanityFetch } from '@/lib/sanity'
import { SiteSettings } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/lib/sanity'

async function getNavigationData(): Promise<{
  siteSettings: SiteSettings | null
}> {
  try {
    const siteSettingsQuery = `*[_type == "siteSettings"][0]`

    const [{ data: siteSettings }] = await Promise.all([
      sanityFetch({
        query: siteSettingsQuery,
        tags: ['siteSettings'],
      }),
    ])

    return { siteSettings }
  } catch (error) {
    console.error('Failed to fetch navigation data:', error)
    return { siteSettings: null }
  }
}

export default async function Navigation() {
  const { siteSettings } = await getNavigationData()
  const builder = imageUrlBuilder(client)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
            {typeof siteSettings?.logo === 'object' ? (
              <Image
                src={builder.image(siteSettings.logo).url()}
                alt="Detroit Go Club Logo"
                width={48}
                height={48}
                className="h-8 w-auto sm:h-10 lg:h-12"
              />
            ) : (
              <span>Detroit Go Club</span>
            )}
          </Link>

          <div className="flex space-x-2 sm:space-x-4 lg:space-x-8">
            <Link
              href="/rules"
              className="text-xs sm:text-sm lg:text-base text-gray-700 hover:text-gray-900 transition-colors"
            >
              Go Resources
            </Link>
            <Link
              href="/meetup-information"
              className="text-xs sm:text-sm lg:text-base text-gray-700 hover:text-gray-900 transition-colors"
            >
              Club Info
            </Link>
            <Link
              href="/calendar"
              className="text-xs sm:text-sm lg:text-base text-gray-700 hover:text-gray-900 transition-colors"
            >
              Calendar
            </Link>
            <a
              href="https://instagram.com/detroit_go_club"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm lg:text-base text-gray-700 hover:text-gray-900 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://baduk.club/club/detroit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm lg:text-base text-gray-700 hover:text-gray-900 transition-colors"
            >
              baduk.club
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
