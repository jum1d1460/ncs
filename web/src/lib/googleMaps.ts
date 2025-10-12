/**
 * Utilidad para procesar URLs de Google Maps
 * Convierte diferentes formatos de URLs de Google Maps en URLs de embed válidas
 */

/**
 * Extrae o convierte una URL de Google Maps a formato embed
 * 
 * Formatos soportados:
 * 1. URL de embed: https://www.google.com/maps/embed?pb=...
 * 2. URL completa: https://www.google.com/maps/place/...
 * 3. URL corta de compartir: https://maps.app.goo.gl/...
 * 4. Código iframe completo: <iframe src="..." ...></iframe>
 * 
 * @param mapUrl - URL de Google Maps en cualquier formato
 * @returns URL de embed lista para usar en un iframe, o null si no es válida
 */
export function extractGoogleMapsEmbedUrl(mapUrl: string | undefined): string | null {
    if (!mapUrl || typeof mapUrl !== 'string') {
        return null;
    }

    // Limpiar espacios
    mapUrl = mapUrl.trim();

    // Si es un código de iframe, extraer el src primero
    if (mapUrl.includes('<iframe')) {
        const srcMatch = mapUrl.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) {
            // Retornar la URL extraída directamente si ya es una URL de embed
            const extractedUrl = srcMatch[1];
            if (extractedUrl.includes('google.com/maps/embed')) {
                return extractedUrl;
            }
            // Si no es embed, intentar convertirla
            return extractGoogleMapsEmbedUrl(extractedUrl);
        }
        return null;
    }

    // Si ya es una URL de embed, devolverla tal cual
    if (mapUrl.includes('google.com/maps/embed')) {
        return mapUrl;
    }

    // Si es una URL de Google Maps (place, dir, search, etc)
    if (mapUrl.includes('google.com/maps')) {
        try {
            const url = new URL(mapUrl);
            
            // Extraer coordenadas si están disponibles
            const pathMatch = url.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (pathMatch) {
                const lat = pathMatch[1];
                const lng = pathMatch[2];
                return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1ses!2ses!4v1`;
            }

            // Si tiene un place ID o query, intentar construir una URL de embed básica
            const placeMatch = url.pathname.match(/\/place\/([^/]+)/);
            if (placeMatch) {
                const place = encodeURIComponent(placeMatch[1]);
                return `https://www.google.com/maps/embed/v1/place?key=&q=${place}`;
            }

            // Buscar en los parámetros de query
            const q = url.searchParams.get('q');
            if (q) {
                return `https://www.google.com/maps/embed/v1/search?key=&q=${encodeURIComponent(q)}`;
            }
        } catch (e) {
            console.error('Error parsing Google Maps URL:', e);
            return null;
        }
    }

    // Si es una URL corta (goo.gl o maps.app.goo.gl)
    if (mapUrl.includes('goo.gl') || mapUrl.includes('maps.app.goo.gl')) {
        // Las URLs cortas necesitan ser redirigidas primero
        // Por simplicidad, las convertimos a un iframe básico usando la URL como destino
        // Nota: En producción, esto podría requerir una redirección del lado del servidor
        // Para ahora, devolvemos la URL y dejamos que Google la procese
        return mapUrl;
    }

    // Si no se reconoce el formato, devolver null
    return null;
}

/**
 * Verifica si una URL es una URL válida de Google Maps
 */
export function isValidGoogleMapsUrl(mapUrl: string | undefined): boolean {
    if (!mapUrl || typeof mapUrl !== 'string') {
        return false;
    }

    return (
        mapUrl.includes('google.com/maps') ||
        mapUrl.includes('goo.gl') ||
        mapUrl.includes('maps.app.goo.gl') ||
        mapUrl.includes('<iframe')
    );
}

/**
 * Crea atributos para un iframe de Google Maps
 */
export function getGoogleMapsIframeProps(mapUrl: string | undefined, title: string = 'Mapa') {
    const embedUrl = extractGoogleMapsEmbedUrl(mapUrl);
    
    if (!embedUrl) {
        return null;
    }

    return {
        src: embedUrl,
        title,
        loading: 'lazy' as const,
        referrerPolicy: 'no-referrer-when-downgrade' as const,
        style: 'border: 0;',
        allowFullscreen: true,
    };
}

