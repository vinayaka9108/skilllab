import { useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { goTo } from '../lib/dom'
import { useActiveSection } from '../lib/hooks'
import { Monogram } from './Monogram'

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'journey', 'beyond', 'universe', 'contact']
// Sections that are not in the nav highlight the nearest nav item.
const NAV_ALIAS: Record<string, string> = { beyond: 'journey', universe: 'journey' }

export function Nav() {
  const active = useActiveSection(SECTION_IDS)
  const current = NAV_ALIAS[active] ?? active
  const currentLabel = NAV.find((n) => n.id === current)?.label ?? 'Home'
  const currentIndex = Math.max(1, SECTION_IDS.indexOf(active) + 1)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const click = (id: string) => (e: ReactMouseEvent) => {
    e.preventDefault()
    setOpen(false)
    goTo(id)
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="relative">
        <nav
          aria-label="Primary"
          className="glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5"
        >
          <a
            href="#home"
            onClick={click('home')}
            aria-label="Vinay — back to top"
            className="grid h-10 w-10 place-items-center rounded-full bg-bone text-ink-900 transition-transform hover:scale-[1.04]"
          >
            <Monogram className="h-[1.15rem] w-[1.15rem]" />
          </a>

          <span className="mx-1 hidden h-6 w-px bg-white/12 md:block" aria-hidden="true" />

          <ul className="hidden items-center md:flex">
            {NAV.map((item) => {
              const isActive = current === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={click(item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`relative block rounded-full px-4 py-2 text-sm transition-colors ${
                      isActive ? 'text-bone' : 'text-mute hover:text-bone'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Section readout — a small instrument, not decoration. */}
          <span
            className="ml-1 hidden items-baseline gap-1.5 border-l border-white/12 pl-3 pr-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] md:flex"
            aria-hidden="true"
          >
            <span className="text-volt tabular-nums">
              {String(currentIndex).padStart(2, '0')}
            </span>
            <span className="text-dim">/</span>
            <span className="text-dim tabular-nums">{String(SECTION_IDS.length).padStart(2, '0')}</span>
          </span>

          <span className="px-3 font-mono text-xs uppercase tracking-[0.16em] text-mute md:hidden">
            {currentLabel}
          </span>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-bone hover:bg-white/10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <div className="pointer-events-auto absolute right-0 top-full mt-2 w-[min(88vw,18rem)] md:hidden">
              <motion.ul
                id="mobile-menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="glass rounded-2xl p-2"
              >
                {NAV.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={click(item.id)}
                      aria-current={current === item.id ? 'location' : undefined}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base ${
                        current === item.id ? 'bg-white/10 text-bone' : 'text-mute'
                      }`}
                    >
                      {item.label}
                      {current === item.id && (
                        <span className="h-1.5 w-1.5 rounded-full bg-volt" aria-hidden="true" />
                      )}
                    </a>
                  </li>
                ))}
              </motion.ul>
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
