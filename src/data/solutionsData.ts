import { SOLUTIONS_RAW } from './solutionsRaw.js';

export interface SolutionItem {
  slug: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  painPoints: { title: string; desc: string }[];
  deliverables: { step: string; title: string; desc: string }[];
  metrics: { value: string; label: string }[];
  faq: { q: string; a: string }[];
  priceFrom: string;
  deliveryDays: string;
}

export const SOLUTIONS: Record<string, SolutionItem> = SOLUTIONS_RAW as unknown as Record<string, SolutionItem>;
