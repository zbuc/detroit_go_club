import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

const secret = process.env.REVALIDATE_WEBHOOK_SECRET || ''

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) || ''
  const body = await req.text()

  if (secret === '') {
    console.log(`Secret unset, failing signature check`)
    return new Response(`Webhook secret missing`, {
      status: 401,
    })
  }

  // Validate signature
  if (!(await isValidSignature(body, signature, secret))) {
    return new Response(`Invalid signature`, {
      status: 401,
    })
  }

  // Check the secret and next parameters
  if (secret !== process.env.SANITY_API_READ_TOKEN) {
    return new Response('Invalid token', { status: 401 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(slug || '/')
}
