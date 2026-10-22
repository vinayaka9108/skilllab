/** Smoothly scroll to a section (respects reduced motion) and keep the URL hash in sync. */
export function goTo(id: string, opts?: { projectId?: string }) {
  if (opts?.projectId) {
    window.dispatchEvent(new CustomEvent('select-project', { detail: opts.projectId }))
  }
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  try {
    history.replaceState(null, '', `#${id}`)
  } catch {
    /* sandboxed iframes may block this; scrolling still worked */
  }
}

/** Lets 3D objects tell the custom cursor they are hovering something clickable. */
export function emitCursorHover(hovering: boolean) {
  window.dispatchEvent(new CustomEvent('cursor:hover', { detail: hovering }))
}

export const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1]
