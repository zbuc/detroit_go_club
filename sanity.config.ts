import {defineConfig} from 'sanity'
import {dashboardTool} from "@sanity/dashboard"
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './sanity/schemas'
import {sanityConfig} from './sanity/env'

export default defineConfig({
  name: 'detroit-go-club',
  title: 'Detroit Go Club',

  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,

  plugins: [
    structureTool(),
    presentationTool({
      resolve: {
        locations: {
          page: {
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc: { title?: string; slug?: { current?: string } } | null) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/${doc?.slug?.current || ''}`,
                },
              ],
            }),
          },
          meetup: {
            select: {
              title: 'title',
            },
            resolve: (doc: { title?: string } | null) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/calendar`,
                },
              ],
            }),
          },
          siteSettings: {
            select: {
              title: 'title',
            },
            resolve: () => ({
              locations: [
                {
                  title: 'Home',
                  href: `/`,
                },
              ],
            }),
          },
        },
      },
      previewUrl: {
        draftMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    dashboardTool({}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
  
  // Studio-specific configuration
  studio: {
    components: {
      // You can customize the studio here if needed
    },
  },

  // Document actions and badges
  document: {
    // Configure document actions if needed
  },

  // Tools configuration
  tools: (prev) => {
    // You can filter or add tools here if needed
    return prev
  },
})