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
    <section className="news-header container"><Link className="back-link mono" to="/">← BACK TO THE WORKSHOP</Link><p className="eyebrow">MESSAGES FROM THE WORKBENCH</p><h1>Lab Dispatches<span>// Flight Log</span></h1><p className="news-intro mono">R&amp;D breakthroughs, workshop upgrades, and occasional mechanical chaos.<br/>{' '}Filed by the eccentrics. Read at your own curiosity.</p><div className="news-header-stamp"><img src="/tsatmfreni.svg" alt="" width="100" height="100"/><span className="mono">TSATMFRENI<br/>FLIGHT LOG / 2026</span></div></section>
    <section className="container news-feed-section" aria-label="Lab dispatch feed"><div className="news-filter-bar"><div className="news-filters" role="group" aria-label="Filter dispatches"><button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All signals</button>{Object.entries(newsCategories).map(([id, value]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id as NewsCategory)}>{value.label}</button>)}</div><p className="mono" aria-live="polite">{String(posts.length).padStart(2, '0')} TRANSMISSIONS</p></div>
      <div className="dispatch-timeline">{posts.map(post => <div className="timeline-entry" key={post.id}><div className="timeline-date"><time dateTime={post.date}>[{post.date.replaceAll('-', '.')}]</time><span className="mono">{newsCategories[post.category].code} / {post.pinned ? 'PINNED' : 'LOG ENTRY'}</span></div><DispatchCard post={post}/></div>)}</div>
      {!posts.length && <div className="empty-state"><h2>Quiet on this frequency.</h2><p>No dispatches in this category yet.</p><button className="button button-primary" onClick={() => setFilter('all')}>Show all signals <Arrow/></button></div>}
      <p className="end-of-log mono"><span aria-hidden="true">✦</span> END OF CURRENT TRANSMISSIONS. THE WORK CONTINUES.</p>
    </section>
  </>;
}
