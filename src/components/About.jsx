import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function GlitchPhoto() {
  return (
    <div className="relative w-full h-full">
      {/* Main image */}
      <img 
        src="/assets/sumit.png"
        alt="Sumit Kumar Ratna"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />
      {/* Gradient fade to background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/50 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-transparent z-10" />
      {/* Circuit pattern overlay inspired by user's actual photo */}
      <div className="absolute inset-0 z-20 opacity-0 hover:opacity-30 transition-opacity duration-700">
        <svg className="w-full h-full" viewBox="0 0 400 500" fill="none">
          <path d="M150 100 L250 100 L250 200 L300 250" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_4s_linear_infinite]" />
          <path d="M100 200 L200 200 L200 300 L150 350" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_5s_linear_infinite]" />
          <circle cx="250" cy="100" r="4" fill="#7c3aed" className="animate-pulse" />
          <circle cx="200" cy="200" r="4" fill="#2563eb" className="animate-pulse" />
          <circle cx="150" cy="350" r="4" fill="#7c3aed" className="animate-pulse" />
        </svg>
      </div>
    </div>
  )
}

const BIO_CONTENT = [
  { type: 'comment', text: '// who_am_i.js' },
  { type: 'code', text: 'const sumit = {' },
  { type: 'prop', key: '  role', val: ' "Full Stack Developer",' },
  { type: 'prop', key: '  focus', val: ' "AI/NLP Research",' },
  { type: 'prop', key: '  university', val: ' "Galgotias (CSE-AIML)",' },
  { type: 'prop', key: '  passion', val: ' "Building things that think",' },
  { type: 'code', text: '};' },
  { type: 'empty', text: '' },
  { type: 'comment', text: '// I build AI systems that understand' },
  { type: 'comment', text: '// human language, and interfaces' },
  { type: 'comment', text: '// that feel alive.' },
]

function TerminalBio() {
  const [lines, setLines] = useState([])
  const [started, setStarted] = useState(false)
  const containerRef = useRef(null)
  const indexRef = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => setStarted(true)
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    if (!started) return
    indexRef.current = 0
    const interval = setInterval(() => {
      if (indexRef.current < BIO_CONTENT.length) {
        const currentLine = BIO_CONTENT[indexRef.current]
        setLines(prev => [...prev, currentLine])
        indexRef.current++
      } else {
        clearInterval(interval)
      }
    }, 150)
    return () => clearInterval(interval)
  }, [started])

  return (
    <div ref={containerRef} className="font-mono text-sm leading-relaxed">
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="text-white/30 text-xs ml-2">~/sumit/about.js</span>
      </div>
      {lines.map((line, idx) => (
        <div key={idx} className="flex gap-3 py-0.5">
          <span className="text-white/15 w-5 text-right select-none text-xs">{idx + 1}</span>
          {line.type === 'comment' && <span className="text-white/30">{line.text}</span>}
          {line.type === 'code' && <span className="text-white/80">{line.text}</span>}
          {line.type === 'prop' && (
            <span>
              <span className="text-purple-400">{line.key}:</span>
              <span className="text-green-400">{line.val}</span>
            </span>
          )}
          {line.type === 'empty' && <span>&nbsp;</span>}
        </div>
      ))}
      {started && (
        <div className="flex gap-3 py-0.5">
          <span className="text-white/15 w-5 text-right select-none text-xs">{lines.length + 1}</span>
          <span className="text-white/60 animate-pulse">▍</span>
        </div>
      )}
    </div>
  )
}

function StatRing({ value, label, suffix = '', color, delay = 0 }) {
  const numberRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!numberRef.current || !ringRef.current) return

    const target = parseFloat(value)
    const isFloat = target % 1 !== 0

    ScrollTrigger.create({
      trigger: numberRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        // Animate the counter
        let obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2,
          delay,
          ease: 'power2.out',
          onUpdate: () => {
            if (numberRef.current) {
              numberRef.current.textContent = isFloat ? obj.val.toFixed(2) : Math.floor(obj.val)
            }
          }
        })
        // Animate the orbital ring stroke
        gsap.fromTo(ringRef.current, 
          { strokeDashoffset: 283 },
          { strokeDashoffset: 283 - (283 * (target / (isFloat ? 10 : 300))), duration: 2.5, delay, ease: 'power3.out' }
        )
      }
    })
  }, [value, delay])

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 mb-2 sm:mb-3">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          <circle 
            ref={ringRef}
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke={color} 
            strokeWidth="2.5" 
            strokeDasharray="283" 
            strokeDashoffset="283"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg sm:text-2xl font-black text-white group-hover:scale-110 transition-transform" ref={numberRef}>0</span>
          <span className="text-sm sm:text-lg font-bold" style={{ color }}>{suffix}</span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold text-center">{label}</span>
    </div>
  )
}

export default function About() {
  const containerRef = useRef(null)

  useGSAP(() => {
    // Pin section for immersive scroll
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=150%',
      pin: true,
      animation: gsap.timeline()
        .fromTo('.about-photo-wrap', 
          { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: 'power3.inOut' }
        )
        .fromTo('.about-content', 
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
        .fromTo('.about-stat',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.3')
        .fromTo('.about-floating',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(2)' }, '-=0.6'),
      scrub: 1
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="w-full min-h-screen lg:h-screen relative flex items-center overflow-hidden bg-[#080808] py-16 lg:py-0" id="about">
      
      {/* Huge faded background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[25vw] font-black text-white/[0.02] tracking-tighter whitespace-nowrap">ABOUT</span>
      </div>

      {/* Floating decorative elements */}
      <div className="about-floating absolute top-[15%] left-[8%] w-20 h-20 border border-purple-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
      <div className="about-floating absolute bottom-[20%] right-[12%] w-3 h-3 bg-blue-500/30 rounded-full animate-pulse" />
      <div className="about-floating absolute top-[60%] left-[5%] w-1 h-16 bg-gradient-to-b from-purple-500/20 to-transparent" />
      <div className="about-floating absolute top-[25%] right-[25%] w-32 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">
        
        {/* Left: Content */}
        <div className="about-content flex-1 max-w-xl space-y-8 order-2 lg:order-1">
          
          {/* Section tag */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400">About Me</span>
          </div>

          {/* Terminal-style bio */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 backdrop-blur-sm">
            <TerminalBio />
          </div>

          {/* Stats as orbital rings */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 pt-6">
            <div className="about-stat"><StatRing value="8.92" label="CGPA" color="#a855f7" delay={0} /></div>
            <div className="about-stat"><StatRing value="250" suffix="+" label="Problems" color="#3b82f6" delay={0.15} /></div>
            <div className="about-stat"><StatRing value="2" label="Projects" color="#22c55e" delay={0.3} /></div>
          </div>
        </div>

        {/* Right: Cinematic Photo */}
        <div className="flex-1 flex justify-center order-1 lg:order-2 w-full max-w-xs sm:max-w-sm lg:max-w-lg">
          <div className="about-photo-wrap relative w-full aspect-[3/4] rounded-2xl overflow-hidden" style={{ clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' }}>
            
            <GlitchPhoto />


            <div className="absolute top-6 right-6 z-30">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/50 font-mono">
                2024 – present
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/40 z-30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/40 z-30" />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes dash { to { stroke-dashoffset: -20; } }
      `}</style>
    </section>
  )
}
