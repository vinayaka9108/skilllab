import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Building2, GraduationCap, MapPin, Sparkles, Layers } from 'lucide-react'
import { Reveal, Section, SectionHeading } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { profile } from '../config/site'

const INFO = [
  { icon: GraduationCap, label: 'Education', value: 'B.E. in Computer Science and Engineering' },
  { icon: Building2, label: 'Institution', value: 'RV College of Engineering, Bengaluru' },
  { icon: Layers, label: 'Current stage', value: profile.stage },
  { icon: MapPin, label: 'Location', value: profile.region },
]

const INTERESTS = ['Software Engineering', 'Cybersecurity', 'Blockchain', 'Web Development']

const PLATES = [
  { label: 'SSLC', sub: 'Foundation' },
  { label: 'PUC Science', sub: 'Pre-university' },
  { label: 'Diploma CSE', sub: 'Computer science, hands-on' },
  { label: 'B.E. CSE · RVCE', sub: 'Semester 3 · now', current: true },
]

/** CSS-3D stack of "plates", one per stage of the learning journey. Pointer tilts it. */
function LearningStack() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-32, 32]), { stiffness: 80, damping: 16 })
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [64, 48]), { stiffness: 80, damping: 16 })

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
    setHovered(false)
  }

  const gap = hovered ? 56 : 30

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={onLeave}
      className="relative grid h-[22rem] place-items-center overflow-hidden"
      style={{ perspective: 1100 }}
      role="img"
      aria-label="Layered 3D stack illustrating my learning journey: SSLC, PUC Science, Diploma in Computer Science and Engineering, and B.E. at RV College of Engineering."
      data-cursor
    >
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          rotateX: reduce ? 56 : rotX,
          rotateY: reduce ? -14 : rotY,
          width: 'min(20rem, 70vw)',
          height: '10rem',
          position: 'relative',
        }}
      >
        {PLATES.map((p, i) => (
          <motion.div
            key={p.label}
            animate={{ z: i * gap - 40 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className={`absolute inset-0 flex flex-col justify-end rounded-2xl p-4 ${
              p.current ? 'border border-volt/70 bg-volt/15' : 'glass'
            }`}
            style={{ backfaceVisibility: 'hidden' }}
            aria-hidden="true"
          >
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-mute">
              0{i + 1}
            </span>
            <span className="text-lg font-light">{p.label}</span>
            <span className="text-xs text-mute">{p.sub}</span>
          </motion.div>
        ))}
      </motion.div>
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-dim">
        Move your pointer to tilt the stack
      </p>
    </div>
  )
}

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeading index="01" eyebrow="About" id="about-title">
        Curious by Nature. <span className="serif-accent">Building by Practice.</span>
      </SectionHeading>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-xl font-light leading-relaxed text-bone/90 sm:text-2xl">
              I’m Vinay, a Computer Science and Engineering student at RV College of Engineering,
              currently in my third semester. My interests include software development,
              cybersecurity, blockchain technology, and interactive web experiences. I enjoy
              learning how systems work and turning technical concepts into practical projects.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 bg-ink-900 p-5">
                  <Icon size={18} className="mt-1 shrink-0 text-volt" aria-hidden="true" />
                  <div>
                    <dt className="eyebrow mb-1">{label}</dt>
                    <dd className="text-[0.95rem] leading-snug">{value}</dd>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 bg-ink-900 p-5 sm:col-span-2">
                <Sparkles size={18} className="mt-1 shrink-0 text-volt" aria-hidden="true" />
                <div>
                  <dt className="eyebrow mb-2">Interests</dt>
                  <dd className="flex flex-wrap gap-2">
                    {INTERESTS.map((i) => (
                      <span
                        key={i}
                        className="chip"
                      >
                        {i}
                      </span>
                    ))}
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-5">
          <figure className="relative mx-auto max-w-sm">
            <div className="glass overflow-hidden rounded-[1.75rem] p-2">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/images/vinay-480.webp 480w, /images/vinay-800.webp 800w"
                  sizes="(min-width: 1024px) 24rem, 80vw"
                />
                <img
                  src="/images/vinay-800.jpg"
                  srcSet="/images/vinay-480.jpg 480w, /images/vinay-800.jpg 800w"
                  sizes="(min-width: 1024px) 24rem, 80vw"
                  width={800}
                  height={1013}
                  loading="lazy"
                  decoding="async"
                  alt="Portrait of Vinay, wearing a light blue shirt against a plain grey background"
                  className="aspect-[4/5] w-full rounded-[1.4rem] object-cover object-top"
                />
              </picture>
            </div>
            <figcaption className="absolute -bottom-3 left-4 right-4 flex items-center justify-between rounded-md border border-white/10 bg-ink-900/95 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mute backdrop-blur">
              <span>Vinay</span>
              <span className="text-volt">RVCE · CSE</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-20">
        <div className="glass rounded-2xl px-4 pb-2 pt-6 sm:px-8 ticks">
          <p className="eyebrow px-2">Learning journey</p>
          <LearningStack />
        </div>
      </Reveal>
    </Section>
  )
}
