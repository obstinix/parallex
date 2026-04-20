# Parallax Scroll — 3D Atmosphere Engine

> A dynamic, high-performance web experience built for smooth scroll parallax, interactive 3D particles, and precise atmospheric aesthetics. Zero dependencies, zero bundler, instant deploy.

![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![Anime.js](https://img.shields.io/badge/Anime.js-FF4081?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![No Build Step](https://img.shields.io/badge/Build_Step-None-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

🌐 **Live site:** [parallex-webpage.vercel.app](https://parallex-webpage.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo & Screenshots](#demo--screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally](#running-locally)
- [Themes](#themes)
- [How It Works](#how-it-works)
- [Performance & Accessibility](#performance--accessibility)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

---

## Overview

**Parallax Scroll** is a zero-dependency, no-build-step web project that demonstrates what's possible with pure HTML, CSS, and JavaScript. It combines a custom parallax scroll engine, a reactive Three.js particle field, and a timeline-driven animation system to create a visually immersive single-page experience.

The project is intentionally bundler-free — every feature runs directly in the browser without a compilation step, making it ideal for rapid iteration, learning, or deploying to any static host in seconds.

---

## Features

### Fluid Parallax Engine
Custom vanilla JS scrolling system using `requestAnimationFrame` and `transform3d`. Scroll events are captured from native browser streams and mapped to per-layer depth offsets, producing smooth, hardware-accelerated parallax motion with no layout thrashing.

### Interactive 3D Background
Powered by **Three.js**. A wireframe icosahedron rotates continuously in the scene background, surrounded by an 800-particle system. Particles respond to mouse proximity with fluid spring physics — approaching the cursor and snapping back elastically as it moves away.

### Dynamic Micro-Animations
Built with **Anime.js**. Includes:
- Staggered content card entry reveals tied to `IntersectionObserver`
- Rolling count-up number animations for statistics and metrics
- Ambient floating/hover effects on key UI elements
- Smooth timeline-based sequencing for page load choreography

### Multi-Theme System
Five built-in visual themes switchable at runtime with zero layout recalculation:

| Theme | Description |
|---|---|
| `depth` | Deep navy blues and cool dark tones (default) |
| `sunset` | Warm amber, coral, and dusk purples |
| `neon` | High-contrast electric greens and magentas |
| `ocean` | Teal, aquamarine, and deep sea blues |
| `jungle` | Rich greens, earthy browns, and organic hues |

Themes are implemented entirely with **CSS custom properties**, so switching is a single class change on the root element.

### Zero-Bundler Architecture
No Webpack, Vite, Rollup, or npm build configuration. Three.js and Anime.js are loaded via CDN. The entire project runs with a single static file server — ideal for learning, prototyping, and instant deployment.

### Accessibility & Performance First
- Semantic HTML5 landmarks and heading structure
- Full `prefers-reduced-motion` media query support — all animations are disabled automatically for users who opt out at the OS level
- High-contrast dark mode compatible with system preferences
- Minimal main-thread work — heavy animation logic runs inside `requestAnimationFrame` callbacks

---

## Demo & Screenshots

Live: [https://parallex-webpage.vercel.app](https://parallex-webpage.vercel.app)

> Screenshots can be added here. Recommended sizes: 1280×800 for desktop, 390×844 for mobile.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Structure | HTML5 | Semantic landmarks, accessible heading hierarchy |
| Styles | CSS3 | Custom properties, Grid, Flexbox, media queries |
| Logic | JavaScript ES6+ | No transpilation, runs natively in modern browsers |
| Scroll & animation loop | `requestAnimationFrame` | Hardware-accelerated, jank-free |
| Viewport detection | `IntersectionObserver` API | Triggers reveals without scroll listeners |
| 3D rendering | [Three.js](https://threejs.org/) (CDN) | WebGL particle system and geometry |
| Timeline animations | [Anime.js](https://animejs.com/) (CDN) | Staggered and sequenced UI animations |

---

## Project Structure

```
parallax-webpage/
├── index.html          # Entry point — markup and CDN script tags
├── style.css           # Global styles, theme variables, layout
├── main.js             # Core scroll engine and animation orchestration
├── particles.js        # Three.js scene setup, particle system, mouse physics
├── themes.js           # Theme switching logic and CSS variable maps
└── assets/
    └── ...             # Images, fonts, and any static media
```

> Note: If your project uses a different file structure, update the paths above to match.

---

## Getting Started

### Prerequisites

You only need a modern web browser and one of the following to serve static files locally:

- **Python 3** (usually pre-installed on macOS/Linux)
- **Node.js** with `npx` (for the `serve` package)
- Any other local static file server (VS Code Live Server, Caddy, etc.)

No `npm install`, no build step, no configuration needed.

### Running Locally

**1. Clone the repository:**

```bash
git clone https://github.com/your-username/parallax-webpage.git
cd parallax-webpage
```

**2. Start a local server:**

Using Python:
```bash
python -m http.server 8080
```

Using Node / npx:
```bash
npx serve .
```

Using VS Code:
> Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html`, and select **Open with Live Server**.

**3. Open in your browser:**

```
http://localhost:8080
```

> **Why a server?** Loading `index.html` directly via `file://` will block ES module imports and Three.js texture loading due to browser CORS restrictions. Always use a local server.

---

## Themes

To switch themes at runtime, set the `data-theme` attribute on the `<html>` element:

```javascript
document.documentElement.setAttribute('data-theme', 'neon');
```

Available values: `depth` · `sunset` · `neon` · `ocean` · `jungle`

To add a custom theme, define a new block of CSS custom properties in `style.css`:

```css
[data-theme="custom"] {
  --color-bg-primary: #0a0a0a;
  --color-accent: #ff6b35;
  --particle-color: #ff6b35;
  /* ... add all required variables */
}
```

---

## How It Works

### Parallax scroll
Each layer in the DOM is assigned a `data-parallax-speed` attribute. On each `scroll` event, a `requestAnimationFrame` callback reads the current scroll position and applies a proportional `translateY` via `transform3d` to each layer. Using `transform3d` instead of `top`/`margin` keeps all repaints on the GPU compositor thread, avoiding layout recalculations.

### Particle physics
The Three.js particle system stores the position, velocity, and a rest position for each of the 800 particles. On each animation frame, the distance from the mouse cursor is computed for every particle. Within a threshold radius, a repulsion force is applied proportional to proximity. A spring force continuously pulls each particle back toward its rest position. The result is an elastic, fluid crowd behaviour without a physics library.

### Intersection-based reveals
`IntersectionObserver` watches every animated card and section. When an element enters the viewport, an Anime.js timeline is triggered — staggering child elements with an opacity + translateY entrance. This avoids expensive scroll listener polling and naturally batches DOM reads.

---

## Performance & Accessibility

| Concern | Implementation |
|---|---|
| Reduced motion | All CSS transitions and JS animations check `window.matchMedia('(prefers-reduced-motion: reduce)')` and skip if true |
| GPU compositing | All moving elements use `transform` and `opacity` only — no `top`, `left`, or `width` changes that trigger layout |
| No layout thrashing | Scroll values are read once per `rAF` tick; DOM writes are batched after all reads |
| Semantic structure | `<header>`, `<main>`, `<section>`, `<footer>`, and proper heading order (`h1` → `h2` → `h3`) |
| Keyboard navigation | All interactive elements are focusable and operable via keyboard |

---

## Deployment

The project is structured to deploy immediately to any static hosting platform.

### Vercel (recommended)

```bash
npx vercel --prod
```

### Netlify

Drag and drop the project folder into [app.netlify.com/drop](https://app.netlify.com/drop), or use the CLI:

```bash
npx netlify-cli deploy --prod --dir .
```

### GitHub Pages

Push to a `gh-pages` branch or configure GitHub Pages to serve from the `main` branch root in your repository settings.

---

## Contributing

Contributions are welcome. To propose a change:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "add: description of change"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request against `main`

Please keep PRs focused — one feature or fix per request. For large changes, open an issue first to discuss the approach.

---

## Authors

Built and designed by:

- **obstinix** — [GitHub](https://github.com/obstinix)
- **maithileekedare97-del** — [GitHub](https://github.com/maithileekedare97-del)

---

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute it with attribution.

---

<p align="center">Made with vanilla JS · No frameworks were harmed in the making of this project</p>
