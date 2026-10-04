/* ============================================================
   Hero Nebula — Three.js starfield + green/blue/orange nebula
   Self-contained: uses vendored assets/js/vendor/three.min.js.
   Falls back silently to the CSS glow if WebGL/THREE is missing.
   Pauses when the hero is off-screen or the tab is hidden.
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("nebula-canvas");
  if (!canvas || !window.THREE) return;

  var hero = canvas.closest(".hero") || canvas.parentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (err) {
    return; /* no WebGL — CSS glow remains */
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
  camera.position.z = 420;

  /* Soft round sprite texture (no external assets) */
  function makeSprite() {
    var c = document.createElement("canvas");
    c.width = c.height = 128;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    var tex = new THREE.CanvasTexture(c);
    return tex;
  }
  var sprite = makeSprite();

  function makeCloud(color, count, size, spreadX, spreadY, opacity) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * spreadX;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * spreadY;
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * 220;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      size: size,
      map: sprite,
      color: color,
      transparent: true,
      opacity: opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    var points = new THREE.Points(geo, mat);
    scene.add(points);
    return points;
  }

  function spread() {
    var w = hero.clientWidth || window.innerWidth;
    var h = hero.clientHeight || 480;
    return { x: w * 0.75, y: Math.max(h * 0.6, 220) };
  }

  var s = spread();
  /* Nebula dust: green + blue mix with an orange accent.
     Many small faint sprites blend into a wash; avoid big blobs. */
  var green = makeCloud(0x10b981, 260, 55, s.x, s.y, 0.16);
  var teal = makeCloud(0x00d4c8, 200, 45, s.x, s.y, 0.13);
  var blue = makeCloud(0x2f7bff, 320, 60, s.x, s.y, 0.16);
  var orange = makeCloud(0xffa42b, 150, 50, s.x, s.y, 0.12);
  /* Distant white stars */
  var stars = makeCloud(0xffffff, 260, 3.2, s.x * 1.1, s.y * 1.1, 0.8);
  stars.material.sizeAttenuation = false;

  function resize() {
    var w = hero.clientWidth || window.innerWidth;
    var h = hero.clientHeight || 480;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  /* One static frame for reduced-motion users */
  function renderFrame(t) {
    green.rotation.z = t * 0.008;
    blue.rotation.z = -t * 0.006;
    teal.rotation.z = t * 0.005;
    orange.rotation.z = -t * 0.009;
    green.position.x = Math.sin(t * 0.25) * 14;
    blue.position.x = Math.cos(t * 0.2) * 16;
    orange.position.y = Math.sin(t * 0.3) * 10;
    stars.rotation.y = t * 0.004;
    var tw = 0.65 + Math.sin(t * 1.4) * 0.15;
    stars.material.opacity = tw;
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    renderFrame(1.2);
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
    var t = ((now || performance.now()) - start) / 1000;
    renderFrame(t);
  })();
})();
