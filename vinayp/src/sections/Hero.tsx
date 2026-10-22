import { lazy, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SceneHost } from '../scene/SceneHost'
import { HeroFallback } from '../scene/Fallbacks'
import { goTo } from '../lib/dom'
import { useReducedMotion } from '../lib/hooks'

const HeroScene = lazy(() => import('../scene/HeroScene'))

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(5px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.2, 0.7, 0.2, 1] },
  },
}

const META = [
  { k: 'Institution', v: 'RV College of Engineering' },
  { k: 'Location', v: 'Bengaluru, India' },
  { k: 'Stage', v: 'Semester 03' },
]

export function Hero() {
  const reduce = useReducedMotion()
  const jump = (id: string) => (e: ReactMouseEvent) => {
    e.preventDefault()
    goTo(id)
  }

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Laboratory backdrop: faint blueprint grid + a single cool light source. */}
      <div aria-hidden="true" className="blueprint blueprint-fade pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_52%_at_74%_42%,rgba(106,139,255,0.13),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-900 to-transparent"
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] grid-rows-[auto_1fr] px-5 sm:px-8 lg:grid-cols-12 lg:grid-rows-1 lg:px-12">
        {/* Copy */}
        <motion.div
          className="relative z-10 order-2 flex flex-col justify-center pb-24 pt-6 lg:order-1 lg:col-span-6 lg:py-32"
          variants={container}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <motion.p variants={item} className="eyebrow mb-7 flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="beacon absolute inset-0 rounded-full bg-volt" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-volt" />
            </span>
            Computer Science Engineering Student
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={item}
            className="text-[clamp(2.6rem,6.1vw,5rem)] font-light leading-[1.02] tracking-[-0.028em]"
          >
            Hi, I’m <span className="serif-hero">Vinay.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-balance text-[clamp(1.2rem,1.9vw,1.6rem)] font-light leading-snug text-bone/85"
          >
            Building ideas into interactive digital experiences.
          </motion.p>

          <motion.div variants={item} className="mt-5 h-px w-16 bg-gradient-to-r from-volt/70 to-transparent" />

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-[0.97rem] leading-relaxed text-mute sm:text-base"
          >
            I explore software development, cybersecurity, web technologies, and creative
            problem-solving.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#projects" onClick={jump('projects')} className="btn btn-primary">
              Explore My Work <ArrowRight size={15} aria-hidden="true" />
            </a>
            <a href="#contact" onClick={jump('contact')} className="btn btn-ghost">
              Get In Touch <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </motion.div>

          {/* Technical meta strip */}
          <motion.dl
            variants={item}
            className="mt-12 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/8 sm:grid-cols-3"
          >
            {META.map(({ k, v }) => (
              <div key={k} className="bg-ink-900/90 px-4 py-3">
                <dt className="eyebrow text-[0.6rem]">{k}</dt>
                <dd className="mt-1 text-[0.82rem] leading-tight text-bone/90">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* 3D scene */}
        <div className="relative order-1 -mx-5 h-[42svh] pt-16 sm:-mx-8 lg:order-2 lg:col-span-6 lg:mx-0 lg:h-[100svh] lg:pt-0">
          <SceneHost
            scene={HeroScene}
            fallback={<HeroFallback />}
            label="Decorative interactive 3D scene"
            className="absolute inset-0 lg:-right-16"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        onClick={jump('about')}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-dim transition-colors hover:text-bone sm:flex"
        aria-label="Scroll to About section"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em]">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15" aria-hidden="true">
          <span className="scroll-line absolute inset-0 bg-bone/80" />
        </span>
      </a>
    </section>
  )
}
