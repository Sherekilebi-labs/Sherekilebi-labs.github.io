import { Link, useParams } from 'react-router-dom';
import { excerpts, lab } from '../data';
import { ProjectMedia } from '../components/ProjectMedia';
import { Arrow } from '../components/Diagrams';
import { imageDimensions, mediaUrl } from '../lib/media';
import { Markdown } from '../components/Markdown';
import { ProjectSummary } from '../components/ProjectSummary';

export function ProjectPage() {
  const { projectId } = useParams();
  const project = lab.projects.find(item => item.id === projectId);
  if (!project) return <section className="container section not-found"><p className="eyebrow">404 / OFF THE FLIGHT PATH</p><h1>Project not found.</h1><Link className="button button-primary" to="/#projects">Back to the project index <Arrow/></Link></section>;
  const documents = excerpts.filter(item => item.projectId === project.id);
  const people = lab.people.filter(person => project.contributorIds.includes(person.id));
  const NotesList = project.id === 'active-spoiler' ? 'ul' : 'ol';

  return <article className={`project-page container accent-${project.accent}`}>
    <Link className="back-link mono" to="/#projects">← BACK TO THE PROJECT INDEX</Link>
    <header className="project-page-header"><div><p className="eyebrow">PROJECT FILE / {project.number} <span>— {project.category}</span></p><h1>{project.title}</h1><ProjectSummary className="project-page-summary">{project.summary}</ProjectSummary><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="project-file-stamp"><span className="status-label"><span/>{project.status}</span><p className="mono">{project.period}</p><span className="source-path">/{project.folder}</span></div></header>
    <div className="project-page-grid"><div className="project-page-main"><ProjectMedia media={project.media} detailed/>
      <dl className="project-specs">{project.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>
      <section className="project-detail-section" aria-labelledby="project-introduction-title">
        {project.logo && <img className="project-introduction-logo" src={mediaUrl(project.logo.src)} alt={project.logo.alt} loading="lazy" {...imageDimensions(project.logo.src)}/>}
        <h2 id="project-introduction-title">Introduction</h2>
        <ProjectSummary className="project-introduction">
          {project.introduction}
        </ProjectSummary>
        {project.introductionImage && <figure className="project-introduction-photo">
          <img src={mediaUrl(project.introductionImage.src)} alt={project.introductionImage.alt} loading="lazy" {...imageDimensions(project.introductionImage.src)}/>
          <figcaption>{project.introductionImage.caption}</figcaption>
        </figure>}
      </section>
      <section className="project-detail-section"><p className="eyebrow">01 / UNDER THE HOOD</p><h2>Engineering notes</h2><NotesList className="engineering-notes">{project.notes.map(note => <li key={note}>{note}</li>)}</NotesList></section>
      {!!project.gallery?.length && <section className="project-detail-section"><p className="eyebrow">02 / ON THE BENCH</p><h2>From the workshop</h2><div className="project-gallery">{project.gallery.map(image => <figure key={image.src}><img src={mediaUrl(image.src)} alt={image.alt} loading="lazy" {...imageDimensions(image.src)}/><figcaption>{image.caption}</figcaption></figure>)}</div></section>}
      {project.analysisFigures?.map(figure => (
        <figure className="analysis-figure" key={figure.src}>
          <img src={mediaUrl(figure.src)} alt={figure.alt} loading="lazy" {...imageDimensions(figure.src)}/>
          <figcaption>{figure.caption}</figcaption>
        </figure>
      ))}
      {!!documents.length && <section className="project-detail-section"><p className="eyebrow">SOURCE MARGINALIA</p><h2>From the documentation</h2>{documents.map(document => <details className="source-excerpt" key={`${document.source}:${document.heading}`}><summary>{document.heading}<span aria-hidden="true">+</span></summary>{document.source.endsWith('.md') ? <Markdown>{document.text}</Markdown> : <Markdown>{'```cpp\n' + document.text + '\n```'}</Markdown>}<p className="source-path">{document.source}</p></details>)}</section>}
    </div><aside className="project-page-aside"><section className="repository-panel"><p className="eyebrow">FOLLOW THE SOURCE</p><h2>Code &amp; files</h2>{project.sourceUrl ? <a className="button button-primary" href={project.sourceUrl} target="_blank" rel="noreferrer">Open GitHub repository <Arrow diagonal/></a> : <p className="repository-pending"><span aria-hidden="true">↗</span>{project.sourcePending || 'Repository link coming soon'}</p>}{project.sourceLinks?.map(link => <a className="text-link archive-link" key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<Arrow diagonal/></a>)}<a className="text-link" href="https://github.com/Sherekilebi-labs" target="_blank" rel="noreferrer">Sherekilebi Labs on GitHub <Arrow diagonal/></a></section>
      {project.bom.length > 0 && <section className="component-panel"><p className="eyebrow">SELECTED HARDWARE</p><h2>Core components</h2><dl>{project.bom.map(component => <div key={component.component}><dt>{component.component}</dt><dd>{component.detail}</dd></div>)}</dl></section>}
      {!!people.length && <section className="component-panel"><p className="eyebrow">PROJECT CONTRIBUTORS</p>{people.map(person => <p key={person.id}>{person.name}</p>)}</section>}
      <div className="project-margin-note"><img src="/tsatmfreni.svg" alt="" width="70" height="70"/><p className="mono">EVERY PROTOTYPE IS A QUESTION<br/>WITH SOME HARDWARE ATTACHED.</p></div>
    </aside></div>
  </article>;
}
