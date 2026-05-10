export const THEMES = ['void', 'nebula', 'solar', 'aurora'] as const
export type Theme = (typeof THEMES)[number]

export const THEME_LABELS: Record<Theme, string> = {
  void: 'Void',
  nebula: 'Nebula',
  solar: 'Solar',
  aurora: 'Aurora',
}

export const THEME_COLORS: Record<Theme, { bg: string; accent: string; accent2: string; text: string }> = {
  void: { bg: '#050505', accent: '#00FFF0', accent2: '#7C3AED', text: '#F8FAFC' },
  nebula: { bg: '#0D0118', accent: '#C77DFF', accent2: '#FF6BCD', text: '#EDE9FE' },
  solar: { bg: '#FFF8E7', accent: '#F59E0B', accent2: '#EF4444', text: '#1C1917' },
  aurora: { bg: '#030D0A', accent: '#34D399', accent2: '#06B6D4', text: '#ECFDF5' },
}

export const NAVIGATION = [
  { label: 'Experience', href: '#experience' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Features', href: '#features' },
  { label: 'Contact', href: '#contact' },
] as const

export const MARQUEE_ROWS = [
  { text: 'CINEMATIC · DEPTH · MOTION · SYSTEMS · SCROLL · PARALLAX · ', speed: 40, size: 80, opacity: 0.85, direction: 1 },
  { text: 'INTERACTIVE · IMMERSIVE · INTENTIONAL · EXPERIENCE · DESIGN · ', speed: 25, size: 120, opacity: 0.35, direction: -1 },
  { text: '映画的 · TIEFE · MOUVEMENT · 운동 · PROFUNDIDAD · ДВИЖЕНИЕ · ', speed: 55, size: 55, opacity: 0.18, direction: 1 },
] as const

export const TECH_STACK = [
  { name: 'Next.js 15', category: 'Framework' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'GSAP', category: 'Animation' },
  { name: 'Three.js', category: 'WebGL' },
  { name: 'Lenis', category: 'Scroll' },
  { name: 'Framer Motion', category: 'Motion' },
  { name: 'GLSL', category: 'Shaders' },
  { name: 'TailwindCSS', category: 'Styling' },
] as const

export const STATS = [
  { value: 60, label: 'Target FPS', suffix: 'fps' },
  { value: 10, label: 'Parallax Layers', suffix: 'k+', multiplier: true },
  { value: 4, label: 'Theme Presets', suffix: '' },
  { value: 100, label: 'Scroll-Driven', suffix: '%' },
] as const
