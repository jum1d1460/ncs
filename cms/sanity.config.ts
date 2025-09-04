import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {StructureResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_PROJECT_ID || 'i95g996l'
const dataset = process.env.SANITY_DATASET || 'production'

const singletonTypes = new Set(['globalSettings'])

const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Global Settings')
        .schemaType('globalSettings')
        .child(
          S.document()
            .schemaType('globalSettings')
            .documentId('globalSettings')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => !singletonTypes.has(String(listItem.getId()))),
    ])

export default defineConfig({
  name: 'default',
  title: 'NCS Psicóloga Zaragoza',

  projectId,
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
})
