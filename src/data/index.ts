import raw from './lab.json';
import rawExcerpts from './generated/excerpts.json';
import type { DocumentationExcerpt, LabData, Media } from './types';

function diagramKind(value: string): Media['diagram'] {
  switch (value) {
    case 'arm': case 'sumo': case 'hydrofoil': case 'pcb': case 'education': case 'racer': case 'door': case 'spoiler': case 'scale': return value;
    default: throw new Error(`Unknown project diagram: ${value}`);
  }
}

export const lab: LabData = {
  ...raw,
  projects: raw.projects.map(project => ({ ...project, media: { ...project.media, diagram: diagramKind(project.media.diagram) } })),
};
export const excerpts: DocumentationExcerpt[] = rawExcerpts;
export const categories = [...new Set(lab.projects.map(project => project.category))];
export const technologies = [...new Set(lab.projects.flatMap(project => project.tags))].sort();
