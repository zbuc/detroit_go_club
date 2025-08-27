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
  apiVersion: sanityConfig.apiVersion,

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

  // Document actions and badges
  document: {
    // Configure document actions if needed
  },

  // Tools configuration
  tools: (prev, {schema}) => {
    // You can filter or add tools here if needed
    return prev
  },
})