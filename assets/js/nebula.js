/* ============================================================
   Hero Nebula — custom GLSL emission nebula (Hubble palette)
   Domain-warped fractal gas in OIII blue + teal-green with gold
   star-forming cores, dark dust lanes, procedural starfield,
   film grain. Self-contained: vendored three.min.js only.
   Falls back silently to the CSS glow if WebGL/THREE is missing.
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("nebula-canvas");
  if (!canvas || !window.THREE) return;

  var hero = canvas.closest(".hero") || canvas.parentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: false, antialias: false });
  } catch (err) {
    return; /* no WebGL — CSS glow remains */
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  var uniforms = {
    uTime: { value: 0.0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uSeed: { value: 3.7 }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    depthWrite: false,
    depthTest: false,
    vertexShader: [
      "varying vec2 vUv;",
      "void main() {",
      "  vUv = uv;",
      "  gl_Position = vec4(position.xy, 0.0, 1.0);",
      "}"
    ].join("\n"),
    fragmentShader: [
      "precision highp float;",
      "varying vec2 vUv;",
      "uniform vec2 uRes;",
      "uniform float uTime;",
      "uniform float uSeed;",

      "float hash21(vec2 p) {",
      "  p = fract(p * vec2(234.34, 435.345));",
      "  p += dot(p, p + 34.23);",
      "  return fract(p.x * p.y);",
      "}",

      "float vnoise(vec2 p) {",
      "  vec2 i = floor(p);",
      "  vec2 f = fract(p);",
      "  vec2 u = f * f * (3.0 - 2.0 * f);",
      "  float a = hash21(i);",
      "  float b = hash21(i + vec2(1.0, 0.0));",
      "  float c = hash21(i + vec2(0.0, 1.0));",
      "  float d = hash21(i + vec2(1.0, 1.0));",
      "  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);",
      "}",

      "float fbm(vec2 p) {",
      "  float v = 0.0;",
      "  float a = 0.5;",
      "  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);",
      "  for (int i = 0; i < 6; i++) {",
      "    v += a * vnoise(p);",
      "    p = r * p * 2.0 + 11.5;",
      "    a *= 0.5;",
      "  }",
      "  return v;",
      "}",

      /* One star layer: sparse cell-hash suns with halo + twinkle */
      "vec3 starLayer(vec2 p, float scale, float density, float bright) {",
      "  vec2 g = floor(p * scale);",
      "  vec2 f = fract(p * scale);",
      "  float h = hash21(g);",
      "  if (h > density) return vec3(0.0);",
      "  vec2 sp = vec2(hash21(g + 7.13), hash21(g + 3.71));",
      "  float d = length(f - sp);",
      "  float tw = 0.55 + 0.45 * sin(uTime * (0.6 + h * 3.0) + h * 43.0);",
      "  float core = smoothstep(0.10, 0.0, d);",
      "  float halo = smoothstep(0.45, 0.0, d) * 0.30;",
      "  float warm = step(0.78, hash21(g + 1.7));",
      "  vec3 tint = mix(vec3(0.72, 0.83, 1.0), vec3(1.0, 0.82, 0.60), warm);",
      "  return tint * (core + halo) * tw * bright;",
      "}",

      "void main() {",
      "  vec2 frag = vUv;",
      "  float aspect = uRes.x / uRes.y;",
      "  vec2 auv = frag;",
      "  auv.x *= aspect;",
      "  vec2 p = auv * 2.1 + uSeed * 17.0;",
      "  vec2 drift = vec2(uTime * 0.010, uTime * 0.006);",

      /* Domain-warped turbulent gas */
      "  float w1 = fbm(p * 1.4 + drift);",
      "  float w2 = fbm(p * 1.4 + vec2(5.2, 1.3) - drift * 0.7);",
      "  vec2 q = vec2(w1, w2);",
      "  float base = fbm(p * 2.2 + q * 2.0 - vec2(drift.x * 1.5, -drift.y));",
      "  float d = smoothstep(0.30, 0.86, base);",
      "  d = pow(d, 1.35);",

      /* Dark dust lanes silhouetted over the gas */
      "  float ridge = 1.0 - abs(2.0 * vnoise(p * 3.6 + q * 2.6 + drift) - 1.0);",
      "  ridge = pow(ridge, 3.0);",
      "  float dust = smoothstep(0.42, 0.85, ridge) * smoothstep(0.08, 0.55, base);",
      "  d *= 1.0 - dust * 0.82;",

      /* Hubble palette: deep space -> OIII blue -> teal -> gold cores */
      "  vec3 col = vec3(0.008, 0.012, 0.038);",
      "  col = mix(col, vec3(0.09, 0.26, 0.72), smoothstep(0.04, 0.55, d));",
      "  col = mix(col, vec3(0.04, 0.72, 0.58), smoothstep(0.34, 0.74, d) * 0.85);",
      "  col = mix(col, vec3(1.00, 0.52, 0.14), smoothstep(0.60, 0.95, d));",
      "  col += vec3(0.85, 0.92, 1.0) * pow(d, 3.0) * 0.38;",

      /* Starfield: bright sparse + dense faint */
      "  vec3 stars = starLayer(p, 34.0, 0.10, 1.0);",
      "  stars += starLayer(p + 4.7, 90.0, 0.09, 0.55);",
      "  stars += starLayer(p + 9.1, 200.0, 0.10, 0.30);",
      "  stars *= 1.0 - dust * 0.55;",
      "  col += stars;",

      /* Readability: dim the middle where the headline sits */
      "  vec2 c = frag - 0.5;",
      "  c.x *= aspect;",
      "  float cd = smoothstep(0.78, 0.05, length(c));",
      "  col *= 1.0 - cd * 0.62;",

      /* Vignette into the page background */
      "  float vig = smoothstep(1.25, 0.25, length(c) * 1.15);",
      "  col *= mix(0.35, 1.0, vig);",

      /* Film grain */
      "  float gr = hash21(frag * uRes * 0.5 + fract(uTime) * 7.0);",
      "  col += (gr - 0.5) * 0.045;",

      "  gl_FragColor = vec4(col, 1.0);",
      "}"
    ].join("\n")
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    var w = hero.clientWidth || window.innerWidth;
    var h = hero.clientHeight || 480;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
  }
  resize();
  window.addEventListener("resize", resize);

  function frame(t) {
    uniforms.uTime.value = t;
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    frame(8.0);
    return;
  }

  var running = true;
  var inView = true;

  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inView = entry.isIntersecting;
      });
    }, { threshold: 0 }).observe(hero);
  }

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
  });

  var start = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!running || !inView || document.hidden) return;
    frame(((now || performance.now()) - start) / 1000);
  })();
})();
