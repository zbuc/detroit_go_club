import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { draftMode } from 'next/headers'
import Navigation from '@/components/Navigation'
import { VisualEditing } from 'next-sanity'
import { SanityLive } from '@/lib/sanity'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        {isEnabled && <VisualEditing />}
        <SanityLive />
      </body>
    </html>
  )
}
