/*
  Añade un bloque `blockBlogPosts` a la página con slug "inicio".

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

async function fetchHomePage() {
  const query = `*[_type == "page" && slug.current == "inicio"][0]{ _id, _rev, title, blocks }`
  return client.fetch(query)
}

async function addBlockToHome() {
  const page = await fetchHomePage()
  if (!page?._id) {
    throw new Error('No se encontró la página con slug "inicio"')
  }

  const newBlock = {
    _type: 'blockBlogPosts',
    title: 'Últimos artículos',
    limit: 6,
    displayMode: 'grid',
    // Opcionalmente, puedes establecer una categoría o destacados aquí
    // category: { _type: 'reference', _ref: '...' },
    // featuredPosts: [{ _type: 'reference', _ref: '...' }]
  }

  const nextBlocks = Array.isArray(page.blocks) ? [...page.blocks, newBlock] : [newBlock]

  await client
    .patch(page._id)
    .set({ blocks: nextBlocks })
    .commit({ autoGenerateArrayKeys: true })

  return { updated: true }
}

async function main() {
  try {
    const res = await addBlockToHome()
    console.log('Bloque añadido a Inicio:', res)
  } catch (err) {
    console.error('Error añadiendo bloque a Inicio:', err)
    process.exit(1)
  }
}

main()
