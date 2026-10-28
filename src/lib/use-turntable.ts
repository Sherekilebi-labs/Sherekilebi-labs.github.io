import { useEffect, useRef, useState, type PointerEvent } from 'react';

const eligibility = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function useTurntable(frames: string[] | undefined, url: (source: string) => string) {
  const card = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState(0);
  const eligible = useRef(false);

  useEffect(() => {
    if (!frames || frames.length !== 6 || !card.current) return;
    const media = window.matchMedia(eligibility);
    let cancelled = false;
    let loading = false;
    let observer: IntersectionObserver | undefined;
    const images: HTMLImageElement[] = [];
    const load = async () => {
      if (loading) return;
      loading = true;
      try {
        await Promise.all(frames.map(source => {
          const image = new Image();
          images.push(image);
          image.src = url(source);
          return image.decode();
        }));
        if (!cancelled && media.matches) setReady(true);
      } catch {
        if (!cancelled) setReady(false);
      }
    };
    const update = () => {
      eligible.current = media.matches;
      setFrame(0);
      setReady(false);
      observer?.disconnect();
      if (!media.matches) return;
      if (loading && images.length === 6 && images.every(image => image.complete && image.naturalWidth > 0)) {
        setReady(true);
        return;
      }
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer?.disconnect();
          void load();
        }
      }, { rootMargin: '200px' });
      if (card.current) observer.observe(card.current);
    };
    update();
    media.addEventListener('change', update);
    return () => {
      cancelled = true;
      eligible.current = false;
      observer?.disconnect();
      media.removeEventListener('change', update);
    };
  }, [frames, url]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!ready || !eligible.current || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = Math.max(0, Math.min(5, Math.floor((event.clientX - bounds.left) / bounds.width * 6)));
    setFrame(previous => previous === next ? previous : next);
  };

  return { card, ready, frame, onPointerMove, onPointerLeave: () => setFrame(0) };
}
