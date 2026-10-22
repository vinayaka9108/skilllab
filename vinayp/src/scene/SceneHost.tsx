import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from 'react'
import type { SceneProps } from './types'
import { detectWebGL, useInView, useIsMobile, useReducedMotion } from '../lib/hooks'

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Wraps a lazily-loaded R3F scene with everything that makes WebGL optional:
 *  - the heavy three.js chunk only loads once the block is near the viewport
 *  - offscreen scenes stop rendering
 *  - no WebGL / runtime error → a static fallback is shown instead
 *  - `disableOnMobile` swaps the scene for the fallback on phones
 */
export function SceneHost({
  scene: Scene,
  fallback,
  label,
  className = '',
  disableOnMobile = false,
}: {
  scene: LazyExoticComponent<ComponentType<SceneProps>>
  fallback: ReactNode
  label: string
  className?: string
  disableOnMobile?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const mobile = useIsMobile()
  const reduceMotion = useReducedMotion()
  const supported = useMemo(() => detectWebGL(), [])
  const [failed, setFailed] = useState(false)
  const [everSeen, setEverSeen] = useState(false)

  useEffect(() => {
    if (inView) setEverSeen(true)
  }, [inView])

  const use3D = supported && !failed && !(disableOnMobile && mobile)

  return (
    <div ref={ref} className={className} role="group" aria-label={label}>
      {use3D ? (
        <SceneBoundary fallback={fallback} onError={() => setFailed(true)}>
          {everSeen ? (
            <Suspense fallback={fallback}>
              <Scene active={inView} mobile={mobile} reduceMotion={reduceMotion} />
            </Suspense>
          ) : (
            fallback
          )}
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
