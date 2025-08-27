import {defineConfig} from 'sanity'
import {dashboardTool} from "@sanity/dashboard"
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemas'
import {sanityConfig} from './sanity/env'

export default defineConfig({
  name: 'detroit-go-club',
  title: 'Detroit Go Club',

  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,

  plugins: [structureTool(), dashboardTool({}), visionTool()],

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
})