import { Reveal, Section, SectionHeading } from '../components/ui'
import { beyondTheCode } from '../config/site'

export function Beyond() {
  return (
    <Section id="beyond" labelledBy="beyond-title">
      <SectionHeading
        index="05"
        eyebrow="Teamwork"
        id="beyond-title"
        lead="Good software is rarely a solo effort. These are the habits I’m building alongside the technical skills."
      >
        Beyond the <span className="serif-accent">Code.</span>
      </SectionHeading>

      <ol className="border-t border-white/10">
        {beyondTheCode.map((b, i) => (
          <li key={b.title}>
            <Reveal delay={i * 0.04}>
              <div className="group grid items-baseline gap-2 border-b border-white/10 py-7 transition-colors hover:bg-white/[0.02] md:grid-cols-[4rem_1fr_1.3fr] md:gap-8 md:px-2">
                <span className="font-mono text-xs text-dim transition-colors group-hover:text-volt">
                  0{i + 1}
                </span>
                <h3 className="text-xl font-light sm:text-2xl">{b.title}</h3>
                <p className="text-mute">{b.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
