/**
 * The La Terapia signature scene.
 *
 * A single full-bleed photographic plane seen through moving water. Scroll
 * drives `uProgress` from 1 → 0: the image begins heavily refracted and
 * chromatically split, and resolves into stillness as the copy unfolds.
 * Disorganisation reorganising, the claim the method actually makes.
 *
 * Runs on OGL (~10KB) rather than Three.js: this is one shaded plane, not
 * a scene, so there is no geometry, lighting or camera management to justify
 * the heavier dependency.
 */
import { Renderer, Triangle, Program, Mesh, Texture } from "ogl";
import { gsap, ScrollTrigger, onCleanup, prefersReducedMotion } from "../motion";

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform float uTime;
  uniform float uProgress;   // 1 = fully refracted, 0 = resolved
  uniform vec2  uResolution;
  uniform vec2  uImageSize;
  varying vec2 vUv;

  // Cheap value noise, enough to break up the sine banding without
  // the cost of a full simplex implementation.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Cover-fit so the plate never distorts with the viewport.
  vec2 coverUv(vec2 uv, vec2 res, vec2 img) {
    vec2 s = res / img;
    float scale = max(s.x, s.y);
    vec2 size = img * scale;
    vec2 offset = (res - size) * 0.5;
    return (uv * res - offset) / size;
  }

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uImageSize);

    float p = uProgress;

    // Layered travelling waves, amplitude falling with progress.
    float w1 = sin(uv.y * 11.0 - uTime * 0.55);
    float w2 = sin(uv.x * 7.0 + uTime * 0.38);
    float n  = noise(uv * 4.0 + uTime * 0.09) - 0.5;

    vec2 disp = vec2(w1 * 0.016 + n * 0.05, w2 * 0.012 + n * 0.04) * p;

    // Refraction: the channels bend by slightly different amounts, which
    // reads as light through water rather than as an RGB glitch.
    float split = 0.006 * p;
    float r = texture2D(tMap, uv + disp * 1.00 + vec2(split, 0.0)).r;
    float g = texture2D(tMap, uv + disp * 0.94).g;
    float b = texture2D(tMap, uv + disp * 0.88 - vec2(split, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // Caustic highlight riding the wave crests, tinted bronze so the
    // light belongs to the brand's candle world, not to a pool.
    float crest = smoothstep(0.72, 1.0, w1 * 0.5 + w2 * 0.5 + 0.5);
    col += vec3(0.75, 0.51, 0.26) * crest * 0.16 * p;

    // Settle toward the graded plate: darker, cooler in shadow.
    col = mix(col, col * vec3(0.92, 0.94, 0.95), 0.35);
    col *= 1.0 - 0.28 * p;

    // Vignette keeps type legible over the plate at every progress value.
    vec2 d = vUv - 0.5;
    col *= 1.0 - smoothstep(0.34, 0.86, dot(d, d) * 2.0) * 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export interface RefractionHandle {
  destroy: () => void;
}

export function createRefraction(
  canvas: HTMLCanvasElement,
  imageSrc: string,
): RefractionHandle | null {
  // Static poster already sits behind the canvas, so bailing is safe.
  if (prefersReducedMotion()) return null;

  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas,
      alpha: false,
      antialias: false,
      // Shader cost scales with pixels; 2 is plenty on retina and keeps
      // high-DPR phones from rendering 3× more than they can sustain.
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
  } catch {
    return null; // no WebGL context, poster remains visible
  }

  const gl = renderer.gl;
  const texture = new Texture(gl, { generateMipmaps: false });

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      tMap: { value: texture },
      uTime: { value: 0 },
      uProgress: { value: 1 },
      uResolution: { value: [1, 1] },
      uImageSize: { value: [1, 1] },
    },
  });

  const geometry = new Triangle(gl);
  const mesh = new Mesh(gl, { geometry, program });

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageSrc;
  img.onload = () => {
    texture.image = img;
    program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
    canvas.dataset.ready = "true";
  };

  // Measure the PARENT, never the canvas. renderer.setSize() writes inline
  // width/height onto the canvas, which beats the CSS sizing classes; once the
  // canvas shrank, observing it fed its own shrunken size back in and it could
  // never recover, leaving a small plate stranded in the corner.
  const host = (canvas.parentElement ?? canvas) as HTMLElement;

  const resize = () => {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height);
    // Re-assert layout ownership after OGL's inline write.
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    program.uniforms.uResolution.value = [r.width * renderer.dpr, r.height * renderer.dpr];
  };
  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // Only render while the scene is on screen.
  let visible = false;
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e?.isIntersecting ?? false;
    },
    { rootMargin: "120px" },
  );
  io.observe(canvas);

  // Driven by the shared GSAP ticker, no second RAF loop.
  let lastW = 0, lastH = 0;
  const tick = (time: number) => {
    if (!visible) return;
    const r = host.getBoundingClientRect();
    if (Math.abs(r.width - lastW) > 1 || Math.abs(r.height - lastH) > 1) {
      lastW = r.width; lastH = r.height;
      resize();
    }
    program.uniforms.uTime.value = time;
    renderer.render({ scene: mesh });
  };
  gsap.ticker.add(tick);

  const st = ScrollTrigger.create({
    trigger: canvas.closest("[data-scene]") ?? canvas,
    start: "top bottom",
    end: "bottom top",
    scrub: 1.1,
    onUpdate: (self) => {
      // Refracted at the edges of the scene, resolved through the middle.
      const t = self.progress;
      program.uniforms.uProgress.value = Math.abs(t - 0.5) * 2;
    },
  });

  const destroy = () => {
    gsap.ticker.remove(tick);
    st.kill();
    io.disconnect();
    ro.disconnect();
    // Explicit GPU teardown, otherwise view transitions leak contexts.
    gl.deleteProgram(program.program);
    gl.deleteTexture(texture.texture);
    geometry.remove();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  onCleanup(destroy);
  return { destroy };
}
