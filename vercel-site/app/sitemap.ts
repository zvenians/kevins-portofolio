import type { MetadataRoute } from 'next';
import { publicContent } from '../lib/content';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await publicContent();
  return [{ url: 'https://portfolio-kevins.vercel.app/', changeFrequency: 'weekly' }, ...content.projects.map(p => ({ url: `https://portfolio-kevins.vercel.app/work/${encodeURIComponent(p.slug)}`, changeFrequency: 'monthly' as const }))];
}
