import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import { revalidatePath } from 'next/cache'

const secret = process.env.REVERIFY_WEBHOOK_SECRET || ''

async function handler(req) {
  const signature = req.headers[SIGNATURE_HEADER_NAME];
  // const body = await readBody(req) // Read the body into a string
  const body = await req.text()


  if (secret === '') {
    console.log(`Secret unset, failing signature check`);
    return new Response(`Webhook secret missing`, {
      status: 401,
    });
  }

  // Validate signature
  if (!(await isValidSignature(body, signature, secret))) {
    return new Response(`Invalid signature`, {
      status: 401,
    });
  }

  try {
    const jsonBody = JSON.parse(body)
    const pathToRevalidate = jsonBody.slug.current;

    console.log(`===== Revalidating: ${pathToRevalidate}`);

    // await res.revalidate(pathToRevalidate);
    revalidatePath(pathToRevalidate);

    return Response.json({ revalidated: true });
  } catch (err) {
    // Could not revalidate. The stale page will continue to be shown until
    // this issue is fixed.
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

async function readBody(readable) {
  const chunks = []
  console.log(typeof readable)
  console.log(readable)
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export { handler as POST}
