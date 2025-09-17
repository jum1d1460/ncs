import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'i95g996l',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false
})

// Imágenes de ejemplo para servicios de psicología
const serviceImages = [
  {
    title: 'Evaluación y Terapia para TDAH',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&crop=faces',
    alt: 'Terapia para TDAH'
  },
  {
    title: 'Terapia para la Ansiedad y el Estado de Ánimo',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=faces',
    alt: 'Terapia para ansiedad'
  },
  {
    title: 'Terapia para Trastornos de Personalidad',
    imageUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=800&h=600&fit=crop&crop=faces',
    alt: 'Terapia para trastornos de personalidad'
  },
  {
    title: 'Apoyo a Familias y Niños/as con TDAH',
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop&crop=faces',
    alt: 'Apoyo familiar para TDAH'
  },
  {
    title: 'Evaluación Psicológica Forense',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop&crop=faces',
    alt: 'Evaluación psicológica forense'
  }
]

async function uploadImageToSanity(imageUrl, title) {
  try {
    console.log(`📸 Subiendo imagen para: ${title}`)
    
    // Descargar la imagen
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Error descargando imagen: ${response.status}`)
    }
    
    const buffer = await response.arrayBuffer()
    
    // Subir a Sanity
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      title: title
    })
    
    console.log(`✅ Imagen subida: ${asset._id}`)
    return asset
  } catch (error) {
    console.error(`❌ Error subiendo imagen para ${title}:`, error.message)
    return null
  }
}

async function fixCarousel() {
  try {
    console.log('🔧 Iniciando reparación del carrusel...')
    
    // 1. Obtener todos los servicios
    console.log('\n📋 Obteniendo servicios...')
    const services = await client.fetch(`
      *[_type == "service"] {
        _id,
        title,
        description,
        slug
      } | order(order asc)
    `)
    
    console.log(`✅ Encontrados ${services.length} servicios`)
    
    // 2. Agregar imágenes a los servicios
    console.log('\n🖼️  Agregando imágenes a los servicios...')
    const serviceImageMap = new Map()
    
    for (const service of services) {
      const imageData = serviceImages.find(img => img.title === service.title)
      
      if (imageData) {
        const asset = await uploadImageToSanity(imageData.imageUrl, service.title)
        
        if (asset) {
          // Actualizar el servicio con la imagen
          await client
            .patch(service._id)
            .set({
              image: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: asset._id
                }
              }
            })
            .commit()
          
          serviceImageMap.set(service._id, asset._id)
          console.log(`✅ Imagen agregada a: ${service.title}`)
        }
      } else {
        console.log(`⚠️  No se encontró imagen para: ${service.title}`)
      }
    }
    
    // 3. Obtener la página de inicio
    console.log('\n📄 Obteniendo página de inicio...')
    const homePage = await client.fetch(`
      *[_type == "page" && slug.current == "inicio"][0] {
        _id,
        blocks[] {
          _type,
          _ref,
          ...
        }
      }
    `)
    
    if (!homePage) {
      console.log('❌ No se encontró la página de inicio')
      return
    }
    
    // 4. Encontrar el bloque de carrusel
    const carouselBlockIndex = homePage.blocks.findIndex(block => 
      block._type === 'serviceCarousel'
    )
    
    if (carouselBlockIndex === -1) {
      console.log('❌ No se encontró bloque de carrusel en la página')
      return
    }
    
    const carouselBlock = homePage.blocks[carouselBlockIndex]
    console.log(`✅ Bloque de carrusel encontrado: ${carouselBlock._ref}`)
    
    // 5. Actualizar el bloque de carrusel con los servicios
    console.log('\n🔗 Conectando servicios al carrusel...')
    
    const serviceReferences = services.map(service => ({
      _type: 'reference',
      _ref: service._id
    }))
    
    await client
      .patch(carouselBlock._ref)
      .set({
        services: serviceReferences
      })
      .commit()
    
    console.log(`✅ Carrusel actualizado con ${serviceReferences.length} servicios`)
    
    // 6. Verificar el resultado
    console.log('\n🔍 Verificando resultado...')
    const updatedCarousel = await client.fetch(`
      *[_id == "${carouselBlock._ref}"][0] {
        title,
        subtitle,
        services[]->{
          _id,
          title,
          image {
            asset->{
              _id,
              url
            }
          }
        }
      }
    `)
    
    console.log(`\n🎉 ¡Carrusel reparado exitosamente!`)
    console.log(`📊 Servicios en el carrusel: ${updatedCarousel.services?.length || 0}`)
    
    if (updatedCarousel.services && updatedCarousel.services.length > 0) {
      updatedCarousel.services.forEach((service, index) => {
        console.log(`${index + 1}. ${service.title}`)
        console.log(`   - Imagen: ${service.image?.asset?.url ? '✅' : '❌'}`)
      })
    }
    
    console.log('\n💡 Recarga la página para ver los cambios')
    
  } catch (error) {
    console.error('❌ Error reparando carrusel:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n💡 Necesitas configurar un token de Sanity:')
      console.log('   export SANITY_TOKEN="tu-token-aqui"')
      console.log('   node fix-carousel.js')
    }
  }
}

fixCarousel()

