/**
 * Sectores (categorías principales) de Vision Andalucia.
 *
 * Fuente única de la verdad para:
 *   - el esquema de contenido (src/content/config.ts)
 *   - los listados de la home
 *   - la navegación
 *
 * IMPORTANTE: si añades/renombras un sector aquí, replica el mismo `id`
 * y `label` en /public/admin/config.yml (campo "sector") para que Decap CMS
 * muestre las mismas opciones. Son dos ficheros distintos por decisión de
 * diseño: Astro no puede importar TS dentro del YAML del CMS.
 */
export interface Sector {
  id: string;
  label: string;
  descripcion: string;
}

export const SECTORES = [
  {
    id: 'economia',
    label: 'Economía',
    descripcion: 'Actualidad económica, empresas y mercados en Andalucía.',
  },
  {
    id: 'tecnologia',
    label: 'Tecnología',
    descripcion: 'Innovación, digitalización y ecosistema tecnológico.',
  },
  {
    id: 'turismo',
    label: 'Turismo',
    descripcion: 'Sector turístico, hostelería y cultura.',
  },
  {
    id: 'agroalimentario',
    label: 'Agroalimentario',
    descripcion: 'Agricultura, ganadería e industria alimentaria.',
  },
  {
    id: 'sostenibilidad',
    label: 'Sostenibilidad',
    descripcion: 'Energía, medio ambiente y transición ecológica.',
  },
  {
    id: 'sociedad',
    label: 'Sociedad',
    descripcion: 'Actualidad social, formación y empleo.',
  },
] as const satisfies readonly Sector[];

/** Tupla de ids para usar con z.enum(). */
export const SECTOR_IDS = SECTORES.map((s) => s.id) as [string, ...string[]];

/** Devuelve un sector por su id (o undefined). */
export function getSector(id: string): Sector | undefined {
  return SECTORES.find((s) => s.id === id);
}

/** Etiqueta legible de un sector; cae al propio id si no existe. */
export function sectorLabel(id: string): string {
  return getSector(id)?.label ?? id;
}
