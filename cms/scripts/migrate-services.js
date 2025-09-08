/*
  Migración de servicios a nuevo modelo:
  - durationMinutes (number) -> duration { mode: 'fixed', value }
  - priceType ('fixed'|'consult') + price (number) -> price { mode, value? }
  - weight -> asignar 100 si no existe

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

async function fetchServices() {
  const query = `*[_type == "service"]{ _id, _rev, title, durationMinutes, priceType, price, weight }`
  return client.fetch(query)
}

function buildPatches(docs) {
  return docs.map((doc) => {
    const patch = { set: {} }

    // duration -> object
    if (typeof doc.durationMinutes === 'number') {
      patch.set.duration = { mode: 'fixed', value: doc.durationMinutes }
      patch.set.durationMinutes = null
    }

    // price -> object
    if (doc.priceType === 'fixed') {
      if (typeof doc.price === 'number') {
        patch.set.price = { mode: 'fixed', value: doc.price, currency: 'EUR' }
      } else {
        patch.set.price = { mode: 'fixed', value: 0, currency: 'EUR' }
      }
    } else if (doc.priceType === 'consult') {
      // Sin precio definido
      patch.set.price = { mode: 'fixed', value: 0, currency: 'EUR' }
    }

    // limpiar antiguos
    if (typeof doc.priceType !== 'undefined') patch.set.priceType = null
    if (typeof doc.price !== 'undefined') patch.set.price = patch.set.price || null

    // weight por defecto
    if (typeof doc.weight !== 'number') {
      patch.set.weight = 100
    }

    return { id: doc._id, patch }
  })
}

async function applyPatches(patches) {
  if (!patches.length) return 0
  const tx = client.transaction()
  patches.forEach(({ id, patch }) => {
    tx.patch(id, patch)
  })
  await tx.commit({ autoGenerateArrayKeys: true })
  return patches.length
}

async function main() {
  try {
    const services = await fetchServices()
    if (!services?.length) {
      console.log('No hay servicios para migrar')
      return
    }
    const patches = buildPatches(services)
    const applied = await applyPatches(patches)
    console.log(`Migración completada. Documentos actualizados: ${applied}`)
  } catch (err) {
    console.error('Error en migración:', err)
    process.exit(1)
  }
}

main()


