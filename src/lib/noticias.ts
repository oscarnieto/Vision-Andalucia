import { getCollection, type CollectionEntry } from 'astro:content';

export type Noticia = CollectionEntry<'noticias'>;

/** ¿Se debe mostrar esta noticia en producción? */
function esPublicable(n: Noticia): boolean {
  const publicada = !n.data.borrador;
  // En dev mostramos borradores para poder previsualizar.
  return import.meta.env.PROD ? publicada : true;
}

/** Todas las noticias publicables, ordenadas de más reciente a más antigua. */
export async function getNoticias(): Promise<Noticia[]> {
  const todas = await getCollection('noticias', esPublicable);
  return todas.sort(
    (a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf(),
  );
}

/** Últimas `limite` noticias (bloque "últimas novedades" de la home). */
export async function getUltimas(limite = 6): Promise<Noticia[]> {
  return (await getNoticias()).slice(0, limite);
}

/** Noticias destacadas (para el hero de la home). */
export async function getDestacadas(limite = 3): Promise<Noticia[]> {
  return (await getNoticias())
    .filter((n) => n.data.destacada)
    .slice(0, limite);
}

/** Noticias de un sector concreto. */
export async function getPorSector(
  sectorId: string,
  limite?: number,
): Promise<Noticia[]> {
  const filtradas = (await getNoticias()).filter(
    (n) => n.data.sector === sectorId,
  );
  return typeof limite === 'number' ? filtradas.slice(0, limite) : filtradas;
}

/** Noticias que llevan una etiqueta concreta. */
export async function getPorTag(
  tag: string,
  limite?: number,
): Promise<Noticia[]> {
  const filtradas = (await getNoticias()).filter((n) =>
    n.data.tags.includes(tag),
  );
  return typeof limite === 'number' ? filtradas.slice(0, limite) : filtradas;
}

/**
 * Noticias a partir de una lista de slugs, respetando ese orden.
 * Ignora los slugs que no existan o no sean publicables.
 */
export async function getPorSlugs(slugs: string[]): Promise<Noticia[]> {
  const todas = await getNoticias();
  const porSlug = new Map(todas.map((n) => [n.slug, n]));
  return slugs
    .map((s) => porSlug.get(s))
    .filter((n): n is Noticia => Boolean(n));
}

/**
 * Noticias relacionadas con `noticia`.
 * Prioriza coincidencia de tags; completa con las del mismo sector.
 */
export async function getRelacionadas(
  noticia: Noticia,
  limite = 3,
): Promise<Noticia[]> {
  const resto = (await getNoticias()).filter((n) => n.id !== noticia.id);
  const tags = new Set(noticia.data.tags);

  const puntuada = resto
    .map((n) => {
      const tagsComunes = n.data.tags.filter((t) => tags.has(t)).length;
      const mismoSector = n.data.sector === noticia.data.sector ? 1 : 0;
      // Peso: cada tag común vale más que el sector.
      return { n, score: tagsComunes * 2 + mismoSector };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return puntuada.slice(0, limite).map((x) => x.n);
}
