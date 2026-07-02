import { defineCollection, z } from 'astro:content';
import { SECTOR_IDS } from '../lib/sectors';

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
    // Etiqueta que se muestra en el tag amarillo sobre el titular.
    // Si se omite, se usa el nombre del sector. Ej.: "Residencial obra nueva".
    categoria: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // Publicación
    fecha: z.coerce.date(),
    fechaActualizacion: z.coerce.date().optional(),
    autor: z.string().default('Redacción Visión Andalucía'),
    // Cargo del autor (segunda línea bajo el nombre).
    autorCargo: z.string().optional(),
    destacada: z.boolean().default(false),
    borrador: z.boolean().default(false),

    // Multimedia de cabecera.
    // `imagen` es una ruta absoluta desde la raíz del sitio (p.ej.
    // "/uploads/foto.jpg"), tal como la escribe Decap CMS al subir el fichero
    // a public/uploads. También admite una URL absoluta a un CDN.
    imagen: z.string().optional(),
    imagenAlt: z.string().default(''),
    // URL de vídeo embebido (YouTube, Vimeo, MP4...). Opcional.
    video: z.string().url().optional(),
  }),
});

export const collections = { noticias };
