import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/lib/sanity'
import { Page } from '@/types'
import { portableTextComponents } from '@/components/PortableTextComponents'
import { notFound } from 'next/navigation'

async function getPage(slug: string): Promise<Page | null> {
  try {
    const query = `*[_type == "page" && slug.current == $slug && !isHomepage][0]`
    const { data } = await sanityFetch({
      query,
      params: { slug },
      tags: ['page'],
    })
    return data
  } catch (error) {
    console.error('Failed to fetch page:', error)
    return null
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>

        {page.content && (
          <div className="prose prose-lg max-w-none">
            <PortableText value={page.content} components={portableTextComponents} />
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    return {}
  }

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
  }
}
