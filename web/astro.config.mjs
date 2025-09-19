// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    // Usar rutas absolutas para que funcionen correctamente en subdirectorios
    base: '/',
    build: {
        assetsPrefix: '/'
    },
   vite: {
        server: {
            fs: {
                allow: ['..']
            }
        }
    }
});
