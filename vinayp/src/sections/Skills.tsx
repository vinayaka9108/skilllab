import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, Section, SectionHeading, DevNote } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { skillCategories, skills, type Skill } from '../config/site'

// Only verified skills are ever displayed.
const visible = skills.filter((s) => s.verified)
const numbered = visible.map((s, i) => ({ ...s, n: i + 1 }))
type NumberedSkill = Skill & { n: number }

interface Star {
  id: string
  cat: string
  x: number
  y: number
  w: number
  h: number
}
interface Strand {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
  /** true when the strand touches the selected element */
  hot: boolean
}

/**
 * A faint constellation drawn between the real DOM positions of the skill tiles.
 * Each category forms its own cluster (a ring), and the clusters are linked —
 * so the grid reads as a map of related skills rather than a list of chips.
 */
function Constellation({
  hostRef,
  activeId,
  className,
}: {
  hostRef: RefObject<HTMLDivElement | null>
  activeId: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const [stars, setStars] = useState<Star[]>([])

  const measure = useCallback(() => {
    const host = hostRef.current
    if (!host) return
    const rect = host.getBoundingClientRect()
    if (rect.width === 0) return
    const tiles = Array.from(host.querySelectorAll<HTMLElement>('[data-skill-tile]'))
    const next: Star[] = tiles.map((t) => {
      const r = t.getBoundingClientRect()
      return {
        id: t.dataset.skillTile ?? '',
        cat: t.dataset.skillCat ?? '',
        x: r.left - rect.left + r.width / 2,
        y: r.top - rect.top + r.height / 2,
        w: r.width,
        h: r.height,
      }
    })
    setStars(next)
  }, [hostRef])

  useEffect(() => {
    measure()
    const host = hostRef.current
    if (!host) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(host)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [hostRef, measure])

  // Re-measure once the reveal animation has settled.
  useEffect(() => {
    const t = window.setTimeout(measure, 700)
    return () => window.clearTimeout(t)
  }, [measure])

  const strands = useMemo(() => {
    const byCat = new Map<string, Star[]>()
    for (const s of stars) {
      const list = byCat.get(s.cat) ?? []
      list.push(s)
      byCat.set(s.cat, list)
    }
    const out: Strand[] = []
    let prevClusterAnchor: Star | undefined
    for (const [, group] of byCat) {
      // Ring inside each cluster.
      for (let i = 0; i < group.length; i++) {
        const a = group[i]
        const b = group[(i + 1) % group.length]
        if (group.length < 2) break
        out.push({
          key: `${a.id}-${b.id}`,
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          hot: a.id === activeId || b.id === activeId,
        })
      }
      // Bridge clusters together.
      const anchor = group[0]
      if (prevClusterAnchor) {
        out.push({
          key: `bridge-${prevClusterAnchor.id}-${anchor.id}`,
          x1: prevClusterAnchor.x,
          y1: prevClusterAnchor.y,
          x2: anchor.x,
          y2: anchor.y,
          hot: false,
        })
      }
      prevClusterAnchor = anchor
    }
    return out
  }, [stars, activeId])

  const active = stars.find((s) => s.id === activeId)

  return (
    <svg
      data-constellation
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
    >
      {strands.map((s) => (
        <line
          key={s.key}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={s.hot ? '#6a8bff' : '#ffffff'}
          strokeOpacity={s.hot ? 0.55 : 0.09}
          strokeWidth={s.hot ? 1.1 : 0.7}
          strokeDasharray={s.hot ? undefined : '2 5'}
          style={{ transition: 'stroke-opacity .35s ease, stroke .35s ease' }}
        />
      ))}
      {stars.map((s) => (
        <circle
          key={`dot-${s.id}`}
          cx={s.x}
          cy={s.y}
          r={s.id === activeId ? 2.4 : 1.4}
          fill={s.id === activeId ? '#6a8bff' : '#ffffff'}
          fillOpacity={s.id === activeId ? 0.9 : 0.18}
        />
      ))}
      {active && (
        <rect
          x={active.x - active.w / 2 - 6}
          y={active.y - active.h / 2 - 6}
          width={active.w + 12}
          height={active.h + 12}
          rx={16}
          fill="none"
          stroke="#6a8bff"
          strokeOpacity={reduce ? 0.25 : 0.45}
          strokeWidth={1}
          strokeDasharray="4 6"
          style={{ transition: 'all .3s cubic-bezier(.2,.7,.2,1)' }}
        />
      )}
    </svg>
  )
}
const LEVEL_STYLE: Record<NonNullable<Skill['level']>, { badge: string; panel: string; label: string }> = {
  Fundamentals: {
    badge: 'border-iris/45 bg-iris/15 text-iris',
    panel: 'border-iris/40 bg-iris/10 text-iris',
    label: 'Beginner level — fundamentals only',
  },
  Working: {
    badge: 'border-emerald-300/35 bg-emerald-300/10 text-emerald-200/90',
    panel: 'border-emerald-300/35 bg-emerald-300/10 text-emerald-200',
    label: 'Working knowledge — backed by lab & project work',
  },
}

function Tile({
  skill,
  selected,
  onSelect,
}: {
  skill: NumberedSkill
  selected: boolean
  onSelect: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()

  const move = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (reduce || !el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(520px) rotateX(${(-py * 16).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg)`
  }
  const leave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <button
      ref={ref}
      type="button"
      data-skill-tile={skill.id}
      data-skill-cat={skill.category}
      aria-pressed={selected}
      onClick={onSelect}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`group relative flex aspect-[1/1.05] flex-col justify-between rounded-xl border p-3 text-left transition-[transform,background-color,border-color] duration-200 ease-out ${
        selected
          ? 'border-volt/70 bg-volt/12'
          : 'border-white/10 bg-white/[0.03] hover:border-white/25'
      }`}
    >
      <span className="font-mono text-[0.6rem] text-dim">{String(skill.n).padStart(2, '0')}</span>
      <span>
        <span className="block font-serif text-3xl italic leading-none sm:text-4xl">
          {skill.symbol}
        </span>
        <span className="mt-2 block text-[0.72rem] leading-tight text-mute group-hover:text-bone">
          {skill.name}
        </span>
      </span>
      {skill.level && (
        <span
          className={`absolute right-2.5 top-2.5 rounded-full border px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider ${LEVEL_STYLE[skill.level].badge}`}
        >
          {skill.level === 'Fundamentals' ? 'Beginner' : 'Working'}
        </span>
      )}
    </button>
  )
}

export function Skills() {
  const [activeId, setActiveId] = useState(numbered[0].id)
  const gridRef = useRef<HTMLDivElement>(null)
  const active = numbered.find((s) => s.id === activeId) ?? numbered[0]
  const category = skillCategories.find((c) => c.id === active.category)

  return (
    <Section id="skills" labelledBy="skills-title">
      <SectionHeading
        index="02"
        eyebrow="Technical skills"
        id="skills-title"
        lead="A periodic table of what I work with. Hover or tap an element to see what it is and where it shows up. Areas I have only fundamentals in are marked as beginner; areas backed by lab or project work are marked as working knowledge."
      >
        The <span className="serif-accent">elements</span> I build with.
      </SectionHeading>

      <div className="grid gap-10 lg:grid-cols-12">
        <div ref={gridRef} className="relative lg:col-span-8">
          {/* Constellation overlay — sits behind the tiles, links related elements. */}
          <Constellation hostRef={gridRef} activeId={active.id} className="z-0" />
          <div className="relative z-10 space-y-10">
            {skillCategories.map((cat, ci) => {
              const items = numbered.filter((s) => s.category === cat.id)
              if (!items.length) return null
              return (
                <Reveal key={cat.id} delay={ci * 0.05}>
                  <div>
                    <h3 className="mb-4 flex items-baseline gap-3">
                      <span className="text-lg font-light">{cat.label}</span>
                      <span className="eyebrow">{cat.blurb}</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
                      {items.map((s) => (
                        <Tile
                          key={s.id}
                          skill={s}
                          selected={s.id === active.id}
                          onSelect={() => setActiveId(s.id)}
                        />
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        <aside className="lg:col-span-4" aria-live="polite" aria-label="Selected skill details">
          <div className="glass sticky top-24 min-h-[19rem] rounded-2xl p-6 sm:p-7 ticks">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex items-start justify-between">
                  <span className="font-serif text-7xl italic leading-none">{active.symbol}</span>
                  <span className="font-mono text-xs text-dim">
                    {String(active.n).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-light">{active.name}</h3>
                <p className="eyebrow mt-1">{category?.label}</p>
                {active.level && (
                  <p
                    className={`mt-4 inline-block rounded-full border px-3 py-1 text-xs ${LEVEL_STYLE[active.level].panel}`}
                  >
                    {LEVEL_STYLE[active.level].label}
                  </p>
                )}
                <p className="mt-5 text-[0.95rem] leading-relaxed text-mute">{active.about}</p>
                {active.usage ? (
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <p className="eyebrow mb-2">Where it shows up</p>
                    <p className="text-[0.95rem] leading-relaxed">{active.usage}</p>
                  </div>
                ) : (
                  <DevNote>
                    Add a real “usage” example for {active.name} in src/config/site.ts.
                  </DevNote>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </Section>
  )
}
