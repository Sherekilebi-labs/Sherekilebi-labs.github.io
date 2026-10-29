import { Link, useParams } from 'react-router-dom';
import { lab } from '../data';
import { newsPosts, newestFirst } from '../data/news';
import { ProjectMedia } from '../components/ProjectMedia';
import { Arrow } from '../components/Diagrams';
import { imageDimensions, mediaUrl } from '../lib/media';
import { ProjectSummary } from '../components/ProjectSummary';
import { SimulationMedia } from '../components/SimulationMedia';

export function ProjectPage() {
  const { projectId } = useParams();
  const project = lab.projects.find(item => item.id === projectId);
  if (!project) return <section className="container section not-found">
    <h1>Project not found.</h1>
    <p>This project may have moved. Explore the current projects from the workshop.</p>
    <Link className="button button-primary" to="/#projects">Back to projects <Arrow/></Link>
  </section>;

  const people = lab.people.filter(person => project.contributorIds.includes(person.id));
  const updates = newsPosts.filter(post => post.relatedProject === project.id).sort(newestFirst).slice(0, 3);

  return <article className={`project-page container accent-${project.accent}`}>
    <Link className="back-link" to="/#projects">← Back to projects</Link>
    <header className="project-page-header">
      <h1>{project.title}</h1>
      <ProjectSummary className="project-page-summary">{project.summary}</ProjectSummary>
      <div className="project-meta">
        <span className="status-label"><span aria-hidden="true"/>{project.status}</span>
        <span>{project.category}</span><span>{project.period}</span>
      </div>
      <div className="project-actions">
        {project.sourceUrl
          ? <a className="button button-primary" href={project.sourceUrl} target="_blank" rel="noreferrer">Open GitHub repository <Arrow diagonal/></a>
          : <p className="repository-pending">Source repository not yet published.</p>}
        <div className="project-source-links">
          {project.sourceLinks?.map(link => <a className="text-link" key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<Arrow diagonal/></a>)}
          <a className="text-link" href="https://github.com/Sherekilebi-labs" target="_blank" rel="noreferrer">Sherekilebi Labs on GitHub <Arrow diagonal/></a>
        </div>
      </div>
    </header>
    <div className="project-page-grid">
      <div className="project-page-main">
        <ProjectMedia key={project.id} media={project.media} detailed/>
        <section className="project-detail-section" aria-labelledby="project-overview-title">
          <h2 id="project-overview-title">Overview</h2>
          <ProjectSummary className="project-introduction">{project.introduction}</ProjectSummary>
          {project.introductionImage && <figure className="project-introduction-photo">
            <div className="project-introduction-image-frame">
              <img src={mediaUrl(project.introductionImage.src)} alt={project.introductionImage.alt} loading="lazy" {...imageDimensions(project.introductionImage.src)}/>
              {project.logo && <img className="project-photo-logo" src={mediaUrl(project.logo.src)} alt={project.logo.alt} loading="lazy" {...imageDimensions(project.logo.src)}/>}
            </div>
            <figcaption>{project.introductionImage.caption}</figcaption>
          </figure>}
        </section>
        {project.currentState && <section className="project-detail-section" aria-labelledby="current-state-title">
          <h2 id="current-state-title">Current state</h2>
          <ProjectSummary className="project-current-state">{project.currentState}</ProjectSummary>
        </section>}
        <section className="project-detail-section" aria-labelledby="engineering-title">
          <h2 id="engineering-title">How it works</h2>
          {project.engineeringTopics?.length ? <div className="engineering-topics">{project.engineeringTopics.map(topic => <div key={topic.title}>
            <h3>{topic.title}</h3><p>{topic.body}</p>
          </div>)}</div> : <ul className="engineering-notes">{project.notes.map(note => <li key={note}>{note}</li>)}</ul>}
        </section>
        {!!project.results?.length && <section className="project-detail-section project-results" aria-labelledby="results-title">
          <h2 id="results-title">Testing and results</h2>
          {project.results.map(result => <div className="project-result" key={result.title}>
            <h3>{result.title}</h3><p>{result.method}</p><p>{result.finding}</p>
            <p className="result-limitation"><strong>What this tells us</strong> {result.limitations}</p>
          </div>)}
          {project.analysisFigures?.map(figure => <figure className="analysis-figure" key={figure.src}>
            <img src={mediaUrl(figure.src)} alt={figure.alt} loading="lazy" {...imageDimensions(figure.src)}/>
            <figcaption>{figure.caption}</figcaption>
          </figure>)}
        </section>}
        {!!project.gallery?.length && <section className="project-detail-section" aria-labelledby="workshop-title">
          <h2 id="workshop-title">From the workshop</h2>
          <div className="project-gallery">{project.gallery.map(image => <figure key={image.src}>
            <img src={mediaUrl(image.src)} alt={image.alt} loading="lazy" {...imageDimensions(image.src)}/>
            <figcaption>{image.caption}</figcaption>
          </figure>)}</div>
        </section>}
        {project.simulation && <SimulationMedia simulation={project.simulation}/>}
        {!project.results?.length && project.analysisFigures?.map(figure => <figure className="analysis-figure" key={figure.src}>
          <img src={mediaUrl(figure.src)} alt={figure.alt} loading="lazy" {...imageDimensions(figure.src)}/><figcaption>{figure.caption}</figcaption>
        </figure>)}
        {!!project.nextSteps?.length && <section className="project-detail-section" aria-labelledby="next-steps-title">
          <h2 id="next-steps-title">Next steps</h2>
          <ul className="engineering-notes">{project.nextSteps.map(step => <li key={step}>{step}</li>)}</ul>
        </section>}
        {!!updates.length && <section className="project-detail-section" aria-labelledby="project-updates-title">
          <h2 id="project-updates-title">Project updates</h2>
          <div className="project-updates">{updates.map(post => <Link key={post.id} to={`/news#${post.slug}`}>
            <time dateTime={post.date}>{post.date}</time><span>{post.title}</span><Arrow/>
          </Link>)}</div>
        </section>}
      </div>
      <aside className="project-page-aside" aria-label="Project details">
        <section className="project-facts"><h2>At a glance</h2>
          <dl className="project-specs">{project.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>
          <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </section>
        {project.bom.length > 0 && <section className="component-panel"><h2>Core components</h2>
          <dl>{project.bom.map(component => <div key={component.component}><dt>{component.component}</dt><dd>{component.detail}</dd></div>)}</dl>
        </section>}
        {!!people.length && <section className="component-panel"><h2>Contributors</h2>{people.map(person => <p key={person.id}>{person.name}</p>)}</section>}
      </aside>
    </div>
  </article>;
}
