import type { ReactNode } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useReducedMotion } from '../lib/hooks'
import { EASE } from '../lib/dom'

/** Fade/slide a block in once when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  index,
  eyebrow,
  id,
  children,
  lead,
}: {
  index: string
  eyebrow: string
  id: string
  children: ReactNode
  lead?: ReactNode
}) {
  return (
    <div className="mb-10 max-w-3xl md:mb-14">
      <Reveal>
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="text-volt tabular-nums">{index}</span>
          <span className="h-px w-10 bg-white/15" aria-hidden="true" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.07}>
        <h2
          id={id}
          className="text-balance text-[clamp(1.85rem,3.3vw,2.8rem)] font-light leading-[1.14] tracking-[-0.021em]"
        >
          {children}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.14}>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-mute">{lead}</p>
        </Reveal>
      )}
    </div>
  )
}

export function Section({
  id,
  labelledBy,
  className = '',
  children,
}: {
  id: string
  labelledBy?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-8 md:py-28 lg:px-12 ${className}`}
    >
      {children}
    </section>
  )
}

/** A hairline rule that reads like a drawn divider, not a border. */
export function Rule({ className = '' }: { className?: string }) {
  return (
    <div className={`h-px w-full bg-gradient-to-r from-white/14 via-white/5 to-transparent ${className}`} aria-hidden="true" />
  )
}

/** Visible only while developing, to flag content you still need to supply. Never shipped. */
export function DevNote({ children }: { children: ReactNode }) {
  if (!import.meta.env.DEV) return null
  return (
    <p className="mt-2 rounded border border-dashed border-amber-400/40 bg-amber-400/5 px-3 py-2 font-mono text-[0.7rem] text-amber-300/80">
      DEV NOTE · {children}
    </p>
  )
}

/** Thin progress line pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-volt via-iris to-transparent"
    />
  )
}

export function GithubIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export function LinkedinIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}
