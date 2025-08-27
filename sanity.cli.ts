import {defineCliConfig} from 'sanity/cli'
import {sanityConfig} from './sanity/env'

export default defineCliConfig({
  api: {
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
  
  /**
   * Configuration for `sanity dev` and `sanity build`
   */
  server: {
    hostname: 'localhost',
    port: 3333
  },
})