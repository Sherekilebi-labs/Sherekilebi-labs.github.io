import {
  BackSide, Box3, Color, DirectionalLight, EdgesGeometry, Group, HemisphereLight,
  Material, Mesh, MeshStandardMaterial, OrthographicCamera, Scene, Sphere,
  ShaderMaterial, Spherical, SRGBColorSpace, Texture, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';

export interface CadViewer {
  reset(): void;
  zoom(factor: number): void;
  dispose(): void;
}

function disposeModel(root: Group) {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  root.traverse(object => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
  });
  for (const material of materials) {
    for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
    material.dispose();
  }
  for (const texture of textures) {
    texture.dispose();
    if (typeof ImageBitmap !== 'undefined' && texture.source.data instanceof ImageBitmap) texture.source.data.close();
  }
}

export async function createCadViewer(
  host: HTMLElement, source: string, alt: string, signal: AbortSignal,
  onContextLost: () => void,
): Promise<CadViewer> {
  let renderer: WebGLRenderer | undefined;
  let root: Group | undefined;
  let controls: OrbitControls | undefined;
  let observer: ResizeObserver | undefined;
  let disposed = false;
  const removeListeners: (() => void)[] = [];
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    removeListeners.forEach(remove => remove());
    controls?.dispose();
    if (root) disposeModel(root);
    renderer?.dispose();
    renderer?.domElement.remove();
  };
  const abort = () => dispose();
  signal.addEventListener('abort', abort, { once: true });
  removeListeners.push(() => signal.removeEventListener('abort', abort));

  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    const response = await fetch(source, { signal });
    if (!response.ok) throw new Error('Model could not be loaded');
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const gltf = await loader.parseAsync(await response.arrayBuffer(), source.substring(0, source.lastIndexOf('/') + 1));
    root = gltf.scene;
    if (signal.aborted || disposed) {
      disposeModel(root);
      throw new DOMException('Viewer was closed', 'AbortError');
    }

    const scene = new Scene();
    const bounds = new Box3().setFromObject(root);
    const sphere = bounds.getBoundingSphere(new Sphere());
    const radius = sphere.radius;
    if (!Number.isFinite(radius) || radius <= 0) throw new Error('Empty model');
    root.position.sub(sphere.center);
    scene.add(root);
    scene.add(new HemisphereLight(0xffffff, 0x8b96a5, 2.2));
    const key = new DirectionalLight(0xffffff, 2.5);
    key.position.set(-3, 6, 4);
    scene.add(key);
    const fill = new DirectionalLight(0xffffff, 1);
    fill.position.set(4, 3, -1);
    scene.add(fill);

    // Extract feature edges, not the mesh's tessellation diagonals. Keep part
    // boundaries separate so adjoining components retain their seam lines.
    const meshes: Mesh[] = [];
    root.traverse(object => { if (object instanceof Mesh) meshes.push(object); });
    const outline = new ShaderMaterial({
      side: BackSide, depthTest: true, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2,
      uniforms: { viewport: { value: new Vector2(800, 600) }, thickness: { value: 1.35 } },
      vertexShader: `
        uniform vec2 viewport;
        uniform float thickness;
        void main() {
          vec4 positionInView = modelViewMatrix * vec4(position, 1.0);
          vec4 clip = projectionMatrix * positionInView;
          vec2 direction = (projectionMatrix * vec4(normalize(normalMatrix * normal), 0.0)).xy;
          float magnitude = length(direction);
          if (magnitude > 0.00001) clip.xy += direction / magnitude * (2.0 * thickness / viewport) * clip.w;
          gl_Position = clip;
        }`,
      fragmentShader: 'void main() { gl_FragColor = vec4(0.025, 0.025, 0.025, 1.0); }',
    });
    for (const mesh of meshes) {
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        if (material instanceof MeshStandardMaterial) {
          material.metalness = 0;
          material.roughness = 0.88;
          material.polygonOffset = true;
          material.polygonOffsetFactor = 1;
          material.polygonOffsetUnits = 1;
        }
      }
      const edges = new EdgesGeometry(mesh.geometry, 25);
      const geometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
      edges.dispose();
      const material = new LineMaterial({ color: new Color('#101114').getHex(), linewidth: 1.5, depthTest: true, depthWrite: false });
      const lines = new LineSegments2(geometry, material);
      lines.renderOrder = 1;
      mesh.add(lines);
      const silhouette = new Mesh(mesh.geometry, outline);
      silhouette.renderOrder = 2;
      mesh.add(silhouette);
    }

    const camera = new OrthographicCamera(-radius, radius, radius, -radius, radius / 100, radius * 20);
    const initialPosition = new Vector3(-6, 5, 8).normalize().multiplyScalar(radius * 5);
    camera.position.copy(initialPosition);
    camera.lookAt(0, 0, 0);
    scene.updateMatrixWorld(true);
    const viewRotation = camera.quaternion.clone().invert();
    const point = new Vector3();
    const projected = new Vector3();
    const axis = new Vector3(0, 1, 0);
    let projectedHalfWidth = 0;
    let projectedHalfHeight = 0;
    // Fit the real assembly across the same six yaw positions as the renders,
    // avoiding the excessive empty space of a bounding-sphere camera fit.
    for (const mesh of meshes) {
      const positions = mesh.geometry.getAttribute('position');
      for (let vertex = 0; vertex < positions.count; vertex++) {
        point.fromBufferAttribute(positions, vertex).applyMatrix4(mesh.matrixWorld);
        for (let step = 0; step < 6; step++) {
          projected.copy(point).applyAxisAngle(axis, step * Math.PI / 3).applyQuaternion(viewRotation);
          projectedHalfWidth = Math.max(projectedHalfWidth, Math.abs(projected.x));
          projectedHalfHeight = Math.max(projectedHalfHeight, Math.abs(projected.y));
        }
      }
    }
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${alt}. Use arrow keys to rotate, plus and minus to zoom, and Home to reset.`);
    host.append(canvas);
    controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.enableZoom = false;
    controls.minZoom = 0.65;
    controls.maxZoom = 4;
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI - 0.08;
    // Vertical touch gestures scroll the page; horizontal gestures rotate.
    canvas.style.touchAction = 'pan-y';
    const activeRenderer = renderer;
    const activeControls = controls;
    const render = () => { if (!disposed) activeRenderer.render(scene, camera); };
    controls.addEventListener('change', render);
    const resize = () => {
      if (disposed) return;
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      const halfHeight = Math.max(projectedHalfHeight, projectedHalfWidth / aspect) * 1.14;
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      outline.uniforms.viewport.value.set(width, height);
      activeRenderer.setSize(width, height);
      render();
    };
    const zoom = (factor: number) => {
      camera.zoom = Math.min(4, Math.max(0.65, camera.zoom * factor));
      camera.updateProjectionMatrix();
      render();
    };
    const reset = () => {
      camera.position.copy(initialPosition);
      camera.zoom = 1;
      activeControls.target.set(0, 0, 0);
      camera.updateProjectionMatrix();
      activeControls.update();
      render();
    };
    const keydown = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') return reset();
      if (['+', '=', '-'].includes(event.key)) return zoom(event.key === '-' ? 1 / 1.2 : 1.2);
      const orbit = new Spherical().setFromVector3(camera.position);
      if (event.key === 'ArrowLeft') orbit.theta -= Math.PI / 12;
      if (event.key === 'ArrowRight') orbit.theta += Math.PI / 12;
      if (event.key === 'ArrowUp') orbit.phi = Math.max(0.08, orbit.phi - Math.PI / 12);
      if (event.key === 'ArrowDown') orbit.phi = Math.min(Math.PI - 0.08, orbit.phi + Math.PI / 12);
      camera.position.setFromSpherical(orbit);
      activeControls.update();
      render();
    };
    const focus = () => { activeControls.enableZoom = true; };
    const blur = () => { activeControls.enableZoom = false; };
    const pointerdown = () => canvas.focus({ preventScroll: true });
    const lost = (event: Event) => { event.preventDefault(); onContextLost(); };
    canvas.addEventListener('keydown', keydown);
    canvas.addEventListener('pointerdown', pointerdown);
    canvas.addEventListener('focus', focus);
    canvas.addEventListener('blur', blur);
    canvas.addEventListener('webglcontextlost', lost);
    removeListeners.push(() => {
      canvas.removeEventListener('keydown', keydown);
      canvas.removeEventListener('pointerdown', pointerdown);
      canvas.removeEventListener('focus', focus);
      canvas.removeEventListener('blur', blur);
      canvas.removeEventListener('webglcontextlost', lost);
    });
    observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    return { reset, zoom, dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
