import { useEffect, useRef } from 'react'
import { useFinePointer, useReducedMotion } from '../lib/hooks'

const INTERACTIVE = 'a,button,[role="button"],summary,label,[data-cursor]'
const TEXT_FIELDS = 'input,textarea,select'

/** Dot + trailing ring. Only mounted for mouse/trackpad users; touch devices never see it. */
export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fine) return
    document.documentElement.classList.add('custom-cursor')

    let x = 0
    let y = 0
    let rx = 0
    let ry = 0
    let raf = 0
    let sceneHover = false
    let domHover = false

    const setHover = () => {
      if (ring.current) ring.current.dataset.hover = String(sceneHover || domHover)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      x = e.clientX
      y = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
        dot.current.dataset.visible = 'true'
      }
      if (ring.current) ring.current.dataset.visible = 'true'
      const t = e.target as Element | null
      domHover = !!t?.closest?.(INTERACTIVE)
      const inField = !!t?.closest?.(TEXT_FIELDS)
      if (dot.current) dot.current.dataset.hidden = String(inField)
      if (ring.current) ring.current.dataset.hidden = String(inField)
      setHover()
    }

    const onLeave = () => {
      if (dot.current) dot.current.dataset.visible = 'false'
      if (ring.current) ring.current.dataset.visible = 'false'
    }

    const onSceneHover = (e: Event) => {
      sceneHover = !!(e as CustomEvent<boolean>).detail
      setHover()
    }

    const tick = () => {
      const k = reduce ? 1 : 0.18
      rx += (x - rx) * k
      ry += (y - ry) * k
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('cursor:hover', onSceneHover)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('cursor:hover', onSceneHover)
    }
  }, [fine, reduce])

  if (!fine) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
