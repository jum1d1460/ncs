#!/usr/bin/env node

/**
 * Script de migración para agregar títulos a carruseles de servicios existentes
 * 
 * Este script busca todos los documentos que contienen bloques serviceCarousel
 * sin título y les asigna un título temporal basado en el contexto.
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'i95g996l',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN
})

async function migrateServiceCarouselTitles() {
  console.log('🔍 Buscando carruseles de servicios sin título...')
  
  try {
    // Buscar todos los documentos que contienen bloques serviceCarousel
    const documents = await client.fetch(`
      *[_type in ["post", "page"] && defined(blocks)] {
        _id,
        _type,
        title,
        "blocks": blocks[defined(_type) && _type == "serviceCarousel"]
      }
    `)
    
    let migratedCount = 0
    const migrationLog = []
    
    for (const doc of documents) {
      if (!doc.blocks || doc.blocks.length === 0) continue
      
      const blocksToUpdate = []
      
      for (let i = 0; i < doc.blocks.length; i++) {
        const block = doc.blocks[i]
        
        // Verificar si el bloque no tiene título
        if (!block.title || block.title.trim() === '') {
          // Generar título temporal
          const tempTitle = generateTemporaryTitle(doc.title, i + 1)
          
          blocksToUpdate.push({
            index: i,
            oldTitle: block.title,
            newTitle: tempTitle
          })
        }
      }
      
      if (blocksToUpdate.length > 0) {
        // Actualizar el documento con los nuevos títulos
        const updatedBlocks = [...doc.blocks]
        
        for (const update of blocksToUpdate) {
          updatedBlocks[update.index] = {
            ...updatedBlocks[update.index],
            title: update.newTitle
          }
        }
        
        await client
          .patch(doc._id)
          .set({ blocks: updatedBlocks })
          .commit()
        
        migratedCount += blocksToUpdate.length
        
        migrationLog.push({
          documentId: doc._id,
          documentTitle: doc.title,
          updates: blocksToUpdate
        })
        
        console.log(`✅ Actualizado documento: ${doc.title} (${blocksToUpdate.length} carruseles)`)
      }
    }
    
    console.log(`\n📊 Resumen de migración:`)
    console.log(`   - Documentos procesados: ${documents.length}`)
    console.log(`   - Carruseles migrados: ${migratedCount}`)
    
    if (migrationLog.length > 0) {
      console.log(`\n📝 Detalles de migración:`)
      migrationLog.forEach(log => {
        console.log(`   Documento: ${log.documentTitle} (${log.documentId})`)
        log.updates.forEach(update => {
          console.log(`     - Carrusel ${update.index + 1}: "${update.oldTitle || '(sin título)'}" → "${update.newTitle}"`)
        })
      })
    }
    
    console.log(`\n⚠️  IMPORTANTE: Revisa los títulos generados en Sanity Studio y ajústalos según sea necesario.`)
    console.log(`   Los títulos temporales son solo para evitar errores de validación.`)
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  }
}

function generateTemporaryTitle(documentTitle, carouselIndex) {
  const baseTitle = documentTitle ? `Servicios - ${documentTitle}` : 'Carrusel de Servicios'
  
  if (carouselIndex === 1) {
    return baseTitle
  } else {
    return `${baseTitle} ${carouselIndex}`
  }
}

// Ejecutar migración
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateServiceCarouselTitles()
    .then(() => {
      console.log('\n🎉 Migración completada exitosamente!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error)
      process.exit(1)
    })
}

export { migrateServiceCarouselTitles }
