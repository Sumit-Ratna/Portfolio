import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

// Reusable Tilt Card Component for Projects
function TiltCard({ children, className }) {
  const cardRef = useRef(null)
  const shineRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current || !shineRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Max 8 deg tilt tracking mouse
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    
    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out'
    })

    // Suble shine overlay effect
    gsap.to(shineRef.current, {
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`,
      duration: 0.1
    })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current || !shineRef.current) return
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'back.out(1.5)'
    })
    gsap.to(shineRef.current, {
      background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 60%)`,
      duration: 0.5
    })
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div 
        ref={shineRef} 
        className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay"
      ></div>
      {children}
    </div>
  )
}

export default function Projects() {
  const containerRef = useRef(null)
  const healthNexusRef = useRef(null)
  const nlpRef = useRef(null)
  
  useGSAP(() => {
    // HealthNexus pinning and layered reveal
    ScrollTrigger.create({
      trigger: healthNexusRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      animation: gsap.timeline()
        // Text reveals
        .fromTo('.hn-desc-line', 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' })
        // Tech chips animate in with stagger
        .fromTo('.hn-tech-chip',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, "-=0.4")
        // Device mockup slides in
        .fromTo('.hn-device', 
          { x: 100, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "<0.2")
        // Badge pops in and glows
        .fromTo('.hn-badge',
          { scale: 0.8, opacity: 0, boxShadow: '0 0 0 rgba(234,179,8,0)' },
          { scale: 1, opacity: 1, boxShadow: '0 0 30px rgba(234,179,8,0.4)', duration: 0.5, ease: 'back.out(1.5)' }, "-=0.5"
        ),
      scrub: 1
    })

    // NLP Anaphora pinning and layered reveal (same style as HealthNexus)
    ScrollTrigger.create({
      trigger: nlpRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      animation: gsap.timeline()
        // Description lines reveal
        .fromTo('.nlp-desc-line', 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' })
        // Tech chips animate in with stagger
        .fromTo('.nlp-tech-chip',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, "-=0.4")
        // Code editor slides in from left
        .fromTo('.nlp-editor', 
          { x: -100, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "<0.2")
        // SVG graph fades in
        .fromTo('.nlp-graph',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, "-=0.3"
        ),
      scrub: 1
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="w-full bg-[#080808] relative z-10" id="projects">
      
      {/* 1. HealthNexus (Pinned Feature) */}
      <div ref={healthNexusRef} className="min-h-screen lg:h-screen w-full flex items-center justify-center px-4 py-6 sm:p-6 lg:p-12 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex-1 space-y-4 lg:space-y-8 w-full">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#2563eb] border-b border-[#2563eb]/30 inline-block pb-1 sm:pb-2">Featured Project</h2>
            <h3 className="text-3xl sm:text-5xl md:text-7xl font-black font-display text-white tracking-tighter">HealthNexus</h3>
            
            <div className="hn-badge inline-flex relative items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-yellow-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
              <span>🥈</span> 1st Runner-Up · Gen-AI Hackathon Feb 2026
            </div>

            <div className="text-base sm:text-xl text-white/70 space-y-2 font-light">
              <div className="overflow-hidden"><div className="hn-desc-line">An intelligent healthcare ecosystem</div></div>
              <div className="overflow-hidden"><div className="hn-desc-line">powered by Google Gemini API.</div></div>
              <div className="overflow-hidden"><div className="hn-desc-line">Automates diagnostics, scheduling,</div></div>
              <div className="overflow-hidden"><div className="hn-desc-line">and patient record management.</div></div>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              {['React', 'Vite', 'Node.js', 'Express', 'Firebase', 'Gemini API'].map(tech => (
                <span key={tech} className="hn-tech-chip px-2.5 py-1 lg:px-3 lg:py-1 bg-white/5 border border-white/10 rounded-full text-[10px] lg:text-xs tracking-wider uppercase text-white/50">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 lg:pt-4 relative z-20">
              <a href="https://github.com/Sumit-Ratna/HealthNexus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-gray-200 transition-colors pointer-events-auto">
                <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" /> GitHub
              </a>
              <a href="https://myhealthnexus.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/40 text-blue-500 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-blue-600/20 transition-colors pointer-events-auto">
                <FaExternalLinkAlt className="w-4 h-4 sm:w-5 sm:h-5" /> Live Demo
              </a>
            </div>
          </div>

          {/* Right Video Mockup (Tile Hover + Autoplay Video) */}
          <div className="flex-1 flex justify-center perspective-1000 w-full mt-4 lg:mt-0">
            <TiltCard className="hn-device relative w-[160px] h-[320px] sm:w-[240px] sm:h-[480px] lg:w-[300px] lg:h-[600px] rounded-[1.75rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-[#1a1a1a] !rounded-[1.75rem] sm:!rounded-[3.25rem] bg-black shadow-2xl flex-shrink-0">
              {/* Dynamic Island Notch */}
              <div className="absolute top-1 lg:top-2 left-1/2 -translate-x-1/2 w-16 h-4 lg:w-24 lg:h-6 bg-black rounded-full z-20"></div>
              
              <iframe 
                src="https://www.youtube.com/embed/nUoUwYeXNPI?autoplay=1&mute=1&loop=1&playlist=nUoUwYeXNPI&controls=0&modestbranding=1&showinfo=0" 
                className="w-full h-full object-cover scale-[1.05]"
                allow="autoplay; encrypted-media" 
                frameBorder="0" 
                title="HealthNexus Demo"
              />
              <div className="absolute inset-0 z-10 pointer-events-none"></div> {/* Overlays video to let device tilt work unhindered */}
            </TiltCard>
          </div>

        </div>
      </div>

      {/* 2. NLP Anaphora Resolution (Pinned, same animation style as HealthNexus) */}
      <div ref={nlpRef} className="min-h-screen lg:h-screen w-full flex items-center justify-center px-4 py-8 sm:p-6 lg:p-12 border-t border-white/5 bg-[#0a0a0a]">
        <div className="container mx-auto flex flex-col lg:flex-row-reverse gap-6 lg:gap-12 items-center">
          
          {/* Right Content */}
          <div className="flex-1 space-y-4 lg:space-y-8 w-full">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#7c3aed] border-b border-[#7c3aed]/30 inline-block pb-1 sm:pb-2">Research / Tool</h2>
            <h3 className="text-3xl sm:text-5xl md:text-7xl font-black font-display text-white tracking-tighter">NLP Anaphora</h3>
            
            <div className="text-base sm:text-xl text-white/70 space-y-2 font-light">
              <div className="overflow-hidden"><div className="nlp-desc-line">Resolution tool for Hindi language</div></div>
              <div className="overflow-hidden"><div className="nlp-desc-line">utilizing Graph Algorithms.</div></div>
              <div className="overflow-hidden"><div className="nlp-desc-line">Implements Union-Find for precise</div></div>
              <div className="overflow-hidden"><div className="nlp-desc-line">entity connection tracking.</div></div>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              {['Python', 'NLP', 'Union-Find', 'Regex'].map(tech => (
                <span key={tech} className="nlp-tech-chip px-2.5 py-1 lg:px-3 lg:py-1 bg-white/5 border border-white/10 rounded-full text-[10px] lg:text-xs tracking-wider uppercase text-white/50">
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex gap-3 sm:gap-4 pt-2 lg:pt-4 relative z-20">
              <a href="https://github.com/Sumit-Ratna/Hindi-Coreference-Resolution" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-gray-200 transition-colors pointer-events-auto">
                <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" /> GitHub
              </a>
            </div>
          </div>

          {/* Left Code Editor (slides in from left) */}
          <div className="flex-1 perspective-1000 w-full mt-4 lg:mt-0">
            <TiltCard className="nlp-editor w-full lg:aspect-[4/3] min-h-[260px] bg-[#0d0d0d] shadow-purple-900/20">
              {/* Mac Header */}
              <div className="h-6 sm:h-8 bg-[#1a1a1a] flex items-center px-3 sm:px-4 gap-1.5 sm:gap-2 border-b border-white/5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80"></div>
                <span className="text-white/20 text-[10px] sm:text-xs ml-1 sm:ml-2 font-mono">anaphora.py</span>
              </div>
              
              {/* Code visual */}
              <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-white/80 h-[calc(100%-2rem)] flex flex-col overflow-hidden">
                <div className="flex-shrink-0 space-y-1">
                  <div><span className="text-purple-400">def</span> <span className="text-blue-400">resolve_anaphora</span>(text):</div>
                  <div className="pl-4 text-gray-500 mt-1"># 1. Parse Entities via Graph Nodes</div>
                  <div className="pl-4 mt-0.5 truncate"><span className="text-yellow-300">nodes</span> = graph.build(<span className="text-green-400">"राम ने कहा..."</span>)</div>
                  <div className="pl-4 text-gray-500 mt-2"># 2. Apply Union-Find algorithm</div>
                  <div className="pl-4 mt-0.5"><span className="text-yellow-300">components</span> = union_find(nodes)</div>
                </div>

                {/* Animated SVG Graph Connections */}
                <div className="nlp-graph flex-1 min-h-0 mt-4 bg-white/5 rounded-lg border border-white/10 p-3 sm:p-4">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#7c3aed" />
                      </marker>
                      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    
                    {/* Node 1 */}
                    <g className="node">
                      <circle cx="50" cy="50" r="20" fill="#1a1a1a" stroke="#7c3aed" strokeWidth="2" />
                      <text x="50" y="55" fill="white" fontSize="14" textAnchor="middle">राम</text>
                    </g>

                    {/* Node 2 */}
                    <g className="node">
                      <circle cx="250" cy="50" r="20" fill="#1a1a1a" stroke="#2563eb" strokeWidth="2" className="animate-pulse" />
                      <text x="250" y="55" fill="white" fontSize="14" textAnchor="middle">उसने</text>
                    </g>
                    
                    {/* Connection Curve */}
                    <path 
                      d="M 70 50 Q 150 10 230 50" 
                      fill="none" 
                      stroke="url(#glow)" 
                      strokeWidth="2" 
                      strokeDasharray="5,5" 
                      markerEnd="url(#arrow)" 
                      className="animate-[dash_3s_linear_infinite]" 
                    />
                    
                    <text x="150" y="25" fill="#a855f7" fontSize="12" textAnchor="middle" className="tracking-widest">
                      Union(राम, उसने)
                    </text>
                  </svg>
                  <style>
                    {`@keyframes dash { to { stroke-dashoffset: -20; } }`}
                  </style>
                </div>
              </div>
            </TiltCard>
          </div>

        </div>
      </div>

    </section>
  )
}
