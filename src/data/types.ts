export interface Media {
  diagram: 'arm' | 'sumo' | 'hydrofoil' | 'pcb' | 'education' | 'racer' | 'door' | 'spoiler' | 'scale';
  src?: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  folder: string;
  sourceRoot?: string;
  category: string;
  accent: string;
  status: string;
  period: string;
  summary: string;
  introduction: string;
  logo?: { src: string; alt: string };
  introductionImage?: { src: string; alt: string; caption: string };
  tags: string[];
  media: Media;
  icon?: string;
  gallery?: { src: string; alt: string; caption: string }[];
  analysisFigures?: { src: string; alt: string; caption: string }[];
  contributorIds: string[];
  notes: string[];
  specs: { label: string; value: string }[];
  bom: { component: string; detail: string }[];
  sourceUrl?: string;
  sourcePending?: string;
  sourceLinks?: { label: string; url: string }[];
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
  specialties: string[];
  links: { label: string; url: string }[];
}

export interface LabData {
  name: string;
  location: string;
  introduction: string;
  origins: {
    title: string;
    period: string;
    description: string;
    photos: { src: string; alt: string; caption: string; date?: string }[];
  };
  equipment: { id: string; title: string; name: string; description: string; tags: string[] }[];
  people: Person[];
  links: { label: string; url: string; description: string }[];
  projects: Project[];
}

export type NewsCategory = 'project-update' | 'lab-news' | 'shenanigans';

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  category: NewsCategory;
  relatedProject?: string;
  pinned?: boolean;
  media?: string;
  mediaAlt?: string;
  mediaType?: 'image' | 'video';
  summary: string;
  content?: string;
  tags: string[];
}

export interface DocumentationExcerpt {
  projectId: string;
  source: string;
  heading: string;
  text: string;
}
