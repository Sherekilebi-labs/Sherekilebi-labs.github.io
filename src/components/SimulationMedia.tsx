import type { Project } from '../data/types';
import { imageDimensions, mediaUrl } from '../lib/media';

export function SimulationMedia({ simulation }: { simulation: NonNullable<Project['simulation']> }) {
  const animation = simulation.animation;
  if (!animation) return null;
  return <section className="project-detail-section" aria-labelledby="simulation-title">
    <h2 id="simulation-title">Simulation</h2>
    <p className="simulation-intro">{simulation.intro}</p>
    <figure className="simulation-motion">
      <div className="simulation-frame">
        <img src={mediaUrl(animation.src)} alt={animation.alt} loading="lazy" {...imageDimensions(animation.src)}/>
      </div>
      <figcaption>{animation.caption}</figcaption>
    </figure>
  </section>;
}
