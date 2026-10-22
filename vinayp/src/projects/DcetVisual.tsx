import { ArrowRight, ListChecks, SlidersHorizontal, TrendingUp } from 'lucide-react'

const FLOW = [
  { icon: SlidersHorizontal, title: 'Enter details', text: 'A diploma student provides the inputs the tool needs.' },
  { icon: TrendingUp, title: 'Explore rank outcomes', text: 'The tool shows possible DCET rank outcomes.' },
  { icon: ListChecks, title: 'Plan admissions', text: 'Use that context to weigh engineering-college options.' },
]

/**
 * An honest, illustrative layout. It deliberately shows no numbers: prediction method,
 * accuracy and inputs are not described here until they are verified from the source.
 */
export function DcetVisual() {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-dim">
            Layout illustration · no real data
          </span>
        </div>
        <div className="grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto_1fr]" aria-hidden="true">
          <div className="space-y-2.5">
            <p className="eyebrow">Inputs</p>
            {[70, 90, 55].map((w, i) => (
              <div key={i} className="h-9 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <div className="h-full rounded bg-white/10" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
          <ArrowRight className="mx-auto hidden text-volt sm:block" />
          <div className="rounded-xl border border-volt/40 bg-volt/10 p-4">
            <p className="eyebrow mb-3">Possible outcome</p>
            <div className="h-3 w-3/4 rounded bg-volt/40" />
            <div className="mt-2 h-3 w-1/2 rounded bg-white/15" />
            <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
          </div>
        </div>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {FLOW.map((f, i) => {
          const Icon = f.icon
          return (
            <li key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center gap-2 text-volt">
                <Icon size={16} aria-hidden="true" />
                <span className="font-mono text-[0.65rem]">0{i + 1}</span>
              </div>
              <p className="text-sm">{f.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-mute">{f.text}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
