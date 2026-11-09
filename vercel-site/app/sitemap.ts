import type { MetadataRoute } from 'next';
import { publicContent } from '../lib/content';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await publicContent();
  return [...['','studio','work','demos','capabilities','about','contact','nova','resume','academic-support'].map(p=>({url:'https://portfolio-kevins.vercel.app/'+p,changeFrequency:'weekly' as const})), ...content.projects.map(p => ({ url: `https://portfolio-kevins.vercel.app/work/${encodeURIComponent(p.slug)}`, changeFrequency: 'monthly' as const }))];
}
