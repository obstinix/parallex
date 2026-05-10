'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;

// Hash function
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// 2D noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 6; i++) {
    v += amp * noise(p);
    p = p * 2.1 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  uv.y += uScroll * 0.0001;

  // Mouse influence
  vec2 mouseInfluence = (uMouse - 0.5) * 0.3;
  uv += mouseInfluence * 0.08;

  float n = fbm(uv * 3.0 + uTime * 0.06);
  float n2 = fbm(uv * 5.0 - uTime * 0.04 + n);

  vec3 col = mix(uColor1, uColor2, n);
  col = mix(col, uColor3, n2 * n2 * 0.12);

  // Subtle vignette
  float vignette = 1.0 - length((vUv - 0.5) * 1.4);
  vignette = smoothstep(0.0, 0.8, vignette);
  col *= vignette * 0.95 + 0.05;

  gl_FragColor = vec4(col, 1.0);
}
`

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()
  const mouseSmooth = useRef(new THREE.Vector2(0.5, 0.5))
  const scrollRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor1: { value: new THREE.Color('#050505') },
      uColor2: { value: new THREE.Color('#0F172A') },
      uColor3: { value: new THREE.Color('#00FFF0') },
    }),
    []
  )

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Update colors based on theme
    const observer = new MutationObserver(() => {
      const style = getComputedStyle(document.documentElement)
      const bg = style.getPropertyValue('--bg').trim()
      const surface = style.getPropertyValue('--surface').trim()
      const accent = style.getPropertyValue('--accent').trim()
      if (bg) uniforms.uColor1.value.set(bg)
      if (surface) uniforms.uColor2.value.set(surface)
      if (accent) uniforms.uColor3.value.set(accent)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // Initial color set
    const style = getComputedStyle(document.documentElement)
    const bg = style.getPropertyValue('--bg').trim()
    const surface = style.getPropertyValue('--surface').trim()
    const accent = style.getPropertyValue('--accent').trim()
    if (bg) uniforms.uColor1.value.set(bg)
    if (surface) uniforms.uColor2.value.set(surface)
    if (accent) uniforms.uColor3.value.set(accent)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [uniforms])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
    mouseSmooth.current.lerp(
      new THREE.Vector2((mouse.x + 1) / 2, (mouse.y + 1) / 2),
      0.03
    )
    uniforms.uMouse.value.copy(mouseSmooth.current)
    uniforms.uScroll.value = scrollRef.current
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
      />
    </mesh>
  )
}

function ShaderCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <ShaderPlane />
    </Canvas>
  )
}

export function BackgroundShader() {
  const [mounted, setMounted] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!gl) {
        setSupported(false)
        return
      }
    } catch {
      setSupported(false)
      return
    }

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setSupported(false)
      return
    }

    setMounted(true)
  }, [])

  if (!supported) {
    // CSS fallback
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 80% 60% at 30% 40%, rgba(var(--accent-rgb), 0.06), transparent),
            radial-gradient(ellipse 60% 50% at 70% 60%, rgba(var(--accent-2-rgb), 0.04), transparent),
            var(--bg)
          `,
        }}
      />
    )
  }

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <ShaderCanvas />
    </div>
  )
}
