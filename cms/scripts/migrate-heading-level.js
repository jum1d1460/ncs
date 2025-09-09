/*
  Establece headingLevel='h2' en secciones de contenido que tengan title pero no headingLevel.

  Requiere variables de entorno:
  - SANITY_PROJECT_ID
  - SANITY_DATASET (por defecto: production)
  - SANITY_API_VERSION (por defecto: 2024-03-18)
  - SANITY_WRITE_TOKEN (token con permisos de escritura)
*/

const { createClient } = require('@sanity/client')

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || process.env.PUBLIC_SANITY_API_VERSION || '2024-03-18'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId) {
  console.error('Falta SANITY_PROJECT_ID')
  process.exit(1)
}
if (!token) {
  console.error('Falta SANITY_WRITE_TOKEN (token de escritura)')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

async function fetchPagesWithBlocks() {
  const query = `*[_type == "page" && defined(blocks[])]{ _id, _rev, blocks }`
  return client.fetch(query)
}

function buildPatches(pages) {
  const patches = []
  for (const page of pages) {
    const blocks = Array.isArray(page.blocks) ? page.blocks : []
    const newBlocks = blocks.map((b) => {
      if (b?._type === 'blockContentSection') {
        const hasTitle = typeof b.title === 'string' && b.title.trim().length > 0
        const hasHeading = typeof b.headingLevel === 'string' && b.headingLevel
        if (hasTitle && !hasHeading) {
          return { ...b, headingLevel: 'h2' }
        }
      }
      return b
    })
    if (JSON.stringify(newBlocks) !== JSON.stringify(blocks)) {
      patches.push({ id: page._id, patch: { set: { blocks: newBlocks } } })
    }
  }
  return patches
}

async function applyPatches(patches) {
  if (!patches.length) return 0
  const tx = client.transaction()
  for (const { id, patch } of patches) {
    tx.patch(id, patch)
  }
  await tx.commit({ autoGenerateArrayKeys: true })
  return patches.length
}

async function main() {
  try {
    const pages = await fetchPagesWithBlocks()
    if (!pages?.length) {
      console.log('No hay páginas con bloques a revisar')
      return
    }
    const patches = buildPatches(pages)
    if (!patches.length) {
      console.log('No hay cambios necesarios')
      return
    }
    const applied = await applyPatches(patches)
    console.log(`Migración completada. Documentos actualizados: ${applied}`)
  } catch (err) {
    console.error('Error en migración:', err)
    process.exit(1)
  }
}

main()


