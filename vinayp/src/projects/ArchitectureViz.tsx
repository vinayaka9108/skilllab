import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

type Actor = 'owner' | 'authority' | 'user'

const ACTORS: { id: Actor; label: string }[] = [
  { id: 'owner', label: 'Data Owner' },
  { id: 'authority', label: 'Trusted Authority' },
  { id: 'user', label: 'Data User' },
]

const STEPS: { title: string; sub: string; actors: Actor[]; text: string }[] = [
  {
    title: 'Encrypt',
    sub: 'Protect the file',
    actors: ['owner'],
    text: 'The data owner’s file is encrypted before it is uploaded, so what reaches the cloud is protected ciphertext rather than the readable file.',
  },
  {
    title: 'Store',
    sub: 'Cloud storage',
    actors: ['owner'],
    text: 'The encrypted file is placed in cloud storage. The cloud only holds data; it does not decide who may read it.',
  },
  {
    title: 'Hash',
    sub: 'Fingerprint it',
    actors: ['owner'],
    text: 'A cryptographic hash of the file is generated. Any later change to the file, however small, would produce a different hash.',
  },
  {
    title: 'Record',
    sub: 'Write to ledger',
    actors: ['authority'],
    text: 'The hash and the access event are recorded on the blockchain ledger, creating a tamper-evident integrity and audit entry.',
  },
  {
    title: 'Authorize',
    sub: 'Role & organization',
    actors: ['authority', 'user'],
    text: 'When a data user requests the file, the trusted authority checks their role and organization-based access before permitting it.',
  },
  {
    title: 'Verify',
    sub: 'Audit the result',
    actors: ['user', 'authority'],
    text: 'The file’s hash is recomputed and compared with the ledger entry. A match confirms integrity, and the access is added to the audit trail.',
  },
]

// Snake layout: 1→2→3 across the top, 4→5→6 back along the bottom.
const POS = [
  { x: 130, y: 86 },
  { x: 360, y: 86 },
  { x: 590, y: 86 },
  { x: 590, y: 224 },
  { x: 360, y: 224 },
  { x: 130, y: 224 },
]

export function ArchitectureViz() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const current = STEPS[step]

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2600)
    return () => window.clearInterval(id)
  }, [playing])

  const go = (n: number) => {
    setPlaying(false)
    setStep((n + STEPS.length) % STEPS.length)
  }

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Actors */}
      <ul className="flex flex-wrap gap-2" aria-label="Roles in this step">
        {ACTORS.map((a) => {
          const on = current.actors.includes(a.id)
          return (
            <li
              key={a.id}
              className={`rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors ${
                on ? 'border-volt/70 bg-volt/15 text-bone' : 'border-white/10 text-dim'
              }`}
            >
              {a.label}
            </li>
          )
        })}
      </ul>

      {/* Desktop / tablet: SVG flow */}
      <svg
        viewBox="0 0 720 310"
        className="hidden w-full sm:block"
        role="img"
        aria-label={`Vaultix file flow diagram. Current step ${step + 1} of ${STEPS.length}: ${current.title}.`}
      >
        {/* connectors */}
        {POS.slice(0, -1).map((p, i) => {
          const q = POS[i + 1]
          const done = i < step
          return (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke={done ? '#6a8bff' : '#ffffff'}
              strokeOpacity={done ? 0.7 : 0.14}
              strokeWidth="1.5"
              strokeDasharray={done ? undefined : '4 6'}
            />
          )
        })}

        {/* nodes */}
        {STEPS.map((s, i) => {
          const p = POS[i]
          const isActive = i === step
          const isDone = i < step
          return (
            <g
              key={s.title}
              role="button"
              tabIndex={0}
              aria-label={`Step ${i + 1}: ${s.title}`}
              aria-pressed={isActive}
              onClick={() => go(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  go(i)
                }
              }}
              className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[#6a8bff] [&:focus-visible>rect]:stroke-2"
              data-cursor
            >
              <rect
                x={p.x - 88}
                y={p.y - 36}
                width="176"
                height="72"
                rx="16"
                fill={isActive ? 'rgba(106,139,255,0.16)' : '#14161a'}
                stroke={isActive ? '#6a8bff' : isDone ? 'rgba(106,139,255,0.5)' : 'rgba(255,255,255,0.12)'}
                strokeWidth={isActive ? 1.8 : 1}
              />
              <text
                x={p.x - 70}
                y={p.y - 8}
                fontSize="11"
                fill={isActive ? '#9db1ff' : '#6b6e76'}
                fontFamily="JetBrains Mono, monospace"
              >
                {String(i + 1).padStart(2, '0')}
              </text>
              <text x={p.x - 70} y={p.y + 12} fontSize="19" fill="#ecebe6" fontFamily="Inter Tight, sans-serif" fontWeight="400">
                {s.title}
              </text>
              <text x={p.x - 70} y={p.y + 28} fontSize="11" fill="#9a9ca3" fontFamily="Inter Tight, sans-serif">
                {s.sub}
              </text>
            </g>
          )
        })}

        {/* travelling "file" packet */}
        <motion.g
          animate={{ x: POS[step].x, y: POS[step].y - 48 }}
          initial={false}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        >
          <rect x="-12" y="-9" width="24" height="18" rx="4" fill="#9b7bff" />
          <path d="M-6 -2 H6 M-6 3 H2" stroke="#0e0f12" strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>
      </svg>

      {/* Mobile: vertical list */}
      <ol className="space-y-2 sm:hidden">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-pressed={i === step}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                i === step ? 'border-volt/70 bg-volt/15' : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm">{s.title}</span>
              <span className="ml-auto text-xs text-mute">{s.sub}</span>
            </button>
          </li>
        ))}
      </ol>

      {/* Detail + controls */}
      <div className="mt-auto rounded-2xl border border-white/10 bg-black/20 p-4" aria-live="polite">
        <p className="eyebrow mb-2 text-volt">
          Step {step + 1} / {STEPS.length} — {current.title}
        </p>
        <p className="min-h-[4.5rem] text-[0.93rem] leading-relaxed text-bone/90">{current.text}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(step - 1)}
            aria-label="Previous step"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white/10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:bg-white/10"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? 'Pause' : 'Play flow'}
          </button>
          <button
            type="button"
            onClick={() => go(step + 1)}
            aria-label="Next step"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white/10"
          >
            <ChevronRight size={16} />
          </button>
          <p className="ml-auto hidden text-[0.7rem] text-dim sm:block">Simplified overview</p>
        </div>
      </div>
    </div>
  )
}
