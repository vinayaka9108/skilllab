import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { DevNote, GithubIcon, Reveal, Section, SectionHeading } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { projects, type Project, type ProjectId } from '../config/site'
import { ArchitectureViz } from '../projects/ArchitectureViz'
import { GapBridgeVisual } from '../projects/GapBridgeVisual'
import { DcetVisual } from '../projects/DcetVisual'

const STATUS_STYLE: Record<NonNullable<Project['status']>['kind'], string> = {
  academic: 'border-volt/40 bg-volt/10 text-volt',
  concept: 'border-iris/40 bg-iris/10 text-iris',
  prototype: 'border-amber-300/40 bg-amber-300/10 text-amber-200',
  deployed: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200',
  tool: 'border-bone/30 bg-bone/10 text-bone/90',
}

function Visual({ id }: { id: ProjectId }) {
  if (id === 'vaultix') return <ArchitectureViz />
  if (id === 'gapbridge') return <GapBridgeVisual />
  return <DcetVisual />
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="eyebrow mb-2">{label}</h4>
      {children}
    </div>
  )
}

function Info({ p }: { p: Project }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="eyebrow">{p.category}</span>
          {p.status && (
            <span
              className={`rounded border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider ${STATUS_STYLE[p.status.kind]}`}
            >
              {p.status.label}
            </span>
          )}
        </div>
        <h3 className="text-3xl font-light tracking-tight sm:text-4xl">
          <span className="serif-accent">{p.name}</span>
        </h3>
        <p className="mt-1 text-lg text-bone/90">{p.title}</p>
        <p className="mt-4 leading-relaxed text-mute">{p.description}</p>
      </div>

      <Block label="Problem">
        <p className="text-[0.95rem] leading-relaxed">{p.problem}</p>
      </Block>
      <Block label="Solution">
        <p className="text-[0.95rem] leading-relaxed">{p.solution}</p>
      </Block>

      {p.features.length > 0 ? (
        <Block label="Key features">
          <ul className="space-y-1.5 text-[0.95rem]">
            {p.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-volt" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </Block>
      ) : (
        <DevNote>List the real implemented features of “{p.name}” in src/config/site.ts.</DevNote>
      )}

      {p.verifiedAlgorithms.length > 0 && (
        <Block label="Cryptography">
          <ul className="flex flex-wrap gap-2">
            {p.verifiedAlgorithms.map((a) => (
              <li key={a} className="chip font-mono text-xs">
                {a}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {p.stack.length > 0 ? (
        <Block label="Tech stack">
          <ul className="flex flex-wrap gap-2">
            {p.stack.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </Block>
      ) : (
        <DevNote>Add the technologies actually used in “{p.name}” (stack).</DevNote>
      )}

      {p.contribution ? (
        <Block label="My contribution">
          <p className="text-[0.95rem] leading-relaxed">{p.contribution}</p>
        </Block>
      ) : (
        <DevNote>Write your individual contribution to “{p.name}” (contribution).</DevNote>
      )}

      {(p.links.demo || p.links.source) && (
        <div className="flex flex-wrap gap-3 pt-1">
          {p.links.demo && (
            <a href={p.links.demo} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
              View Project <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
          {p.links.source && (
            <a href={p.links.source} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              <GithubIcon className="h-4 w-4" /> View Source Code
            </a>
          )}
        </div>
      )}
      {!p.links.demo && !p.links.source && (
        <DevNote>
          No public links yet — set links.demo / links.source for “{p.name}”. Buttons are hidden
          until then.
        </DevNote>
      )}
    </div>
  )
}

export function Projects() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const select = (i: number) => {
    setDir(i >= index ? 1 : -1)
    setIndex(i)
  }

  // 3D objects elsewhere on the page can pre-select a project before scrolling here.
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const i = projects.findIndex((p) => p.id === id)
      if (i >= 0) {
        setIndex((prev) => {
          setDir(i >= prev ? 1 : -1)
          return i
        })
      }
    }
    window.addEventListener('select-project', handler)
    return () => window.removeEventListener('select-project', handler)
  }, [])

  const project = projects[index]

  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading
        index="03"
        eyebrow="Featured projects"
        id="projects-title"
        lead="Academic and concept work that explores security, systems and student guidance. Each one is labelled honestly as a concept, project or tool."
      >
        Things I’ve been <span className="serif-accent">building.</span>
      </SectionHeading>

      <Reveal>
        <div role="tablist" aria-label="Projects" className="mb-8 flex flex-wrap gap-2">
          {projects.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              type="button"
              id={`tab-${p.id}`}
              aria-selected={i === index}
              aria-controls={`panel-${p.id}`}
              onClick={() => select(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') select((index + 1) % projects.length)
                if (e.key === 'ArrowLeft') select((index - 1 + projects.length) % projects.length)
              }}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                i === index
                  ? 'border-bone bg-bone text-ink-900'
                  : 'border-white/15 text-mute hover:border-white/40 hover:text-bone'
              }`}
            >
              <span className="mr-2 font-mono text-xs opacity-60">0{i + 1}</span>
              {p.name}
            </button>
          ))}
        </div>
      </Reveal>

      <div style={{ perspective: 1600 }}>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={project.id}
            id={`panel-${project.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${project.id}`}
            custom={dir}
            variants={{
              enter: (d: number) => ({
                opacity: 0,
                x: reduce ? 0 : d * 60,
                rotateY: reduce ? 0 : d * -14,
                scale: reduce ? 1 : 0.98,
              }),
              center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
              exit: (d: number) => ({
                opacity: 0,
                x: reduce ? 0 : d * -60,
                rotateY: reduce ? 0 : d * 14,
                scale: reduce ? 1 : 0.98,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className="grid gap-8 lg:grid-cols-12 lg:gap-12"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="glass rounded-2xl p-4 sm:p-6 lg:col-span-7 ticks">
              <Visual id={project.id} />
            </div>
            <div className="lg:col-span-5">
              <Info p={project} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}
