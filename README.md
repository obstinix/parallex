# Parallex Webpage

![Parallex Webpage Hero](https://parallex-webpage.vercel.app/favicon.ico) *A dynamic, high-performance web experience focused on smooth scroll parallax, 3D particles, and precise atmospheric aesthetics.*

🌍 **Live Site:** [https://parallex-webpage.vercel.app](https://parallex-webpage.vercel.app)

## Features

- **Fluid Parallax Engine**: Vanilla JS smooth scrolling and custom parallax effects tied to native browser scroll streams (`requestAnimationFrame` + `transform3d`).
- **Interactive 3D Background**: Powered by [Three.js](https://threejs.org/). Renders an interactive wireframe icosahedron and a responsive 800-particle system that reacts with fluid spring physics to mouse proximity.
- **Dynamic Micro-Animations**: Smooth entry reveals and staggered card animations running on [Anime.js](https://animejs.com/). Includes rolling count-up digits and ambient hovering effects.
- **Multi-Theme System**: Change the entire visual mood instantly using a robust CSS Custom Property system natively without layout recalculations. Built-in themes include `depth`, `sunset`, `neon`, `ocean`, and `jungle`.
- **Zero-Bundler Simplicity**: 100% vanilla HTML, CSS, and JS. Designed without Webpack, Vite, or npm configurations for maximum performance and instant local development.
- **Accessibility & Performance First**: Includes proper structural HTML5 semantics, high-contrast dark modes, and complete respect for OS-level `prefers-reduced-motion` flags.

## Tech Stack

- **HTML5 & CSS3** (Vanilla, CSS custom properties, grid/flex layouts)
- **JavaScript** (ES6+, IntersectionObserver API, requestAnimationFrame)
- **Three.js** (via CDN for 3D elements)
- **Anime.js** (via CDN for staggered and timeline animations)

## Running Locally

Because there is no build step required, you can serve this project instantly using any local web server:

```bash
# Using Python
python -m http.server 8080

# Or using Node/npx
npx serve .
```

Then visit `http://localhost:8080` (or the port specified by your tool) in your browser.

## Deployment

The project is structured to deploy out-of-the-box to static hosting services like **Vercel**, **Netlify**, or **GitHub Pages**.

To deploy via Vercel CLI:
```bash
npx vercel --prod
```

## Authors
- Development & Design by [obstinix](https://github.com/obstinix)
