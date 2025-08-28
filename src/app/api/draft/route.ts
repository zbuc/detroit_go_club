import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

const valid_secret = process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN || ''

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const secret = searchParams.get('secret')

  // Check the secret and next parameters
  if (secret !== valid_secret) {
    return new Response('Invalid token', { status: 401 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(slug || '/')
}
