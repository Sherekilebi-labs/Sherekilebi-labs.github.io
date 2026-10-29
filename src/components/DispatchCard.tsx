import { Link } from 'react-router-dom';
import { lab } from '../data';
import { newsCategories } from '../data/news';
import type { NewsPost } from '../data/types';
import { imageDimensions, mediaUrl } from '../lib/media';
import { Arrow } from './Diagrams';
import { lazy, Suspense } from 'react';
const Markdown = lazy(() => import('./Markdown').then(module => ({ default: module.Markdown })));

export function DispatchCard({ post, preview = false }: { post: NewsPost; preview?: boolean }) {
  const authors = post.authors.map(authorId => lab.people.find(person => person.id === authorId)!);
  const project = lab.projects.find(item => item.id === post.relatedProject);
  const category = newsCategories[post.category];
  return <article className={`dispatch-card dispatch-${post.category} ${preview ? 'dispatch-preview' : ''}`} id={preview ? undefined : post.slug}>
    {post.media && <div className="dispatch-media">{post.mediaType === 'video' ? <video controls loop muted playsInline preload="metadata" aria-label={post.mediaAlt || post.title}><source src={mediaUrl(post.media)}/></video> : <img src={mediaUrl(post.media)} alt={post.mediaAlt || ''} loading="lazy" {...imageDimensions(post.media)}/>}<span className="media-stamp mono">{category.code} / {post.date.replaceAll('-', '.')}</span></div>}
    <div className="dispatch-body"><div className="dispatch-meta"><span className="dispatch-category"><span/>{category.shortLabel}</span>{post.pinned && <span className="pinned-label mono">PINNED</span>}</div>
      {preview ? <h3><Link to={`/news#${post.slug}`}>{post.title}</Link></h3> : <h2>{post.title}</h2>}
      <p className="dispatch-summary">{post.summary}</p>
      {!preview && post.content && <details className="dispatch-reader"><summary>Read more <Arrow/></summary><Suspense fallback={<p className="mono">Loading update…</p>}><Markdown>{post.content}</Markdown></Suspense></details>}
      {!preview && !post.content && <p className="micro-label mono">Brief update</p>}
      <div className="dispatch-tags">{post.tags.map(tag => <span key={tag}>#{tag.replaceAll(' ', '')}</span>)}</div>
      <div className="dispatch-footer"><span className="author-credit" aria-label={`Authors: ${authors.map(author => author.name).join(', ')}`}>{authors.map(author => <span className="author-person" key={author.id}><span className="author-avatar" aria-hidden="true">{author.initials}</span>{author.name}</span>)}</span>{project && <Link className="linked-project" to={`/projects/${project.id}`} aria-label={`Linked project: ${project.title}`}>↗ {project.title}</Link>}</div>
      {preview && <Link className="dispatch-read-link text-link" to={`/news#${post.slug}`}>Read dispatch <Arrow diagonal/></Link>}
    </div>
  </article>;
}
