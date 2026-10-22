import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '../lib/hooks'
import { Monogram } from './Monogram'

/**
 * Brief page-load introduction. Non-blocking, self-removing, and skipped entirely
 * for visitors who prefer reduced motion.
 */
export function Intro() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduce) {
      setDone(true)
      return
    }
    const t = window.setTimeout(() => setDone(true), 1150)
    return () => window.clearTimeout(t)
  }, [reduce])

  if (reduce) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[80] grid place-items-center bg-ink-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } }}
          aria-hidden="true"
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-lg border border-white/12 bg-white/[0.03] text-bone">
              <Monogram className="h-6 w-6" />
            </span>
            <span className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-dim">
              Vinayaka Neelammanavara
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
