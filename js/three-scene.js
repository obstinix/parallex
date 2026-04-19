/**
 * Three.js 3D Scene — particles, wireframe icosahedron, scroll-linked rotation
 * Canvas is position:fixed behind existing parallax content.
 * Uses CSS custom properties for theming (dark + light mode).
 *
 * Phase 4: Mouse proximity repulsion + spring-back on particles.
 */

(function () {
  "use strict";

  /* ─── Reduced-motion bail-out ─── */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ─── Read CSS custom properties ─── */
  function getCSSVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  /* ─── Canvas container ─── */
  const canvas = document.createElement("canvas");
  canvas.id = "three-bg";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "-1",
    pointerEvents: "none",
  });
  document.body.prepend(canvas);

  /* ─── Renderer ─── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ─── Context-lost guard ─── */
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    cancelAnimationFrame(rafId);
  });
  canvas.addEventListener("webglcontextrestored", () => {
    rafId = requestAnimationFrame(animate);
  });

  /* ─── Scene + Camera ─── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;

  /* ─── Read theme colors ─── */
  let accent1 = getCSSVar("--particle-color") || getCSSVar("--accent") || "#6c63ff";
  let accent2 = getCSSVar("--mesh-color") || getCSSVar("--violet") || "#00d9a3";

  /* ─── (A) Floating Particle Field ─── */
  const particleCount = 800;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const particleMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(accent1),
    size: 0.04,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  /* ─── Phase 4: Per-particle anchor + velocity data ─── */
  const particleData = [];
  for (let i = 0; i < particleCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    particleData.push({
      anchorX: x, anchorY: y, anchorZ: z,
      vx: 0, vy: 0, vz: 0,
    });
  }

  /* ─── Phase 4: Mouse tracking (pointer-events on a transparent overlay) ─── */
  const mouse = { x: -9999, y: -9999 };

  // We need pointer events but the canvas has pointer-events:none.
  // Listen on the window instead and convert to canvas-relative coords.
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  /* ─── Phase 4: Project 3D → 2D screen coords ─── */
  const _vec3 = new THREE.Vector3();
  function projectToScreen(x, y, z) {
    _vec3.set(x, y, z);
    _vec3.project(camera);
    return {
      x: (_vec3.x * 0.5 + 0.5) * window.innerWidth,
      y: (-_vec3.y * 0.5 + 0.5) * window.innerHeight,
    };
  }

  /* ─── Phase 4: Repulsion constants ─── */
  const REPULSION_RADIUS = 120;
  const REPULSION_STRENGTH = 0.8;
  const SPRING_STIFFNESS = 0.08;
  const DAMPING = 0.75;

  /* ─── (B) Wireframe Icosahedron (hero) ─── */
  const icoGeometry = new THREE.IcosahedronGeometry(2, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(accent2),
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
  scene.add(icoMesh);

  /* ─── (C) Scroll-linked rotation ─── */
  let scrollT = 0;
  window.addEventListener(
    "scroll",
    () => {
      const docHeight = document.body.scrollHeight - window.innerHeight;
      scrollT = docHeight > 0 ? window.scrollY / docHeight : 0;
    },
    { passive: true }
  );

  /* ─── Ambient particle drift ─── */
  let clock = new THREE.Clock();

  /* ─── Resize handler ─── */
  function onResize() {
    requestAnimationFrame(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }
  window.addEventListener("resize", onResize, { passive: true });

  /* ─── Theme change listener — re-read CSS colors ─── */
  function updateColors() {
    accent1 = getCSSVar("--particle-color") || getCSSVar("--accent") || "#6c63ff";
    accent2 = getCSSVar("--mesh-color") || getCSSVar("--violet") || "#00d9a3";
    particleMaterial.color.set(accent1);
    icoMaterial.color.set(accent2);
  }
  // Expose for dark mode toggle
  window.updateGraphColors = updateColors;

  // Watch for theme changes via attribute mutation
  const themeObserver = new MutationObserver(() => {
    // Small delay so CSS vars settle
    setTimeout(updateColors, 50);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class"],
  });

  // Also listen for prefers-color-scheme change
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => setTimeout(updateColors, 50));

  /* ─── Render loop ─── */
  let rafId = 0;

  function animate() {
    rafId = requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Scroll-linked icosahedron rotation
    icoMesh.rotation.y = scrollT * Math.PI * 4;
    icoMesh.rotation.x = scrollT * Math.PI * 2;
    camera.position.z = 5 - scrollT * 2;

    // Gentle ambient particle drift (applied to group, not individual positions)
    particles.rotation.y = elapsed * 0.03;
    particles.rotation.x = elapsed * 0.015;

    // Subtle icosahedron idle float
    icoMesh.position.y = Math.sin(elapsed * 0.5) * 0.15;

    /* ─── Phase 4: Mouse proximity repulsion + spring-back ─── */
    const posAttr = particleGeometry.getAttribute("position");
    const posArr = posAttr.array;

    for (let i = 0; i < particleCount; i++) {
      const pd = particleData[i];
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Current world position
      const px = posArr[ix];
      const py = posArr[iy];
      const pz = posArr[iz];

      // Project to screen
      const screen = projectToScreen(px, py, pz);
      const dx = screen.x - mouse.x;
      const dy = screen.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repulsion force
      if (dist < REPULSION_RADIUS && dist > 0) {
        const force = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * REPULSION_STRENGTH;
        pd.vx += (dx / dist) * force * 0.02;
        pd.vy += (dy / dist) * force * -0.02; // Flip Y for 3D space
      }

      // Spring back to anchor
      pd.vx += (pd.anchorX - px) * SPRING_STIFFNESS;
      pd.vy += (pd.anchorY - py) * SPRING_STIFFNESS;
      pd.vz += (pd.anchorZ - pz) * SPRING_STIFFNESS;

      // Damping
      pd.vx *= DAMPING;
      pd.vy *= DAMPING;
      pd.vz *= DAMPING;

      // Apply velocity
      posArr[ix] += pd.vx;
      posArr[iy] += pd.vy;
      posArr[iz] += pd.vz;
    }

    posAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Pause when tab not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      clock.stop();
    } else {
      clock.start();
      rafId = requestAnimationFrame(animate);
    }
  });

  rafId = requestAnimationFrame(animate);

  /* ─── Cleanup helper (for SPA unmount if ever needed) ─── */
  window.__threeSceneDispose = function () {
    cancelAnimationFrame(rafId);
    themeObserver.disconnect();
    particleGeometry.dispose();
    particleMaterial.dispose();
    icoGeometry.dispose();
    icoMaterial.dispose();
    renderer.dispose();
    canvas.remove();
  };
})();
