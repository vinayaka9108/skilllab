import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

/** Subscribe to a CSS media query. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
/** Phones and small touch tablets get a lighter 3D scene (or a non-WebGL fallback). */
export const useIsMobile = () =>
  useMediaQuery('(max-width: 767px), ((pointer: coarse) and (max-width: 1024px))')

let webglCache: boolean | undefined
/** True when the browser can create a WebGL context. Result is cached. */
export function detectWebGL(): boolean {
  if (webglCache !== undefined) return webglCache
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null
    webglCache = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglCache = false
  }
  return webglCache
}

/** Whether an element is (nearly) on screen. Used to pause offscreen 3D rendering. */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = '150px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}

/** Tracks which section is crossing the middle of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join('|')
  useEffect(() => {
    const els = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  return active
}
