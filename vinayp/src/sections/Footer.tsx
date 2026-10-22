import { ArrowUp } from 'lucide-react'
import { goTo } from '../lib/dom'
import { Monogram } from '../components/Monogram'

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-dim sm:px-8 lg:px-12">
        <p className="flex items-center gap-2.5">
          <Monogram className="h-4 w-4 text-bone/70" />
          <span>
            © {new Date().getFullYear()} Vinayaka Neelammanavara · Built with React, Three.js &
            Tailwind
          </span>
        </p>
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            goTo('home')
          }}
          className="inline-flex items-center gap-2 text-mute transition-colors hover:text-bone"
        >
          Back to top <ArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
