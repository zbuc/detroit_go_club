import { PortableTextBlock } from '@portabletext/types'

export interface Page {
  _id: string
  title: string
  slug: {
    current: string
  }
  isHomepage?: boolean
  welcomeMessage?: PortableTextBlock[]
  instagramCallout?: PortableTextBlock[]
  instagramCalloutHeader?: PortableTextBlock[]
  clubDescription?: PortableTextBlock[]
  gettingStarted?: PortableTextBlock[]
  content: PortableTextBlock[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface Meetup {
  _id: string
  title: string
  date: string
  location?: string
  description?: PortableTextBlock[]
  maxParticipants?: number
  registrationUrl?: string
  isCompleted: boolean
}

export interface SiteSettings {
  _id: string
  title: string
  instagramHandle: string
  contactEmail?: string
  logo?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  favicon?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
}
