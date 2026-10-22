import { Nav } from './components/Nav'
import { Cursor } from './components/Cursor'
import { Intro } from './components/Intro'
import { ScrollProgress } from './components/ui'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { Journey } from './sections/Journey'
import { Beyond } from './sections/Beyond'
import { UniverseSection } from './sections/UniverseSection'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export default function App() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded focus:bg-bone focus:px-4 focus:py-2 focus:text-ink-900"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Intro />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Beyond />
        <UniverseSection />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
