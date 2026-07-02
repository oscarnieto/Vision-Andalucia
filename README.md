# Vision Andalucia

Web de noticias/blog para Vision Andalucia. Sitio **estático** generado con
[Astro](https://astro.build) y editado mediante [Decap CMS](https://decapcms.org)
(panel sin código). Sin backend ni base de datos: el resultado del build es una
carpeta estática (`dist/`) que IT puede desplegar en cualquier hosting.

## Requisitos

- Node.js 20 o superior

## Puesta en marcha

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # genera el sitio estático en dist/
npm run preview  # previsualiza el build
```

## Estructura del proyecto

```
public/
  admin/            Panel Decap CMS (index.html + config.yml)
  uploads/          Imágenes/vídeos subidos desde el CMS
  favicon.svg
src/
  components/       Piezas reutilizables (tarjetas, vídeo, cabecera...)
  content/
    config.ts       Esquema de las noticias (fuente de la verdad)
    noticias/       Una noticia = un fichero Markdown
  layouts/          Plantilla base (HTML, <head>, SEO)
  lib/
    sectors.ts      Taxonomía de sectores (categorías principales)
    noticias.ts     Consultas: últimas, por sector, relacionadas...
  pages/
    index.astro           Home (destacada + últimas + bloques por sector)
    noticia/[...slug]     Página de artículo
    sector/[sector]       Listado por sector
    tag/[tag]             Listado por etiqueta
    rss.xml.js            Feed RSS
astro.config.mjs    Configuración (dominio, sitemap, imágenes)
```

## Panel de contenido (Decap CMS)

El panel está en `/admin`. Formulario de noticia: título, resumen, sector,
etiquetas, fecha, autor, imagen de portada, vídeo, destacada/borrador y cuerpo.

### Editar en local

Con la web arrancada (`npm run dev`), en otra terminal:

```bash
npx decap-server
```

Entra en `http://localhost:4321/admin` — con `local_backend: true` los cambios
se guardan directamente en los ficheros del repo, sin necesidad de login.

### Editar en producción

`config.yml` usa el backend `git-gateway`, pensado para
[Netlify Identity](https://decapcms.org/docs/git-gateway-backend/): los
editores entran con email/contraseña y Decap hace commit por ellos. Si el
alojamiento final no es Netlify, se puede cambiar a
[backend de GitHub con OAuth](https://decapcms.org/docs/github-backend/).

## Añadir o cambiar sectores

Los sectores están definidos en **dos** sitios que deben coincidir:

1. `src/lib/sectors.ts` — usado por la web.
2. `public/admin/config.yml` — las opciones del desplegable del CMS.

Edita ambos con el mismo `id`/`value` y `label`.

## Notas

- Las noticias marcadas como **borrador** se ven en `dev` pero no en el build.
- Las **relacionadas** se calculan por etiquetas comunes y sector.
- Los diseños de Figma se irán integrando por fases sobre esta base; el theming
  vive en variables CSS en `src/styles/global.css`.
