import { lazy } from 'react'
import { Blocks, Code, Mail, Network, ShieldCheck, User } from 'lucide-react'
import { Reveal, Section, SectionHeading } from '../components/ui'
import { SceneHost } from '../scene/SceneHost'
import { UniverseFallback } from '../scene/Fallbacks'
import { goTo } from '../lib/dom'
import { projects } from '../config/site'

const UniverseScene = lazy(() => import('../scene/UniverseScene'))

// Keyboard- and touch-friendly twin of the 3D objects: always rendered, always works.
const LINKS = [
  { icon: Code, label: 'Skills', hint: 'Code symbol', go: () => goTo('skills') },
  { icon: ShieldCheck, label: 'About', hint: 'Cybersecurity shield', go: () => goTo('about') },
  { icon: Blocks, label: 'Journey', hint: 'Architecture blocks', go: () => goTo('journey') },
  {
    icon: Network,
    label: 'Vaultix',
    hint: 'Blockchain nodes',
    go: () => goTo('projects', { projectId: 'vaultix' }),
  },
  ...projects
    .filter((p) => p.id !== 'vaultix')
    .map((p) => ({
      icon: User,
      label: p.name,
      hint: 'Project marker',
      go: () => goTo('projects', { projectId: p.id }),
    })),
  { icon: Mail, label: 'Contact', hint: 'Central core', go: () => goTo('contact') },
]

export function UniverseSection() {
  return (
    <Section id="universe" labelledBy="universe-title">
      <SectionHeading
        index="06"
        eyebrow="Interactive"
        id="universe-title"
        lead="Everything above, as a small universe. Click or tap any floating object to jump to its section — the core takes you to Contact."
      >
        Vinay’s <span className="serif-accent">Digital Universe.</span>
      </SectionHeading>

      <Reveal>
        <div className="glass relative overflow-hidden rounded-2xl ticks">
          <SceneHost
            scene={UniverseScene}
            fallback={<UniverseFallback />}
            label="Interactive 3D universe. Use the buttons below as a keyboard-friendly alternative."
            disableOnMobile
            className="relative h-[min(70vh,34rem)] min-h-[22rem] w-full"
          />
          <p className="eyebrow pointer-events-none absolute left-5 top-4">Hover &amp; click the objects</p>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Quick links to the same destinations">
          {LINKS.map(({ icon: Icon, label, hint, go }) => (
            <li key={label}>
              <button
                type="button"
                onClick={go}
                className="group inline-flex items-center gap-2.5 rounded-md border border-white/12 px-4 py-2.5 text-sm text-bone/90 transition-colors hover:border-volt/60 hover:bg-volt/10"
                title={hint}
              >
                <Icon size={15} className="text-volt" aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
