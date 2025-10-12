/**
 * Script de migración para actualizar el campo del mapa en blockContact
 * Migra de map.embedUrl a map.mapUrl
 * 
 * Este script es necesario si ya tienes bloques de contacto con mapas en Sanity
 * usando el campo antiguo embedUrl.
 * 
 * Uso:
 * node cms/scripts/migrate-map-field.js
 */

import { createClient } from '@sanity/client';

// Configurar cliente de Sanity (usa las variables de entorno o reemplaza con tus valores)
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'tu-project-id',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN, // Necesitas un token con permisos de escritura
  useCdn: false,
  apiVersion: '2024-01-01'
});

async function migrateMapFields() {
  console.log('🔍 Buscando páginas con bloques de contacto...');
  
  try {
    // Buscar todas las páginas que tengan bloques de contacto con el campo antiguo
    const pages = await client.fetch(`
      *[_type == "page"] {
        _id,
        _rev,
        title,
        "contactBlocks": blocks[_type == "blockContact" && defined(map.embedUrl)] {
          _key,
          map
        }
      }[count(contactBlocks) > 0]
    `);

    console.log(`📦 Encontradas ${pages.length} páginas con bloques de contacto que necesitan migración`);

    if (pages.length === 0) {
      console.log('✅ No hay bloques que migrar. Todos los datos están actualizados.');
      return;
    }

    // Procesar cada página
    let migratedCount = 0;
    for (const page of pages) {
      console.log(`\n📄 Procesando página: ${page.title} (${page._id})`);
      
      for (const block of page.contactBlocks) {
        if (block.map?.embedUrl) {
          console.log(`  🔄 Migrando bloque con _key: ${block._key}`);
          
          // Actualizar el bloque usando el patch
          await client
            .patch(page._id)
            .set({
              [`blocks[_key=="${block._key}"].map.mapUrl`]: block.map.embedUrl
            })
            .unset([`blocks[_key=="${block._key}"].map.embedUrl`])
            .commit();
          
          migratedCount++;
          console.log(`  ✅ Bloque migrado exitosamente`);
        }
      }
    }

    console.log(`\n🎉 Migración completada exitosamente!`);
    console.log(`📊 Total de bloques migrados: ${migratedCount}`);
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Función para verificar el estado antes de migrar
async function checkMigrationStatus() {
  console.log('📊 Verificando estado actual...\n');
  
  try {
    const stats = await client.fetch(`
      {
        "totalPages": count(*[_type == "page"]),
        "pagesWithContact": count(*[_type == "page" && count(blocks[_type == "blockContact"]) > 0]),
        "pagesWithOldField": count(*[_type == "page" && count(blocks[_type == "blockContact" && defined(map.embedUrl)]) > 0]),
        "pagesWithNewField": count(*[_type == "page" && count(blocks[_type == "blockContact" && defined(map.mapUrl)]) > 0])
      }
    `);

    console.log(`Total de páginas: ${stats.totalPages}`);
    console.log(`Páginas con bloques de contacto: ${stats.pagesWithContact}`);
    console.log(`Páginas con campo antiguo (embedUrl): ${stats.pagesWithOldField}`);
    console.log(`Páginas con campo nuevo (mapUrl): ${stats.pagesWithNewField}`);
    console.log('');

    return stats;
  } catch (error) {
    console.error('❌ Error al verificar estado:', error);
    process.exit(1);
  }
}

// Ejecutar el script
async function main() {
  console.log('🚀 Script de migración de campos de mapa\n');
  
  // Verificar configuración
  if (!process.env.SANITY_TOKEN) {
    console.error('❌ Error: SANITY_TOKEN no está configurado');
    console.error('💡 Necesitas un token de Sanity con permisos de escritura');
    console.error('   Configúralo en las variables de entorno o en el archivo .env');
    process.exit(1);
  }

  // Verificar estado actual
  await checkMigrationStatus();

  // Preguntar confirmación (en un entorno de producción real, usa readline o similar)
  console.log('⚠️  ADVERTENCIA: Esta operación modificará tus datos en Sanity');
  console.log('💡 Asegúrate de tener un backup antes de continuar');
  console.log('');
  
  // Para automatización, puedes comentar esto y ejecutar directamente
  if (process.argv.includes('--dry-run')) {
    console.log('🔍 Modo dry-run: No se realizarán cambios');
    return;
  }

  // Ejecutar migración
  await migrateMapFields();

  // Verificar estado después de la migración
  console.log('\n📊 Verificando estado después de la migración...\n');
  await checkMigrationStatus();
}

// Manejar errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
  process.exit(1);
});

main();

