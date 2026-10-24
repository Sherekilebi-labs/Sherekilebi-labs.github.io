import { useState } from 'react';
import type { Media } from '../data/types';
import { ProjectDiagram } from './Diagrams';
import { imageDimensions, mediaUrl } from '../lib/media';

export function ProjectMedia({ media, detailed = false }: { media: Media; detailed?: boolean }) {
  const [failed, setFailed] = useState(false);
  const showingImage = media.src && !failed;
  return <figure className={`project-media ${showingImage ? 'repository-image' : 'schematic-media'} ${detailed ? 'detailed-media' : ''}`}>
    <div className="project-media-frame">{showingImage ? <img src={mediaUrl(media.src!)} alt={media.alt} loading="lazy" {...imageDimensions(media.src!)} onError={() => setFailed(true)}/> : <ProjectDiagram kind={media.diagram}/>}</div>
    <figcaption>{showingImage ? media.caption : (media.src ? 'Illustrative schematic · image unavailable' : media.caption)}</figcaption>
  </figure>;
}
