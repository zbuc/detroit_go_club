import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Detroit Go Club',
  description: 'Join the Detroit Go Club for weekly games, tournaments, and community events. Learn and play the ancient game of Go in Detroit, Michigan.',
  keywords: ['go', 'weiqi', 'baduk', 'detroit', 'board game', 'strategy', 'club'],
  openGraph: {
    title: 'Detroit Go Club',
    description: 'Join the Detroit Go Club for weekly games, tournaments, and community events.',
    url: 'https://detroitgo.club',
    siteName: 'Detroit Go Club',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}