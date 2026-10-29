import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dispatches, newsCategories } from '../data/news';
import type { NewsCategory } from '../data/types';
import { DispatchCard } from '../components/DispatchCard';
import { Arrow } from '../components/Diagrams';

export function NewsPage() {
  const [filter, setFilter] = useState<NewsCategory | 'all'>('all');
  const posts = dispatches.filter(post => filter === 'all' || post.category === filter);
  return <>
    <section className="news-header container">
      <Link className="back-link" to="/">← Back to the workshop</Link>
      <h1>Lab Dispatches</h1>
      <p className="news-intro">Build updates, experiments, and everyday life in the workshop.</p>
    </section>
    <section className="container news-feed-section" aria-label="Lab dispatch feed">
      <div className="news-filter-bar">
        <div className="news-filters" role="group" aria-label="Filter dispatches">
          <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All updates</button>
          {Object.entries(newsCategories).map(([id, value]) => <button key={id} aria-pressed={filter === id}
            onClick={() => setFilter(id as NewsCategory)}>{value.label}</button>)}
        </div>
        <p className="results-count" aria-live="polite">{posts.length} {posts.length === 1 ? 'update' : 'updates'}</p>
      </div>
      <div className="dispatch-timeline">{posts.map(post => <div className="timeline-entry" key={post.id}>
        <div className="timeline-date"><time dateTime={post.date}>{post.date}</time>{post.pinned && <span>Pinned</span>}</div>
        <DispatchCard post={post}/>
      </div>)}</div>
      {!posts.length && <div className="empty-state"><h2>No updates in this category yet.</h2>
        <p>Explore the other dispatches from the workshop.</p>
        <button className="button button-primary" onClick={() => setFilter('all')}>Show all updates <Arrow/></button>
      </div>}
      <p className="end-of-log">You’re up to date. The work continues.</p>
    </section>
  </>;
}
