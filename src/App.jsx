import { useEffect, useState, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import CustomCursor from './components/CustomCursor'
import Loader from './components/Loader'
import Navbar from './components/Navbar'

// Lazy-load heavy components (R3F canvases, large sections)
const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const Achievements = lazy(() => import('./components/Achievements'))
const Contact = lazy(() => import('./components/Contact'))

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Detect prefers-reduced-motion
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function SectionFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#080808]">
      <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const reducedMotion = prefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return // Skip Lenis if reduced motion

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [reducedMotion])

  return (
    <>
      <div className="film-grain" aria-hidden="true"></div>
      {!reducedMotion && <CustomCursor />}
      
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
      ) : (
        <main id="main-content" className="w-full min-h-screen bg-[#080808] text-white">
          <Navbar />
          <Suspense fallback={<SectionFallback />}>
            <Hero />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Skills />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Achievements />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </main>
      )}
    </>
  )
}

export default App
