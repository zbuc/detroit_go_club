export interface Page {
  _id: string
  title: string
  slug: {
    current: string
  }
  content: any[]
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
  description?: any[]
  maxParticipants?: number
  registrationUrl?: string
  isCompleted: boolean
}

export interface SiteSettings {
  _id: string
  title: string
  description?: string
  welcomeMessage?: any[]
  clubDescription?: any[]
  instagramHandle: string
  contactEmail?: string
  logo?: any
}