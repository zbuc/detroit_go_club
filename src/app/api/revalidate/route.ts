import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { revalidatePath } from 'next/cache'

const secret = process.env.REVALIDATE_WEBHOOK_SECRET || ''

async function handler(req: Request) {
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

  try {
    const jsonBody = JSON.parse(body)
    console.log('Webhook payload:', JSON.stringify(jsonBody, null, 2))

    // Handle different document types
    const pathsToRevalidate: string[] = []

    if (jsonBody._type === 'siteSettings') {
      // Site settings affect all pages
      pathsToRevalidate.push('/calendar')
      pathsToRevalidate.push('/rules')
      pathsToRevalidate.push('/contact')
    } else if (jsonBody.slug?.current) {
      // Fallback for other document types with slugs
      pathsToRevalidate.push(`/${jsonBody.slug.current}`)
    } else {
      // No specific path, revalidate homepage
      pathsToRevalidate.push('/')
    }

    console.log(`===== Revalidating paths:`, pathsToRevalidate)

    // Revalidate all relevant paths
    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    return Response.json({
      revalidated: true,
      paths: pathsToRevalidate,
      documentType: jsonBody._type,
    })
  } catch (err) {
    // Could not revalidate. The stale page will continue to be shown until
    // this issue is fixed.
    console.error('Revalidation error:', err)
    return new Response(`Error while revalidating`, {
      status: 500,
    })
  }
}

// Next.js will by default parse the body, which can lead to invalid signatures
export const config = {
  api: {
    bodyParser: false,
  },
}

export { handler as POST }
