// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    // Forzar rutas relativas para soportar abrir con file://
    base: './',
    build: {
        assetsPrefix: './'
    },
   vite: {
        server: {
            fs: {
                allow: ['..']
            }
        }
    }
});
