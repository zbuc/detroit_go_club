import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/lib/sanity'
import { SiteSettings, Page } from '@/types'
import { portableTextComponents } from '@/components/PortableTextComponents'

async function getHomepageData(): Promise<{
  homepage: Page | null
  siteSettings: SiteSettings | null
}> {
  try {
    const homepageQuery = `*[_type == "page" && isHomepage == true][0]`
    const siteSettingsQuery = `*[_type == "siteSettings"][0]`

    const [{ data: homepage }, { data: siteSettings }] = await Promise.all([
      sanityFetch({
        query: homepageQuery,
        tags: ['page'],
      }),
      sanityFetch({
        query: siteSettingsQuery,
        tags: ['siteSettings'],
      }),
    ])

    return { homepage, siteSettings }
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
    return { homepage: null, siteSettings: null }
  }
}

export default async function Home() {
  const { homepage, siteSettings } = await getHomepageData()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white-900 mb-4">
          {homepage?.title || 'Welcome to the Detroit Go Club'}
        </h1>

        {homepage?.welcomeMessage ? (
          <div className="text-lg text-white-700 mb-8 prose prose-lg mx-auto">
            <PortableText value={homepage.welcomeMessage} components={portableTextComponents} />
          </div>
        ) : (
          <div className="text-lg text-white-700 mb-8 prose prose-lg mx-auto">
            <p>
              Welcome to the Detroit Go Club! Join us for weekly games, friendly tournaments, and a
              community dedicated to the ancient and strategic game of Go.
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Our Club</h2>

          {homepage?.clubDescription ? (
            <div className="text-gray-700 prose">
              <PortableText value={homepage.clubDescription} components={portableTextComponents} />
            </div>
          ) : (
            <div className="text-gray-700 space-y-4">
              <p>
                The Detroit Go Club is a welcoming community for players of all skill levels.
                Whether you&apos;re a complete beginner or an experienced player, you&apos;ll find
                friendly games and opportunities to improve your Go skills.
              </p>
              <p>
                We meet regularly for casual games, study sessions, and occasional tournaments. Our
                members range from curious newcomers to dan-level players, creating a rich learning
                environment for everyone.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>

          {homepage?.gettingStarted ? (
            <div className="text-gray-700 prose">
              <PortableText value={homepage.gettingStarted} components={portableTextComponents} />
            </div>
          ) : (
            <div className="text-gray-700 space-y-4">
              <p>
                New to Go? No problem! We welcome beginners and are happy to teach the rules and
                basic strategies.
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>Check our calendar for upcoming meetups</li>
                <li>Follow us on Instagram for updates and photos</li>
                <li>Bring a friend and learn together</li>
                <li>Equipment provided - just bring yourself!</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-700">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            {homepage?.instagramCalloutHeader ? (
              <PortableText
                value={homepage.instagramCalloutHeader}
                components={portableTextComponents}
              />
            ) : (
              'Follow Us on Instagram'
            )}
          </h3>
          {homepage?.instagramCallout ? (
            <PortableText value={homepage.instagramCallout} components={portableTextComponents} />
          ) : (
            <p className="text-blue-700 mb-4">
              See when the next meetup is, check out photos from past events, and connect with
              fellow Go enthusiasts!
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <a
              href={`https://instagram.com/${siteSettings?.instagramHandle?.replace('@', '') || 'detroit_go_club'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {siteSettings?.instagramHandle || '@detroit_go_club'}
            </a>
            <a
              href={`https://baduk.club/club/detroit`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              baduk.club/club/detroit
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
