/**
 * Ciudades de Visión Andalucía.
 *
 * Se usan para clasificar y filtrar noticias (y para armar landings por
 * ciudad). Mismo patrón que los sectores: lista única compartida entre el
 * esquema de contenido y el panel.
 *
 * IMPORTANTE: si añades/renombras una ciudad aquí, replica el mismo `id`
 * y `label` en /public/admin/config.yml (campos "ciudad").
 */
export interface Ciudad {
  id: string;
  label: string;
}

export const CIUDADES = [
  { id: 'malaga', label: 'Málaga' },
  { id: 'sevilla', label: 'Sevilla' },
  { id: 'cordoba', label: 'Córdoba' },
  { id: 'granada', label: 'Granada' },
  { id: 'cadiz', label: 'Cádiz' },
  { id: 'almeria', label: 'Almería' },
  { id: 'huelva', label: 'Huelva' },
  { id: 'jaen', label: 'Jaén' },
  { id: 'marbella', label: 'Marbella' },
] as const satisfies readonly Ciudad[];

/** Etiqueta legible de una ciudad; cae al propio id si no existe. */
export function ciudadLabel(id: string): string {
  return CIUDADES.find((c) => c.id === id)?.label ?? id;
}
