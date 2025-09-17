import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'i95g996l',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false
})

// Mapeo de servicios a imágenes existentes en Sanity
const serviceImageMapping = {
  'Evaluación y Terapia para TDAH': '8d05c94f9938bf8ff2a2cf573ada0ae9184f8d27-980x587.jpg', // ADHD_in_children.jpg
  'Terapia para la Ansiedad y el Estado de Ánimo': '7bb14312c41a2a34466d88fe09cd6577feb7c8f0-1248x832.png', // Generated Image September 16, 2025 - 12_45AM (2).png
  'Terapia para Trastornos de Personalidad': '63a7f562de961a7fd1e6ad2395e465368ed2084b-832x1248.png', // Adobe Express - file.png
  'Apoyo a Familias y Niños/as con TDAH': '249d8d0752f833b50dffcb4a674999162f31bb5c-1202x801.webp', // Diferencias-entre-TDAH-y-TEA.webp
  'Evaluación Psicológica Forense': '328659f70acded74abff54d8f2f722873391de0f-1248x832.png' // Generated Image September 16, 2025 - 1_05AM (2).png
}

async function connectImagesToServices() {
  try {
    console.log('🔗 Conectando imágenes existentes a los servicios...')
    
    // 1. Obtener todos los servicios
    const services = await client.fetch(`
      *[_type == "service"] {
        _id,
        title
      }
    `)
    
    console.log(`📋 Encontrados ${services.length} servicios`)
    
    // 2. Obtener todas las imágenes
    const images = await client.fetch(`
      *[_type == "sanity.imageAsset"] {
        _id,
        originalFilename,
        url
      }
    `)
    
    console.log(`🖼️  Encontradas ${images.length} imágenes`)
    
    // 3. Asociar imágenes a servicios
    for (const service of services) {
      const imageFilename = serviceImageMapping[service.title]
      
      if (imageFilename) {
        // Buscar la imagen por nombre de archivo
        const image = images.find(img => img.originalFilename === imageFilename)
        
        if (image) {
          console.log(`📸 Asociando imagen a: ${service.title}`)
          
          // Actualizar el servicio con la imagen
          await client
            .patch(service._id)
            .set({
              image: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: image._id
                }
              }
            })
            .commit()
          
          console.log(`✅ Imagen asociada: ${image.originalFilename}`)
        } else {
          console.log(`⚠️  No se encontró imagen para: ${service.title}`)
        }
      } else {
        console.log(`⚠️  No hay mapeo para: ${service.title}`)
      }
    }
    
    // 4. Conectar servicios al carrusel
    console.log('\n🎠 Conectando servicios al carrusel...')
    
    // Obtener la página de inicio
    const homePage = await client.fetch(`
      *[_type == "page" && slug.current == "inicio"][0] {
        _id,
        blocks[] {
          _type,
          _ref
        }
      }
    `)
    
    if (!homePage) {
      console.log('❌ No se encontró la página de inicio')
      return
    }
    
    // Encontrar el bloque de carrusel
    const carouselBlockIndex = homePage.blocks.findIndex(block => 
      block._type === 'serviceCarousel'
    )
    
    if (carouselBlockIndex === -1) {
      console.log('❌ No se encontró bloque de carrusel')
      return
    }
    
    const carouselBlock = homePage.blocks[carouselBlockIndex]
    
    // Crear referencias a los servicios
    const serviceReferences = services.map(service => ({
      _type: 'reference',
      _ref: service._id
    }))
    
    // Actualizar el carrusel
    await client
      .patch(carouselBlock._ref)
      .set({
        services: serviceReferences
      })
      .commit()
    
    console.log(`✅ Carrusel actualizado con ${serviceReferences.length} servicios`)
    
    // 5. Verificar resultado
    console.log('\n🔍 Verificando resultado...')
    
    const updatedServices = await client.fetch(`
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
    
    console.log('\n📊 Servicios actualizados:')
    updatedServices.forEach((service, i) => {
      console.log(`${i+1}. ${service.title}`)
      console.log(`   - Imagen: ${service.image?.asset?.url ? '✅' : '❌'}`)
    })
    
    console.log('\n🎉 ¡Proceso completado!')
    console.log('💡 Recarga la página para ver los cambios')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Necesitas un token de Sanity con permisos de escritura:')
      console.log('   export SANITY_TOKEN="tu-token-aqui"')
      console.log('   node connect-images.js')
    }
  }
}

connectImagesToServices()

