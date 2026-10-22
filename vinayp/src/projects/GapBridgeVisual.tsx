import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Compass, Search, Users } from 'lucide-react'

type Status = 'gap' | 'learning' | 'covered'
const NEXT: Record<Status, Status> = { gap: 'learning', learning: 'covered', covered: 'gap' }
const LABEL: Record<Status, string> = { gap: 'Gap', learning: 'Learning', covered: 'Covered' }
const STYLE: Record<Status, string> = {
  gap: 'border-iris/50 bg-iris/15 text-iris',
  learning: 'border-volt/50 bg-volt/15 text-volt',
  covered: 'border-white/20 bg-white/10 text-bone',
}

// Illustrative topics only — this is a concept preview, not real student data.
const TOPICS = ['Engineering Mathematics', 'Programming Fundamentals', 'Basic Electronics', 'Communication Skills']

const JOURNEY = [
  { icon: Search, title: 'Identify', text: 'Spot the fundamentals you may have missed when joining in the second year.' },
  { icon: BookOpen, title: 'Discover', text: 'Find learning resources matched to each gap.' },
  { icon: Users, title: 'Connect', text: 'Reach out to experienced student mentors who made the same transition.' },
  { icon: Compass, title: 'Progress', text: 'Track what is covered and keep moving with guidance.' },
]

export function GapBridgeVisual() {
  const [state, setState] = useState<Record<string, Status>>(
    Object.fromEntries(TOPICS.map((t, i) => [t, (['gap', 'learning', 'gap', 'covered'] as Status[])[i]])),
  )
  const [step, setStep] = useState(0)
  const covered = TOPICS.filter((t) => state[t] === 'covered').length
  const pct = Math.round((covered / TOPICS.length) * 100)

  return (
    <div className="flex h-full flex-col gap-5">
      {/* UI preview */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-dim">
            Concept preview · illustrative
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">Your fundamentals</p>
              <p className="mt-1 text-lg font-light">Where are the gaps?</p>
            </div>
            <p className="font-mono text-xs text-mute">
              {covered}/{TOPICS.length} covered
            </p>
          </div>

          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-volt to-iris"
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>

          <ul className="space-y-2">
            {TOPICS.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => setState((s) => ({ ...s, [t]: NEXT[s[t]] }))}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm hover:bg-white/[0.06]"
                  aria-label={`${t}: ${LABEL[state[t]]}. Activate to change status.`}
                >
                  {t}
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider ${STYLE[state[t]]}`}>
                    {LABEL[state[t]]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.7rem] text-dim">Tap a topic to cycle its status. Sample topics for illustration.</p>
        </div>
      </div>

      {/* Journey */}
      <div role="tablist" aria-label="GapBridge journey" className="grid grid-cols-4 gap-2">
        {JOURNEY.map((j, i) => {
          const Icon = j.icon
          const on = i === step
          return (
            <button
              key={j.title}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => setStep(i)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs transition-colors ${
                on ? 'border-volt/70 bg-volt/15 text-bone' : 'border-white/10 text-mute hover:text-bone'
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              {j.title}
            </button>
          )
        })}
      </div>
      <p role="tabpanel" className="min-h-[3rem] text-sm leading-relaxed text-bone/90">
        <span className="mr-2 font-mono text-xs text-volt">0{step + 1}</span>
        {JOURNEY[step].text}
      </p>
    </div>
  )
}
