import { describe, it, expect } from 'vitest';
import { extractGoogleMapsEmbedUrl, isValidGoogleMapsUrl, getGoogleMapsIframeProps } from './googleMaps';

describe('extractGoogleMapsEmbedUrl', () => {
    it('debe devolver null para valores undefined o null', () => {
        expect(extractGoogleMapsEmbedUrl(undefined)).toBe(null);
        expect(extractGoogleMapsEmbedUrl('')).toBe(null);
    });

    it('debe devolver la URL tal cual si ya es una URL de embed', () => {
        const embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3';
        expect(extractGoogleMapsEmbedUrl(embedUrl)).toBe(embedUrl);
    });

    it('debe extraer el src de un código iframe', () => {
        const iframeCode = '<iframe src="https://www.google.com/maps/embed?pb=123" width="600" height="450"></iframe>';
        expect(extractGoogleMapsEmbedUrl(iframeCode)).toBe('https://www.google.com/maps/embed?pb=123');
    });

    it('debe procesar URLs con coordenadas', () => {
        const url = 'https://www.google.com/maps/@41.6488226,-0.8890853,13z';
        const result = extractGoogleMapsEmbedUrl(url);
        expect(result).toContain('google.com/maps/embed');
        expect(result).toContain('41.6488226');
        expect(result).toContain('-0.8890853');
    });

    it('debe procesar URLs con place', () => {
        const url = 'https://www.google.com/maps/place/Zaragoza';
        const result = extractGoogleMapsEmbedUrl(url);
        expect(result).toContain('google.com/maps/embed');
        expect(result).toContain('Zaragoza');
    });

    it('debe procesar URLs con parámetro q', () => {
        const url = 'https://www.google.com/maps?q=Zaragoza+Spain';
        const result = extractGoogleMapsEmbedUrl(url);
        expect(result).toContain('google.com/maps/embed');
        expect(result).toContain('Zaragoza');
    });

    it('debe manejar URLs cortas de goo.gl', () => {
        const url = 'https://maps.app.goo.gl/ABC123';
        const result = extractGoogleMapsEmbedUrl(url);
        expect(result).toBeTruthy();
    });

    it('debe devolver null para URLs no válidas de Google Maps', () => {
        expect(extractGoogleMapsEmbedUrl('https://example.com')).toBe(null);
        expect(extractGoogleMapsEmbedUrl('not a url')).toBe(null);
    });

    it('debe manejar espacios en blanco al inicio y final', () => {
        const url = '  https://www.google.com/maps/embed?pb=123  ';
        expect(extractGoogleMapsEmbedUrl(url)).toBe('https://www.google.com/maps/embed?pb=123');
    });
});

describe('isValidGoogleMapsUrl', () => {
    it('debe identificar URLs válidas de Google Maps', () => {
        expect(isValidGoogleMapsUrl('https://www.google.com/maps/embed?pb=123')).toBe(true);
        expect(isValidGoogleMapsUrl('https://www.google.com/maps/place/Zaragoza')).toBe(true);
        expect(isValidGoogleMapsUrl('https://maps.app.goo.gl/ABC123')).toBe(true);
        expect(isValidGoogleMapsUrl('<iframe src="https://maps.google.com"></iframe>')).toBe(true);
    });

    it('debe rechazar URLs no válidas', () => {
        expect(isValidGoogleMapsUrl('https://example.com')).toBe(false);
        expect(isValidGoogleMapsUrl('')).toBe(false);
        expect(isValidGoogleMapsUrl(undefined)).toBe(false);
    });
});

describe('getGoogleMapsIframeProps', () => {
    it('debe devolver props válidos para una URL correcta', () => {
        const url = 'https://www.google.com/maps/embed?pb=123';
        const props = getGoogleMapsIframeProps(url, 'Mi Mapa');
        
        expect(props).toBeTruthy();
        expect(props?.src).toBe(url);
        expect(props?.title).toBe('Mi Mapa');
        expect(props?.loading).toBe('lazy');
        expect(props?.referrerPolicy).toBe('no-referrer-when-downgrade');
        expect(props?.allowFullscreen).toBe(true);
    });

    it('debe usar título por defecto si no se proporciona', () => {
        const url = 'https://www.google.com/maps/embed?pb=123';
        const props = getGoogleMapsIframeProps(url);
        
        expect(props?.title).toBe('Mapa');
    });

    it('debe devolver null para URLs inválidas', () => {
        expect(getGoogleMapsIframeProps('https://example.com')).toBe(null);
        expect(getGoogleMapsIframeProps(undefined)).toBe(null);
    });
});

