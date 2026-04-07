import { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timelineData = [
  {
    title: "1st Runner-Up · Gen-AI Hackathon",
    date: "Feb 2026",
    accent: '#eab308',
    icon: '🥈',
    burst: true,
    desc: 'Built HealthNexus — an AI-powered healthcare ecosystem using Gemini API.'
  },
  {
    title: "AI Club Coordinator · Galgotias University",
    date: "Oct 2025 – Present",
    accent: '#3b82f6',
    icon: '🧠',
    desc: 'Leading AI/ML workshops, hackathon organization, and collaborative research.'
  },
  {
    title: "Pre-qualified · Smart India Hackathon 2025",
    date: "2025",
    accent: '#22c55e',
    icon: '🇮🇳',
    desc: 'National-level problem statement on healthcare digitization.'
  },
  {
    title: "250+ Problems Solved · LeetCode + GFG",
    date: "Ongoing",
    accent: '#f97316',
    icon: '⚡',
    desc: 'Data structures, algorithms, and competitive programming practice.'
  },
  {
    title: "Oracle Database Certification",
    date: "Oct – Dec 2024",
    accent: '#ef4444',
    icon: '🎓',
    desc: 'Certified in Oracle SQL, PL/SQL, and database administration.'
  },
  {
    title: "ML / DL / GenAI Certification",
    date: "Sep – Nov 2024",
    accent: '#a855f7',
    icon: '📜',
    desc: 'Deep learning, transformers, and generative AI foundations.'
  }
]

// Particle burst canvas for the hackathon achievement
function ParticleBurst({ triggerRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = 300
    canvas.height = 200

    const particles = []
    let animFrameId
    let triggered = false

    class Particle {
      constructor() {
        this.x = 150
        this.y = 100
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 4
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        this.life = 1
        this.decay = 0.008 + Math.random() * 0.012
        this.size = 2 + Math.random() * 3
        // Gold, amber, yellow hues
        const hue = 40 + Math.random() * 20
        this.color = `hsla(${hue}, 100%, ${50 + Math.random() * 30}%, `
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.02 // slight gravity
        this.vx *= 0.995
        this.life -= this.decay
      }
      draw(ctx) {
        if (this.life <= 0) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2)
        ctx.fillStyle = this.color + this.life + ')'
        ctx.fill()
      }
    }

    function burst() {
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle())
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update()
        particles[i].draw(ctx)
        if (particles[i].life <= 0) particles.splice(i, 1)
      }
      animFrameId = requestAnimationFrame(animate)
    }

    // Trigger burst when card scrolls in
    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (!triggered) {
          triggered = true
          burst()
          // Second wave 200ms later
          setTimeout(burst, 200)
        }
      }
    })

    animate()
    return () => {
      cancelAnimationFrame(animFrameId)
      st.kill()
    }
  }, [triggerRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

// Floating ambient dots
function FloatingDots() {
  const dots = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${5 + Math.random() * 90}%`,
      size: 2 + Math.random() * 3,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.15
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map(dot => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-purple-500"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            animation: `floatDot ${dot.duration}s ease-in-out ${dot.delay}s infinite alternate`
          }}
        />
      ))}
      <style>{`
        @keyframes floatDot {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.05; }
          50% { opacity: 0.25; }
          100% { transform: translateY(-30px) translateX(15px); opacity: 0.08; }
        }
      `}</style>
    </div>
  )
}

export default function Achievements() {
  const containerRef = useRef(null)
  const hackathonRef = useRef(null)

  useGSAP(() => {
    // Center line drawing via stroke-dashoffset
    gsap.fromTo('.timeline-line-draw', 
      { strokeDashoffset: 1200 },
      { 
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 0.5
        }
      }
    )

    // Each card clips in from its side
    const items = gsap.utils.toArray('.timeline-item')
    items.forEach((item, i) => {
      const isLeft = i % 2 === 0
      
      gsap.fromTo(item,
        { 
          opacity: 0,
          clipPath: isLeft 
            ? 'inset(0% 0% 0% 100%)' 
            : 'inset(0% 100% 0% 0%)'
        },
        {
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            once: true
          }
        }
      )
    })

    // Connector dots pulse in
    gsap.utils.toArray('.timeline-dot').forEach((dot, i) => {
      gsap.fromTo(dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 80%',
            once: true
          }
        }
      )
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="py-16 sm:py-32 w-full bg-[#080808] relative border-t border-white/5" id="achievements">
      
      <FloatingDots />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-28">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#a855f7] mb-4">Milestones</h2>
          <h3 className="text-4xl sm:text-5xl md:text-7xl font-black font-display tracking-tighter text-white">
            Achievements<span className="text-[#a855f7]">.</span>
          </h3>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* SVG Center line */}
          <svg 
            className="absolute left-1/2 -translate-x-[1px] top-0 h-full w-[2px] z-0 hidden md:block" 
            preserveAspectRatio="none" 
            viewBox="0 0 2 1200"
          >
            {/* Ghost track */}
            <line x1="1" y1="0" x2="1" y2="1200" stroke="white" strokeOpacity="0.05" strokeWidth="2" />
            {/* Animated draw line */}
            <line 
              className="timeline-line-draw" 
              x1="1" y1="0" x2="1" y2="1200" 
              stroke="url(#timelineGrad)" 
              strokeWidth="2" 
              strokeDasharray="1200" 
              strokeDashoffset="1200"
            />
            <defs>
              <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>

          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0
            const isHackathon = item.burst
            const itemRef = isHackathon ? hackathonRef : null
            
            return (
              <div 
                key={index} 
                ref={itemRef}
                className={`timeline-item relative flex flex-col md:flex-row items-center w-full mb-10 sm:mb-20 ${isLeft ? 'md:flex-row-reverse' : ''}`}
              >
                
                {/* Center connector dot */}
                <div className="timeline-dot absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
                  <div 
                    className="w-5 h-5 rounded-full border-2"
                    style={{ 
                      borderColor: item.accent, 
                      backgroundColor: '#080808',
                      boxShadow: `0 0 12px ${item.accent}40`
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full m-auto mt-[3px]"
                      style={{ backgroundColor: item.accent }}
                    />
                  </div>
                </div>

                {/* Glass card */}
                <div className={`w-full md:w-1/2 p-4 md:p-6 ${isLeft ? 'md:pr-14 text-left md:text-right' : 'md:pl-14 text-left'}`}>
                  <div 
                    className="relative group rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0 ${item.accent}00`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 30px ${item.accent}15`
                      e.currentTarget.style.borderColor = `${item.accent}30`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0 ${item.accent}00`
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    }}
                  >
                    {/* Particle burst overlay for hackathon */}
                    {isHackathon && <ParticleBurst triggerRef={hackathonRef} />}

                    {/* Icon + date row */}
                    <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                      <span className="text-2xl">{item.icon}</span>
                      <span 
                        className="text-xs font-bold tracking-[0.2em] uppercase"
                        style={{ color: item.accent }}
                      >
                        {item.date}
                      </span>
                    </div>

                    <h4 className="text-lg md:text-xl font-bold text-white leading-tight mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Accent bar at bottom */}
                    <div 
                      className="mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-700 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }}
                    />
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
