import rss from '@astrojs/rss';
import { getNoticias } from '../lib/noticias';

export async function GET(context) {
  const noticias = await getNoticias();
  return rss({
    title: 'Vision Andalucia',
    description: 'Noticias y actualidad de los sectores clave de Andalucía.',
    site: context.site,
    items: noticias.map((n) => ({
      title: n.data.titulo,
      description: n.data.resumen,
      pubDate: n.data.fecha,
      categories: [n.data.sector, ...n.data.tags],
      link: `/noticia/${n.slug}/`,
    })),
  });
}
