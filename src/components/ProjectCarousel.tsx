import { lab } from '../data';
import { TapeSlider } from './TapeSlider';

export function ProjectCarousel() {
  return <TapeSlider
    items={lab.projects.filter(project => project.icon).map(project => ({
      id: project.id,
      src: project.icon!,
      alt: `${project.title} — supplied project illustration`,
      title: project.title,
      subtitle: `${project.category} / ${project.status}`,
      href: `/projects/${project.id}`,
    }))}
    label="Featured projects"
    heading="From the workshop"
    autoRoll
    intervalMs={2000}
    durationMs={600}
    fit="contain"
    aspectRatio="4 / 3"
    previousLabel="Previous featured project"
    nextLabel="Next featured project"
  />;
}
