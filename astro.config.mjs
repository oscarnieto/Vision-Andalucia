import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL pública del sitio (se usa para sitemap, RSS y URLs absolutas).
// Cambiar por el dominio real de Vision Andalucia cuando esté disponible.
const SITE = 'https://www.visionandalucia.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  build: {
    // Genera /articulo/slug/index.html en vez de /articulo/slug.html
    format: 'directory',
  },
  image: {
    // Permite optimizar imágenes remotas (subidas por CMS a un CDN, etc.)
    remotePatterns: [{ protocol: 'https' }],
  },
});
