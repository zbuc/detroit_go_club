import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/lib/sanity'
import { Page } from '@/types'
import { portableTextComponents } from '@/components/PortableTextComponents'

async function getRulesPage(): Promise<Page | null> {
  try {
    const query = `*[_type == "page" && slug.current == "rules"][0]`
    const { data } = await sanityFetch({
      query,
      tags: ['page'],
    })
    return data
  } catch (error) {
    console.error('Failed to fetch rules page:', error)
    return null
  }
}

export default async function RulesPage() {
  const page = await getRulesPage()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* <div className="prose prose-lg max-w-none"> */}

      <div className="grid md:grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Our Club</h2> */}

          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {page?.title || 'Go Rules & Guidelines'}
          </h1>

          {page?.content ? (
            <PortableText value={page.content} components={portableTextComponents} />
          ) : (
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Basic Rules of Go</h2>
                <p className="text-gray-700 mb-4">
                  Go is played on a grid of intersecting lines. The standard board size is 19×19,
                  though beginners often start with smaller boards (13×13 or 9×9).
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Objective</h3>
                <p className="text-gray-700 mb-4">
                  The goal is to control more territory than your opponent by surrounding empty
                  intersections with your stones.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Basic Play</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Players alternate placing stones on empty intersections</li>
                  <li>Once placed, stones cannot be moved (except when captured)</li>
                  <li>Stones are captured when completely surrounded</li>
                  <li>The game ends when both players pass consecutively</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Club Guidelines</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Etiquette</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Bow or acknowledge your opponent before and after games</li>
                  <li>Play at a reasonable pace - be considerate of your opponent&apos;s time</li>
                  <li>Keep conversation quiet during games to avoid disturbing others</li>
                  <li>Help newer players learn the rules and basic strategies</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Tournament Rules</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Swiss system pairing for most tournaments</li>
                  <li>Standard time controls: 60 minutes + 30 seconds per move</li>
                  <li>Handicap games based on rank difference</li>
                  <li>All disputes resolved by tournament director</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Equipment</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Club provides boards, stones, and clocks</li>
                  <li>Members welcome to bring their own equipment</li>
                  <li>Please handle equipment with care</li>
                  <li>Report any damaged equipment to club organizers</li>
                </ul>
              </section>

              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Resources</h2>
                <p className="text-gray-700 mb-4">
                  New to Go? Here are some great resources to get you started:
                </p>

                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    <strong>Online:</strong> Online Go Server (OGS), KGS Go Server
                  </li>
                  <li>
                    <strong>Books:</strong> &ldquo;The Complete Beginner&apos;s Guide to Go&rdquo;
                    by Cho Chikun
                  </li>
                  <li>
                    <strong>Apps:</strong> SmartGo, Go Books, Tsumego Pro
                  </li>
                  <li>
                    <strong>Videos:</strong> In Sente YouTube channel, Nick Sibicky Go Lectures
                  </li>
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
