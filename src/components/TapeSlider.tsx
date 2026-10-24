import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CSSProperties, PointerEvent } from 'react';
import { imageDimensions, mediaUrl } from '../lib/media';
import { Arrow } from './Diagrams';

export interface TapeSlide {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  href?: string;
}

export interface TapeSliderProps {
  items: TapeSlide[];
  label?: string;
  heading?: string;
  intervalMs?: number;
  durationMs?: number;
  autoRoll?: boolean;
  fit?: 'cover' | 'contain';
  aspectRatio?: string;
  tapeEdges?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  footnote?: string;
}

type Direction = -1 | 1;
type Motion = { index: number; position: number; phase: 'idle' | 'rolling' | 'resetting' };

/** One flex track carries every frame. End clones make both wrap directions local. */
export function TapeSlider({
  items, label = 'Image filmstrip', heading = 'FILMSTRIP', intervalMs = 2000,
  durationMs = 600, autoRoll = true, fit = 'cover', aspectRatio = '4 / 3',
  tapeEdges = false, previousLabel = 'Previous image', nextLabel = 'Next image', footnote,
}: TapeSliderProps) {
  const count = items.length;
  const initial: Motion = { index: 0, position: count > 1 ? 1 : 0, phase: 'idle' };
  const [motion, setMotion] = useState<Motion>(initial);
  const latest = useRef<Motion>(initial);
  const queuedStep = useRef<Direction | null>(null);
  const [manual, setManual] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const itemKey = items.map(item => item.id).join('\0');

  const publish = useCallback((next: Motion) => { latest.current = next; setMotion(next); }, []);
  const step = useCallback((direction: Direction, fromUser = false) => {
    if (fromUser) setManual(true);
    if (count < 2) return;
    const current = latest.current;
    if (current.phase !== 'idle') {
      if (fromUser) queuedStep.current = direction;
      return;
    }
    if (reduced || durationMs <= 0) {
      const index = (current.index + direction + count) % count;
      publish({ index, position: index + 1, phase: 'idle' });
    } else {
      publish({ ...current, position: current.position + direction, phase: 'rolling' });
    }
  }, [count, durationMs, reduced, publish]);

  const finish = useCallback(() => {
    const current = latest.current;
    if (current.phase !== 'rolling' || count < 2) return;
    const index = (current.position - 1 + count) % count;
    // Any end clone and its real frame are visually identical. Reset with no tween.
    publish({ index, position: index + 1, phase: 'resetting' });
  }, [count, publish]);

  useEffect(() => {
    queuedStep.current = null;
    publish({ index: 0, position: count > 1 ? 1 : 0, phase: 'idle' });
    setManual(false);
  }, [itemKey, count, publish]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(preference.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { preference.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  useEffect(() => {
    if (!autoRoll || manual || hovered || focused || !visible || reduced || count < 2) return;
    const timer = window.setInterval(() => step(1), Math.max(intervalMs, durationMs + 100));
    return () => window.clearInterval(timer);
  }, [autoRoll, manual, hovered, focused, visible, reduced, count, intervalMs, durationMs, step]);

  useEffect(() => {
    if (motion.phase !== 'rolling') return;
    // Also settle if a browser drops transitionend after visibility/motion changes.
    const timer = window.setTimeout(finish, Math.max(0, durationMs) + 100);
    return () => window.clearTimeout(timer);
  }, [motion.phase, durationMs, finish]);

  useEffect(() => {
    if (motion.phase !== 'resetting') return;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        publish({ ...latest.current, phase: 'idle' });
        const pending = queuedStep.current;
        queuedStep.current = null;
        if (pending) step(pending, true);
      });
    });
    return () => { cancelAnimationFrame(firstFrame); cancelAnimationFrame(secondFrame); };
  }, [motion.phase, publish, step]);

  function endPointer(event: PointerEvent<HTMLElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) < 40 || Math.abs(x) < Math.abs(y) * 1.25) return;
    suppressClick.current = true;
    step(x < 0 ? 1 : -1, true);
  }

  if (!count) return null;
  const current = items[motion.index % count];
  const frames = count > 1 ? [items[count - 1], ...items, items[0]] : items;
  const mode = reduced ? 'STILL MODE' : manual || !autoRoll ? 'MANUAL STEP' : hovered || focused ? 'HOLD' : 'AUTO-ROLL';
  const style = { '--tape-duration': `${Math.max(0, durationMs)}ms`, '--tape-fit': fit, '--tape-aspect': aspectRatio } as CSSProperties;
  const picture = <>
    <div className={`tape-window ${tapeEdges ? 'tape-edges' : ''}`} role="group" aria-roledescription="slide" aria-label={`${motion.index + 1} of ${count}: ${current.title}`}
      onPointerDown={event => { suppressClick.current = false; if (event.pointerType !== 'mouse') pointerStart.current = { x: event.clientX, y: event.clientY }; }}
      onPointerUp={endPointer} onPointerCancel={() => { pointerStart.current = null; }}>
      <div className="tape-track" data-phase={motion.phase} aria-hidden="true" style={{ transform: `translate3d(${-motion.position * 100}%, 0, 0)` }}
        onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'transform') finish(); }}>
        {frames.map((item, slot) => <div className="tape-frame" key={`${slot}:${item.id}`} data-slot={slot} data-item-id={item.id}><img src={mediaUrl(item.src)} alt="" draggable={false} {...imageDimensions(item.src)} fetchPriority={slot === 1 ? 'high' : 'low'}/></div>)}
      </div>
    </div>
    <span className="carousel-caption"><span><small className="mono">{current.subtitle}</small><strong>{current.title}</strong></span>{current.href && <span className="carousel-link-icon"><Arrow diagonal/></span>}</span>
  </>;

  return <section className="project-carousel tape-slider" style={style} aria-roledescription="carousel" aria-label={label} tabIndex={0} data-mode={mode} data-phase={motion.phase}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1, true); } }}
    onClickCapture={event => { if (suppressClick.current && (event.target as Element).closest('.tape-window')) { suppressClick.current = false; event.preventDefault(); event.stopPropagation(); } }}>
    <div className="carousel-heading"><span className="eyebrow">{heading}</span><span className="mono tape-counter" aria-live={manual ? 'polite' : 'off'}>FRAME {String(motion.index + 1).padStart(2, '0')} // {String(count).padStart(2, '0')}</span></div>
    {current.href ? <Link className="carousel-project" to={current.href} aria-label={`Explore ${current.title}`}>{picture}</Link> : <div className="carousel-project" role="img" aria-label={current.alt}>{picture}</div>}
    <div className="carousel-controls"><span className="tape-status mono"><span aria-hidden="true"/>{mode}</span>{count > 1 && <div className="carousel-buttons"><button className="icon-button carousel-prev" aria-label={previousLabel} onClick={() => step(-1, true)}><Arrow/></button><button className="icon-button" aria-label={nextLabel} onClick={() => step(1, true)}><Arrow/></button></div>}</div>
    {footnote && <p className="carousel-footnote mono">{footnote}</p>}
  </section>;
}
