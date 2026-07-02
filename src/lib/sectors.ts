/**
 * Sectores (categorías principales) de Visión Andalucía.
 *
 * Fuente única de la verdad para:
 *   - el esquema de contenido (src/content/config.ts)
 *   - la barra de navegación
 *   - los listados
 *
 * IMPORTANTE: si añades/renombras un sector aquí, replica el mismo `id`
 * y `label` en /public/admin/config.yml (campo "sector") para que Decap CMS
 * muestre las mismas opciones.
 */
export interface Sector {
  id: string;
  label: string;
  descripcion: string;
}

export const SECTORES = [
  {
    id: 'residencial',
    label: 'Residencial',
    descripcion: 'Mercado de vivienda: obra nueva, segunda mano e inversión.',
  },
  {
    id: 'living',
    label: 'Living',
    descripcion: 'Build to rent, coliving, residencias de estudiantes y senior living.',
  },
  {
    id: 'retail',
    label: 'Retail',
    descripcion: 'Centros comerciales, high street y locales comerciales.',
  },
  {
    id: 'oficinas',
    label: 'Oficinas',
    descripcion: 'Mercado de oficinas y espacios de trabajo.',
  },
  {
    id: 'hoteles',
    label: 'Hoteles',
    descripcion: 'Inversión hotelera y sector turístico.',
  },
  {
    id: 'industrial',
    label: 'Industrial & Logistics',
    descripcion: 'Naves logísticas, industriales y last mile.',
  },
  {
    id: 'agribusiness',
    label: 'Agribusiness',
    descripcion: 'Suelo rústico, explotaciones agrícolas e inversión agroindustrial.',
  },
  {
    id: 'tendencias',
    label: 'Tendencias del sector',
    descripcion: 'Análisis, informes y tendencias del mercado inmobiliario.',
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
