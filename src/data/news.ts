import type { NewsCategory, NewsPost } from './types';

const files = import.meta.glob<NewsPost>('/content/news/*.json', { eager: true, import: 'default' });
export const newsPosts = Object.values(files);
export const newestFirst = (a: NewsPost, b: NewsPost) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id);
export const dispatches = [...newsPosts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || newestFirst(a, b));
export const latestDispatches = [...newsPosts].sort(newestFirst).slice(0, 3);
export const newsCategories: Record<NewsCategory, { label: string; shortLabel: string; code: string }> = {
  'project-update': { label: 'Project updates', shortLabel: 'Project update', code: 'PRJ' },
  'lab-news': { label: 'Lab news', shortLabel: 'Lab news', code: 'LAB' },
  shenanigans: { label: 'Shenanigans', shortLabel: 'Shenanigans', code: 'ODD' },
};
