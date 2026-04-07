import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const menuRef = useRef(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const heroTrigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom 20%',
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    })

    const sections = ['about', 'skills', 'projects', 'achievements', 'contact']
    const triggers = sections.map(id => {
      return ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      })
    })

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)

      if (scrollTop > lastScrollY.current + 5) {
        setHidden(true)
      } else if (scrollTop < lastScrollY.current - 5) {
        setHidden(false)
      }
      lastScrollY.current = scrollTop
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      heroTrigger.kill()
      triggers.forEach(t => t.kill())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Animate desktop nav in/out
  useEffect(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      y: !visible || hidden ? -80 : 0,
      opacity: !visible || hidden ? 0 : 1,
      duration: 0.4,
      ease: 'power2.out'
    })
  }, [visible, hidden])

  // Animate mobile menu overlay
  useEffect(() => {
    if (!menuRef.current) return
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.to(menuRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3 })
      gsap.fromTo('.mobile-nav-link',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'back.out(1.5)', delay: 0.1 }
      )
    } else {
      document.body.style.overflow = ''
      gsap.to(menuRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.25 })
    }
  }, [menuOpen])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    // Small delay so menu closes before scrolling
    setTimeout(() => {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, menuOpen ? 300 : 0)
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60] bg-transparent">
        <div
          className="h-full transition-[width] duration-150 ease-linear"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #7c3aed, #2563eb, #7c3aed)',
            boxShadow: '0 0 8px rgba(124, 58, 237, 0.6), 0 0 20px rgba(37, 99, 235, 0.3)'
          }}
        />
      </div>

      {/* ─── Desktop Navbar (hidden on mobile) ─── */}
      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[55] pointer-events-auto hidden lg:block"
        style={{ opacity: 0, transform: 'translateY(-80px) translateX(-50%)' }}
      >
        <div className="flex items-center gap-1 px-2 py-2 rounded-full border border-white/10 shadow-2xl"
          style={{
            background: 'rgba(8, 8, 8, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace('#', '')
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300
                  ${isActive
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
                  }`}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full -z-10 animate-[fadeIn_0.3s_ease]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.25))',
                      border: '1px solid rgba(124,58,237,0.3)',
                    }}
                  />
                )}
                {item.label}
              </a>
            )
          })}
        </div>
      </nav>

      {/* ─── Mobile Hamburger Button (visible on mobile only) ─── */}
      {visible && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`fixed top-4 right-4 z-[70] w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-full border border-white/10 shadow-xl lg:hidden pointer-events-auto transition-all duration-300 ${menuOpen ? 'bg-white/10' : ''}`}
          style={{
            background: menuOpen ? 'rgba(8,8,8,0.9)' : 'rgba(8, 8, 8, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      )}

      {/* ─── Mobile Fullscreen Menu Overlay ─── */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[65] flex flex-col items-center justify-center lg:hidden"
        style={{
          opacity: 0,
          pointerEvents: 'none',
          background: 'rgba(8, 8, 8, 0.95)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Ambient glow */}
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        />

        <div className="flex flex-col items-center gap-6 relative z-10">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace('#', '')
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`mobile-nav-link text-2xl font-black uppercase tracking-[0.2em] transition-colors duration-300 pointer-events-auto
                  ${isActive
                    ? 'text-white'
                    : 'text-white/30 hover:text-white/60'
                  }`}
              >
                {isActive && (
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-3 animate-pulse" />
                )}
                {item.label}
              </a>
            )
          })}
        </div>

        {/* Subtle divider + resume link */}
        <div className="mt-12 flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-[1px] bg-white/10" />
          <a
            href="https://drive.google.com/file/d/1hZU97NFsiszHPk8mJb19kEME6eUk-6aF/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-link text-sm uppercase tracking-[0.3em] text-purple-400 hover:text-purple-300 transition-colors pointer-events-auto"
          >
            📄 Resume
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}
