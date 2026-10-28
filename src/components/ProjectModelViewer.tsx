import { useEffect, useRef, useState } from 'react';
import type { Media } from '../data/types';
import type { CadViewer } from '../lib/cad-viewer';
import { mediaUrl } from '../lib/media';

export function ProjectModelViewer({ model, onFailure }: { model: NonNullable<Media['model']>; onFailure: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<CadViewer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fail = () => {
      if (controller.signal.aborted) return;
      controller.abort();
      onFailure();
    };
    const timer = window.setTimeout(fail, 30000);
    setReady(false);
    import('../lib/cad-viewer')
      .then(({ createCadViewer }) => {
        if (controller.signal.aborted || !host.current) return null;
        return createCadViewer(host.current, mediaUrl(model.src), model.alt, controller.signal, fail);
      })
      .then(instance => {
        if (!instance) return;
        if (controller.signal.aborted) return instance.dispose();
        window.clearTimeout(timer);
        viewer.current = instance;
        setReady(true);
      })
      .catch(() => fail());
    return () => {
      window.clearTimeout(timer);
      controller.abort();
      viewer.current?.dispose();
      viewer.current = null;
    };
  }, [model.src, model.alt, onFailure]);

  return <div className={`cad-viewer ${ready ? 'is-ready' : ''}`} data-state={ready ? 'ready' : 'loading'}>
    <div className="cad-viewer-canvas" ref={host}/>
    {!ready && <p className="cad-viewer-loading" role="status">Loading 3D model…</p>}
    {ready && <div className="cad-viewer-toolbar">
      <span className="cad-viewer-hint">Drag to rotate</span>
      <div className="cad-viewer-buttons">
        <button type="button" aria-label="Zoom out" onClick={() => viewer.current?.zoom(1 / 1.2)}>−</button>
        <button type="button" aria-label="Zoom in" onClick={() => viewer.current?.zoom(1.2)}>+</button>
        <button type="button" onClick={() => viewer.current?.reset()}>Reset view</button>
      </div>
    </div>}
  </div>;
}
