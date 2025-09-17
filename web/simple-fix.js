import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'i95g996l',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false
})

async function simpleFix() {
  try {
    console.log('🔍 Verificando estado actual...')
    
    // 1. Verificar servicios
    const services = await client.fetch(`
      *[_type == "service"] {
        _id,
        title,
        image {
          asset->{
            _id,
            url
          }
        }
      }
    `)
    
    console.log(`\n📋 Servicios encontrados: ${services.length}`)
    services.forEach((service, i) => {
      console.log(`${i+1}. ${service.title}`)
      console.log(`   - Imagen: ${service.image?.asset?.url ? '✅' : '❌'}`)
    })
    
    // 2. Verificar imágenes disponibles
    const images = await client.fetch(`
      *[_type == "sanity.imageAsset"] {
        _id,
        originalFilename,
        url
      } | order(_createdAt desc) [0...5]
    `)
    
    console.log(`\n🖼️  Imágenes disponibles (últimas 5):`)
    images.forEach((img, i) => {
      console.log(`${i+1}. ${img.originalFilename}`)
      console.log(`   - ID: ${img._id}`)
    })
    
    // 3. Verificar carrusel
    const homePage = await client.fetch(`
      *[_type == "page" && slug.current == "inicio"][0] {
        blocks[] {
          _type,
          _ref,
          services[]->{
            _id,
            title
          }
        }
      }
    `)
    
    const carouselBlock = homePage.blocks?.find(block => block._type === 'serviceCarousel')
    
    console.log(`\n🎠 Estado del carrusel:`)
    if (carouselBlock) {
      console.log(`- Servicios conectados: ${carouselBlock.services?.length || 0}`)
      if (carouselBlock.services && carouselBlock.services.length > 0) {
        carouselBlock.services.forEach((service, i) => {
          console.log(`  ${i+1}. ${service.title}`)
        })
      }
    } else {
      console.log('- No se encontró bloque de carrusel')
    }
    
    console.log(`\n💡 Para solucionar el problema:`)
    console.log(`1. Ve a Sanity Studio: https://i95g996l.sanity.studio`)
    console.log(`2. Navega a Content > Services`)
    console.log(`3. Para cada servicio, haz clic en "Image" y selecciona una imagen`)
    console.log(`4. Ve a Content > Pages > Inicio`)
    console.log(`5. Encuentra el bloque "Service Carousel"`)
    console.log(`6. En "Services", haz clic en "Add item" y selecciona todos los servicios`)
    console.log(`7. Guarda los cambios`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

simpleFix()

