import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_PROJECT_ID || 'i95g996l'
const dataset = process.env.SANITY_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
