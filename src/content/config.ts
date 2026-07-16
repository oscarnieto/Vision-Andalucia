import { defineCollection, z } from 'astro:content';
import { SECTOR_IDS } from '../lib/sectors';

/**
 * Convierte a fecha de forma tolerante. Acepta:
 *   - objetos Date,
 *   - ISO ("2026-07-03T11:20:00"),
 *   - el formato español que a veces guarda el CMS ("03/07/2026T11:20"
 *     o "03/07/2026 11:20").
 * Así una fecha mal formateada nunca rompe el build de toda la web.
 */
const fechaFlexible = z.preprocess((val) => {
  if (val instanceof Date) return val;
  if (typeof val === 'string') {
    const m = val.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[T ](\d{2}):(\d{2}))?/);
    if (m) {
      const [, d, mo, y, h = '00', mi = '00'] = m;
      return new Date(+y, +mo - 1, +d, +h, +mi);
    }
  }
  return val;
}, z.coerce.date());

/** Trata cadenas vacías como "sin valor" (los campos opcionales del CMS). */
const opcionalTexto = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().optional(),
);

/**
 * Colección de noticias/artículos.
 *
 * Cada noticia es un fichero Markdown en `src/content/noticias/`.
 * El frontmatter lo rellena Decap CMS (ver /public/admin/config.yml),
 * pero el esquema real (fuente de la verdad) es este `zod`.
 *
 * Diseñada para escalar a cientos de noticias: los listados y las
 * "relacionadas" se calculan en build a partir de estos campos.
 */
const noticias = defineCollection({
  type: 'content',
  schema: z.object({
    // Cabecera / identidad
    titulo: z.string(),
    // Entradilla / resumen para tarjetas y meta description
    resumen: z.string().max(300),

    // Clasificación
    sector: z.enum(SECTOR_IDS),
    // Ciudad (para filtrar y montar landings por ciudad). Opcional.
    ciudad: opcionalTexto,
    // Etiqueta que se muestra en el tag amarillo sobre el titular.
    // Si se omite, se usa el nombre del sector. Ej.: "Residencial obra nueva".
    categoria: opcionalTexto,
    tags: z.array(z.string()).default([]),

    // Publicación
    fecha: fechaFlexible,
    fechaActualizacion: z.preprocess(
      (v) => (v === '' || v == null ? undefined : v),
      fechaFlexible.optional(),
    ),
    autor: z.string().default('Redacción Visión Andalucía'),
    // Cargo del autor (segunda línea bajo el nombre).
    autorCargo: opcionalTexto,
    destacada: z.boolean().default(false),
    borrador: z.boolean().default(false),

    // Multimedia de cabecera.
    // `imagen` es una ruta absoluta desde la raíz del sitio (p.ej.
    // "/uploads/foto.jpg"), tal como la escribe Decap CMS al subir el fichero
    // a public/uploads. También admite una URL absoluta a un CDN.
    imagen: opcionalTexto,
    imagenAlt: z.string().default(''),
    // URL de vídeo embebido (YouTube, Vimeo, MP4...). Opcional.
    video: z.preprocess(
      (v) => (v === '' ? undefined : v),
      z.string().url().optional(),
    ),
  }),
});

/**
 * Colección de páginas/landings (informes).
 *
 * Cada landing es un fichero Markdown en `src/content/paginas/`. Combina un
 * hero, un texto introductorio y una rejilla de noticias que se eligen
 * de forma manual o por sector/etiqueta. Se publican en /informe/{slug}/.
 */
const paginas = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    borrador: z.boolean().default(false),
    fecha: fechaFlexible.optional(),

    // --- Hero ---
    heroImagen: opcionalTexto,
    heroImagenAlt: z.string().default(''),
    etiqueta: opcionalTexto, // pastilla amarilla (ej. "25 aniversario")
    titular: z.string(), // h1
    autor: opcionalTexto,
    autorCargo: opcionalTexto,

    // --- Texto introductorio ---
    // La entradilla se muestra grande y en negrita; el cuerpo va en el body.
    entradilla: opcionalTexto,

    // --- Selección de contenido para la rejilla de tarjetas ---
    // modo "manual"  -> se usa la lista `noticias` (slugs, en orden).
    // modo "filtro"  -> cada filtro admite VARIOS valores. Dentro de un filtro
    //                   se aplica O (cualquiera de los elegidos); entre filtros
    //                   distintos se aplica Y (deben cumplirse todos).
    modo: z.enum(['manual', 'filtro']).default('manual'),
    noticias: z.array(z.string()).default([]), // slugs (modo manual)
    filtroSector: z.array(z.string()).default([]),
    filtroCiudad: z.array(z.string()).default([]),
    filtroAno: z.preprocess(
      (v) =>
        Array.isArray(v) ? v.filter((x) => x !== '' && x != null) : v,
      z.array(z.coerce.number()).default([]),
    ),
    filtroTag: z.array(z.string()).default([]),
    limite: z.coerce.number().default(6), // modo filtro
    tituloSeccion: opcionalTexto, // título opcional sobre la rejilla
  }),
});

export const collections = { noticias, paginas };
