import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, Section, SectionHeading } from '../components/ui'
import { milestones } from '../config/site'

function Gauge({ percent, current }: { percent?: number; current?: boolean }) {
  const r = 54
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90" aria-hidden="true">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
      {percent !== undefined && (
        <motion.circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - percent / 100) }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        />
      )}
      {current && (
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${c * 0.22} ${c}`}
          className="orbit-spin"
          style={{ transformOrigin: '70px 70px' }}
        />
      )}
      <defs>
        <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6a8bff" />
          <stop offset="1" stopColor="#9b7bff" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Journey() {
  const [i, setI] = useState(milestones.length - 1)
  const m = milestones[i]

  return (
    <Section id="journey" labelledBy="journey-title">
      <SectionHeading
        index="04"
        eyebrow="Education & journey"
        id="journey-title"
        lead="From school to a diploma in computer science, and now engineering at RVCE. Select a stage to see the numbers."
      >
        The path <span className="serif-accent">so far.</span>
      </SectionHeading>

      <Reveal>
        {/* Rail */}
        <div role="tablist" aria-label="Education timeline" className="relative mb-10 grid grid-cols-4">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-[1.05rem] h-px bg-white/15"
            aria-hidden="true"
          />
          <motion.div
            className="absolute left-[12.5%] top-[1.05rem] h-px origin-left bg-gradient-to-r from-volt to-iris"
            style={{ width: '75%' }}
            animate={{ scaleX: i / (milestones.length - 1) }}
            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            aria-hidden="true"
          />
          {milestones.map((ms, idx) => {
            const reached = idx <= i
            return (
              <button
                key={ms.id}
                role="tab"
                type="button"
                id={`ms-tab-${ms.id}`}
                aria-selected={idx === i}
                aria-controls="ms-panel"
                onClick={() => setI(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') setI(Math.min(milestones.length - 1, i + 1))
                  if (e.key === 'ArrowLeft') setI(Math.max(0, i - 1))
                }}
                className="group relative flex flex-col items-center gap-3 px-1 text-center"
              >
                <span
                  className={`relative z-10 grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full border transition-colors ${
                    idx === i
                      ? 'border-volt bg-volt text-ink-900'
                      : reached
                        ? 'border-volt/60 bg-ink-900 text-volt'
                        : 'border-white/20 bg-ink-900 text-dim'
                  }`}
                >
                  {ms.current && idx !== i && (
                    <span className="beacon absolute inset-0 rounded-full bg-volt/40" aria-hidden="true" />
                  )}
                  <span className="font-mono text-[0.65rem]">{idx + 1}</span>
                </span>
                <span
                  className={`text-xs sm:text-sm ${idx === i ? 'text-bone' : 'text-mute group-hover:text-bone'}`}
                >
                  {ms.short}
                </span>
              </button>
            )
          })}
        </div>

        {/* Detail */}
        <div id="ms-panel" role="tabpanel" aria-labelledby={`ms-tab-${m.id}`} className="glass rounded-2xl p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid items-center gap-8 md:grid-cols-[auto_1fr]"
            >
              <div className="relative mx-auto grid place-items-center">
                <Gauge percent={m.percent} current={m.current} />
                <div className="absolute text-center">
                  <p className="text-3xl font-light leading-none">{m.figure}</p>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-3">
                  Stage {i + 1} of {milestones.length}
                  {m.current && <span className="ml-3 text-volt">● In progress</span>}
                </p>
                <h3 className="text-2xl font-light sm:text-3xl">{m.title}</h3>
                <p className="mt-1 text-mute">{m.detail}</p>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-volt">
                  {m.figureLabel}
                </p>
                {m.courses && m.courses.length > 0 && (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="eyebrow mb-3">Subjects this semester</p>
                    <ul className="flex flex-wrap gap-2">
                      {m.courses.map((c) => (
                        <li
                          key={c}
                          className="chip"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.note && <p className="mt-4 max-w-lg text-sm text-dim">{m.note}</p>}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  )
}
