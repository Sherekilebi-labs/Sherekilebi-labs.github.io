import { useCallback, useState } from 'react';
import type { Media } from '../data/types';
import { ProjectDiagram } from './Diagrams';
import { imageDimensions, mediaUrl } from '../lib/media';
import { ProjectModelViewer } from './ProjectModelViewer';

export function ProjectMedia({ media, detailed = false, frame = 0, turntableReady = false }: { media: Media; detailed?: boolean; frame?: number; turntableReady?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const failModel = useCallback(() => setModelFailed(true), []);
  const showingImage = media.src && !failed;
  const source = !detailed && turntableReady ? media.turntable?.frames[frame] || media.src : media.src;
  return <figure className={`project-media ${showingImage ? 'repository-image' : 'schematic-media'} ${detailed ? 'detailed-media' : ''} ${detailed && !media.model ? 'static-media' : ''}`}>
    <div className="project-media-frame">{showingImage ? <img src={mediaUrl(source!)} alt={media.alt} loading="lazy" {...imageDimensions(source!)} onError={() => setFailed(true)}/> : <ProjectDiagram kind={media.diagram}/>}
      {detailed && media.model && !modelFailed && <ProjectModelViewer model={media.model} onFailure={failModel}/>}
    </div>
    {detailed && modelFailed && <p className="cad-viewer-fallback" role="status">3D view unavailable. Showing the project image.</p>}
    <figcaption>{showingImage ? media.caption : (media.src ? 'Illustrative schematic · image unavailable' : media.caption)}</figcaption>
  </figure>;
}
