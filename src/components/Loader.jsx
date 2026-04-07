import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef(null)
  const nameRef = useRef(null)

  useEffect(() => {
    // Stagger-in name characters
    const chars = nameRef.current?.querySelectorAll('.loader-char')
    if (chars) {
      gsap.fromTo(chars,
        { y: 40, opacity: 0, rotateX: -90 },
        { 
          y: 0, opacity: 1, rotateX: 0,
          stagger: 0.04, 
          duration: 0.8, 
          ease: 'back.out(1.7)',
          delay: 0.3
        }
      )
    }

    // Glitch effect on name — periodic quick offset + color shift
    const glitchInterval = setInterval(() => {
      if (!nameRef.current) return
      const offset = (Math.random() - 0.5) * 4
      nameRef.current.style.transform = `translate(${offset}px, ${offset * 0.5}px)`
      nameRef.current.style.textShadow = `${-offset}px 0 #7c3aed, ${offset}px 0 #2563eb`
      
      setTimeout(() => {
        if (nameRef.current) {
          nameRef.current.style.transform = 'translate(0, 0)'
          nameRef.current.style.textShadow = 'none'
        }
      }, 80)
    }, 2000)

    // Simulate loading progress
    let targetProgress = 0
    const interval = setInterval(() => {
      targetProgress += Math.random() * 12 + 2
      if (targetProgress > 100) targetProgress = 100

      setProgress(Math.floor(targetProgress))

      if (targetProgress === 100) {
        clearInterval(interval)
        clearInterval(glitchInterval)

        // Exit animation
        const tl = gsap.timeline({ onComplete })
        tl.to('.loader-bar-fill', { scaleX: 1, duration: 0.3, ease: 'power2.out' })
          .to('.loader-subtitle', { opacity: 0, y: -10, duration: 0.3 }, '-=0.1')
          .to('.loader-counter', { opacity: 0, y: -10, duration: 0.3 }, '-=0.2')
          .to('.loader-bar', { opacity: 0, duration: 0.3 }, '-=0.2')
          .to(nameRef.current, { 
            scale: 1.1, 
            opacity: 0, 
            filter: 'blur(10px)',
            duration: 0.6, 
            ease: 'power2.in' 
          }, '-=0.2')
          .to(containerRef.current, { 
            opacity: 0, 
            duration: 0.4
          })
      }
    }, 120)

    return () => {
      clearInterval(interval)
      clearInterval(glitchInterval)
    }
  }, [onComplete])

  const nameChars = "Sumit Kumar Ratna".split("")

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808] loader">
      
      {/* Ambient background glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} 
      />

      <div className="relative flex flex-col items-center justify-center gap-6">
        
        {/* Name with character stagger */}
        <div ref={nameRef} className="overflow-hidden perspective-[1000px]">
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-7xl text-white tracking-tighter flex flex-wrap justify-center">
            {nameChars.map((char, i) => (
              <span 
                key={i} 
                className={`loader-char inline-block ${char === " " ? "w-[0.3em]" : ""}`}
                style={{ transformOrigin: 'bottom center' }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="loader-subtitle text-white/30 text-xs sm:text-sm uppercase tracking-[0.4em] font-medium">
          Portfolio · 2026
        </p>

        {/* Progress bar */}
        <div className="loader-bar w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
          <div 
            className="loader-bar-fill h-full rounded-full origin-left transition-transform duration-200 ease-out"
            style={{ 
              transform: `scaleX(${progress / 100})`,
              background: 'linear-gradient(90deg, #7c3aed, #2563eb)' 
            }}
          />
        </div>

        {/* Counter */}
        <span className="loader-counter font-mono text-sm text-white/40 tracking-[0.3em]">
          {String(progress).padStart(3, '0')}%
        </span>
      </div>
    </div>
  )
}
