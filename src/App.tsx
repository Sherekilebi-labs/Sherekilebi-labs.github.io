import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { categories, lab } from './data';
import { latestDispatches } from './data/news';
import type { Project } from './data/types';
import { Arrow, EquipmentIcon } from './components/Diagrams';
import { ProjectMedia } from './components/ProjectMedia';
import { imageDimensions, mediaUrl } from './lib/media';
import { useTurntable } from './lib/use-turntable';
import { ProjectCarousel } from './components/ProjectCarousel';
import { ProjectSummary } from './components/ProjectSummary';
import { DispatchCard } from './components/DispatchCard';
const NewsPage = lazy(() =>
  import('./pages/NewsPage').then((module) => ({ default: module.NewsPage })),
);
const ProjectPage = lazy(() =>
  import('./pages/ProjectPage').then((module) => ({ default: module.ProjectPage })),
);

const navigation = [
  { href: '/#projects', label: 'Projects' },
  { href: '/news', label: 'Dispatches' },
  { href: '/#workbench', label: 'Workbench' },
  { href: '/#origins', label: 'Our story' },
  { href: '/#people', label: 'People' },
];

function Brand({ emblem = false }: { emblem?: boolean }) {
  return (
    <Link className="brand" to="/" aria-label="Sherekilebi Labs home">
      <img
        src={emblem ? '/tsatmfreni.svg' : '/Sherekilebi logo.png'}
        alt={emblem ? 'Sherekilebi Labs — Tsatmfreni emblem' : 'Sherekilebi Labs'}
        width={emblem ? 142 : 961}
        height={emblem ? 138 : 689}
      />
    </Link>
  );
}

function ScrollAndTitle() {
  const location = useLocation();
  useEffect(() => {
    const project = lab.projects.find(
      (item) => location.pathname === `/projects/${item.id}`,
    );
    document.title =
      location.pathname === '/news'
        ? 'Lab Dispatches — Sherekilebi Labs'
        : project
          ? `${project.title} — Sherekilebi Labs`
          : 'Sherekilebi Labs';
    let frame: number;
    let attempts = 0;
    const scroll = () => {
      const target = location.hash
        ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
        : document.querySelector('main h1');
      if (!target && attempts++ < 120) {
        frame = requestAnimationFrame(scroll);
        return;
      }
      if (location.hash) target?.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      if (location.key !== 'default')
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, location.key]);
  return null;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location]);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="header-inner container">
        <Brand emblem />
        <span className="header-location mono">
          TBILISI, GEORGIA
          <br />
          INDEPENDENT ROBOTICS LAB
        </span>
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
        <nav
          id="main-navigation"
          className={`navigation ${menuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          {navigation.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={
                link.href === '/news' && location.pathname === '/news'
                  ? 'page'
                  : undefined
              }
            >
              {link.label === 'Dispatches' && (
                <span className="news-dot" aria-hidden="true" />
              )}
              {link.label}
            </Link>
          ))}
          <a
            className="nav-github"
            href="https://github.com/Sherekilebi-labs"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow diagonal />
          </a>
        </nav>
      </div>
    </header>
  );
}

function SectionHeading({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
      </div>
      {children && <div className="section-description">{children}</div>}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const turntable = useTurntable(project.media.turntable?.frames, mediaUrl);
  return (
    <article className={`project-card accent-${project.accent}`} ref={turntable.card}
      onPointerMove={turntable.onPointerMove} onPointerLeave={turntable.onPointerLeave}
      data-turntable-ready={turntable.ready} data-frame={turntable.frame}>
      <div className="card-cover">
        <ProjectMedia media={project.media} frame={turntable.frame} turntableReady={turntable.ready}/>
        {project.logo && <img className="card-cover-logo" src={mediaUrl(project.logo.src)} alt={project.logo.alt} loading="lazy" {...imageDimensions(project.logo.src)}/>}
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3>
            <Link
              to={`/projects/${project.id}`}
              aria-label={`Explore ${project.title}`}
            >
              {project.title}
            </Link>
          </h3>
          <Arrow diagonal />
        </div>
        <ProjectSummary className="card-summary">
          {project.cardSummary || project.summary}
        </ProjectSummary>
        <span className="status-label"><span aria-hidden="true" />{project.status}</span>
        <div className="tags">
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function HomePage() {
  const [category, setCategory] = useState('All projects');
  const filtered = lab.projects.filter(
    (project) => category === 'All projects' || project.category === category,
  );
  const filtersActive = category !== 'All projects';
  function reset() { setCategory('All projects'); }
  return (
    <>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-grid container">
          <div className="hero-copy">
            <h1 id="hero-title">Robotics, built in our workshop in Tbilisi.</h1>
            <p className="hero-description">
              We build robot arms, competition robots, and practical tools - covering
               CAD, electronics, code, and experiments.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                Explore projects <Arrow />
              </a>
              <Link className="text-link" to="/news">
                Latest updates <Arrow diagonal />
              </Link>
            </div>
            <blockquote className="hero-supporting-quote">
              <p>“I told you they would fly, you suit!”</p>
              <cite>- Sherekilebi (The Eccentrics), 1973</cite>
            </blockquote>
          </div>
          <ProjectCarousel />
        </div>
        <div className="hero-bottom container">
          <div className="hero-stats">
            <div>
              <strong>{lab.projects.length}</strong>
              <span>Projects</span>
            </div>
            <div>
              <strong>{lab.people.length}</strong>
              <span>Members</span>
            </div>
            <div>
              <img
                className="hero-flag"
                src="/media/georgia-flag.svg"
                alt="Flag of Georgia"
                width="36"
                height="24"
              />
              <span>Tbilisi, Georgia</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section container" id="projects" aria-label="Projects">
        <SectionHeading title="Projects"></SectionHeading>
        <div className="filter-bar">
          <div
            className="category-filters"
            role="group"
            aria-label="Filter projects by category"
          >
            {['All projects', ...categories].map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
                {item === 'All projects' && (
                  <span>{String(lab.projects.length).padStart(2, '0')}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="results-line">
          <p aria-live="polite" aria-atomic="true">
            {filtered.length} of {lab.projects.length} projects
          </p>
          {filtersActive && (
            <button className="reset-filters" onClick={reset}>
              Show all projects
            </button>
          )}
        </div>
        {filtered.length ? (
          <div className="project-grid">
            {filtered.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true" className="empty-symbol">
              [ ∅ ]
            </span>
            <h3>No projects match this category.</h3>
            <p>Choose another category to explore the workshop’s projects.</p>
            <button className="button button-primary" onClick={reset}>
              Show all projects <Arrow />
            </button>
          </div>
        )}
      </section>
      <section className="dispatches-home" aria-label="Latest Lab Dispatches">
        <div className="container section">
          <SectionHeading title="Latest dispatches">
            <Link className="button button-secondary" to="/news">
              All dispatches <Arrow diagonal />
            </Link>
          </SectionHeading>
          <div className="latest-dispatch-grid">
            {latestDispatches.map((post) => (
              <DispatchCard key={post.id} post={post} preview />
            ))}
          </div>
        </div>
      </section>
      <section className="section container" id="workbench" aria-label="Lab equipment">
        <SectionHeading title="The workshop">
        </SectionHeading>
        <div className="equipment-list">
          {lab.equipment.map((equipment) => (
            <article className="equipment" key={equipment.id}>
              <div className="equipment-icon">
                <EquipmentIcon kind={equipment.id} />
              </div>
              <div className="equipment-name">
                <h3>{equipment.name}</h3>
                <p className="equipment-capability">{equipment.title}</p>
              </div>
              <div className="equipment-description">
                <p>{equipment.description}</p>
                <div className="tags">
                  {equipment.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="origins-section" id="origins" aria-label="Our story">
        <div className="container origins-grid">
          <div>
            <h2>{lab.origins.title}</h2>
            <p className="origins-description">{lab.origins.description}</p>
            <p className="origin-location mono">
              ↗ {lab.location} · {lab.origins.period}
            </p>
            <div className="film-note">
              <h3>Why “Sherekilebi”?</h3>
              <p>
                Our name is a nod to <em>The Eccentrics</em>, Eldar Shengelaia’s
                Georgian film, and to the freedom of imagining something improbable. Our
                experiments and workshop are our own.
              </p>
            </div>
          </div>
          <div className="origin-print">
            <img
              src="/tsatmfreni.svg"
              alt="The lab’s own Tsatmfreni flying-machine emblem"
              width="240"
              height="240"
            />
            <div className="origin-print-bottom">
              <strong>2026</strong>
              <span className="mono">
                A place to build
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section container" id="people" aria-label="People">
        <SectionHeading title="Our team">
        </SectionHeading>
        <div className="people-grid">
          {lab.people.map((person) => (
            <article className="person-card" key={person.id}>
              <div className="person-top">
                <div className="person-avatar" aria-hidden="true">
                  {person.initials}
                </div>

              </div>
              <p className="eyebrow">{person.role}</p>
              <h3>{person.name}</h3>
              <p>{person.bio}</p>
              <div className="tags">
                {person.specialties.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {person.links.map((link) => (
                <a
                  className="text-link"
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <Arrow diagonal />
                </a>
              ))}
            </article>
          ))}
        </div>
      </section>
      <section className="source-section" id="source" aria-label="Source code">
        <div className="container source-layout">
          <div>
            <h2>
              The work continues
              <br />
              in the source.
            </h2>
          </div>
          <a
            className="source-org-link"
            href="https://github.com/Sherekilebi-labs"
            target="_blank"
            rel="noreferrer"
          >
            <span className="mono">GITHUB / SHEREKILEBI-LABS</span>
            <strong>
              Open the repositories <Arrow diagonal />
            </strong>
            <small>Firmware, project files, and the details worth sharing.</small>
          </a>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <Brand />
        <div>
          <p className="mono">SHEREKILEBI LABS / TBILISI, GEORGIA</p>
          <p>Built with curiosity. Occasionally with spare parts.</p>
          <p className="footer-credit">
            Name inspired by Eldar Shengelaia’s <em>The Eccentrics</em>. Independent and
            unaffiliated.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/news">
            Dispatches <Arrow diagonal />
          </Link>
          <a
            href="https://github.com/Sherekilebi-labs"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow diagonal />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <ScrollAndTitle />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="container section mono" role="status">
              Loading page…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
            <Route
              path="*"
              element={
                <section className="container section not-found">
                  <p className="eyebrow">404 / OFF THE FLIGHT PATH</p>
                  <h1>
                    A wrong turn.
                    <br />A good story.
                  </h1>
                  <Link className="button button-primary" to="/">
                    Return to the workshop <Arrow />
                  </Link>
                </section>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
