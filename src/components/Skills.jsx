import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const skillsData = [
  { group: 'Languages', color: '#7c3aed', labels: ['C++', 'Java', 'Python'] }, // Purple
  { group: 'Web', color: '#06b6d4', labels: ['HTML', 'CSS', 'JS', 'Node.js'] }, // Cyan
  { group: 'Tools', color: '#0d9488', labels: ['Git', 'Docker', 'MySQL'] }, // Teal
  { group: 'AI/ML', color: '#d97706', labels: ['NLP', 'Coreference', 'Gemini API'] }, // Amber
]

function Orb({ position, color, label, delayIndex }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  
  // Random phase for sine wave oscillation per orb
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  // Animation on scroll
  useEffect(() => {
    if (!groupRef.current || !meshRef.current) return

    // Emerge from center point to cluster position with spring physics
    gsap.fromTo(groupRef.current.position, 
      { x: 0, y: 0, z: 0 },
      {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 2,
        ease: "elastic.out(1, 0.6)",
        delay: delayIndex * 0.05,
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 70%',
        }
      }
    )
    
    // Scale up from 0
    gsap.fromTo(meshRef.current.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 1, y: 1, z: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
        delay: delayIndex * 0.05,
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 70%',
        }
      }
    )
  }, [position, delayIndex])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    
    // Gentle floating oscillation
    meshRef.current.position.y = Math.sin(t * 2 + phase) * 0.15
    meshRef.current.position.x = Math.cos(t * 1.5 + phase) * 0.05
    
    // Scale linearly on hover (1.3x)
    const targetScale = hovered ? 1.3 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh 
        ref={meshRef} 
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.15}
          roughness={0.2}
          metalness={0.6}
        />
        
        {/* HTML UI Label */}
        <Html 
          position={[0, -0.5, 0]} 
          center 
          style={{ 
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
            opacity: hovered ? 1 : 0, 
            transform: `scale(${hovered ? 1 : 0.5})`, 
            pointerEvents: 'none',
            zIndex: hovered ? 10 : 0
          }}
        >
          <div 
            className="bg-[#050505]/95 text-white px-4 py-1.5 rounded-full text-xs font-mono border whitespace-nowrap backdrop-blur-sm" 
            style={{ 
              borderColor: `${color}80`, 
              boxShadow: `0 4px 20px ${color}40`,
              textShadow: `0 0 10px ${color}80` 
            }}
          >
            {label}
          </div>
        </Html>
      </mesh>
    </group>
  )
}

function OrbCluster() {
  const groupRef = useRef()

  // Generate clustered positions avoiding overlap
  const orbs = useMemo(() => {
    const arr = []
    let angleRef = 0
    let globalDelay = 0

    skillsData.forEach((group) => {
      // Cluster focal point
      const radius = 5
      const cx = Math.cos(angleRef) * radius
      const cy = (Math.random() - 0.5) * 1.5
      const cz = Math.sin(angleRef) * radius

      group.labels.forEach((label) => {
        // Individual orb scatter within the cluster zone
        const lx = (Math.random() - 0.5) * 2
        const ly = (Math.random() - 0.5) * 2
        const lz = (Math.random() - 0.5) * 2
        arr.push({
          pos: [cx + lx, cy + ly, cz + lz],
          color: group.color,
          label: label,
          delayIndex: globalDelay++
        })
      })
      angleRef += (Math.PI * 2) / skillsData.length
    })
    return arr
  }, [])

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return
    // Very slow continuous ambient rotation and slight mouse tracking
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.05 + pointer.x * 0.1
    groupRef.current.rotation.x = pointer.y * 0.1
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, -10, 5]} intensity={0.8} color="#7c3aed" />
      <directionalLight position={[5, 10, -5]} intensity={0.5} color="#2563eb" />
      
      {orbs.map((orb, i) => (
        <Orb key={i} position={orb.pos} color={orb.color} label={orb.label} delayIndex={orb.delayIndex} />
      ))}
    </group>
  )
}

export default function Skills() {
  const [isMobile, setIsMobile] = useState(false)
  const mobileContainerRef = useRef(null)
  
  // Track window resizing to seamlessly switch between 3D Canvas and HTML layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile() // initial check
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useGSAP(() => {
    // Only animate the mobile layout when active
    if (isMobile && mobileContainerRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileContainerRef.current,
          start: 'top 85%',
        }
      })
      
      // Slide in skill categories
      tl.fromTo('.mobile-skill-group',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out' }
      )
      
      // Pop in individual tech chips sequentially
      tl.fromTo('.mobile-skill-chip',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4, ease: 'back.out(1.5)' },
        "-=0.4"
      )
    }
  }, { scope: mobileContainerRef, dependencies: [isMobile] })

  return (
    // Slightly desaturated dark background to let emissive elements pop
    <section className={`relative w-full ${isMobile ? 'min-h-screen py-16' : 'h-[80vh] sm:h-[100vh] lg:h-[120vh]'} bg-[#050505] border-t border-white/5 overflow-hidden`} id="skills">
      
      <div className={`absolute left-0 w-full text-center z-10 pointer-events-none ${isMobile ? 'top-10 relative mb-12' : 'top-24 mt-0'}`}>
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#d97706] mb-4">Arsenal & Technologies</h2>
        <h3 className="text-4xl sm:text-5xl md:text-7xl font-black font-display text-white/5 uppercase tracking-tighter">
          {isMobile ? 'Tech Stack' : 'Skill Orbs'}
        </h3>
        <p className="text-white/30 uppercase tracking-widest text-xs mt-4">
          {isMobile ? 'Core Competencies' : 'Interact to inspect elements'}
        </p>
      </div>

      {!isMobile ? (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Canvas camera={{ position: [0, 0, 14], fov: 60 }}>
            <OrbCluster />
          </Canvas>
        </div>
      ) : (
        <div ref={mobileContainerRef} className="relative z-10 px-6 sm:px-12 flex flex-col gap-10 w-full max-w-md mx-auto pointer-events-auto mt-4">
          {skillsData.map((group, idx) => (
            <div key={idx} className="mobile-skill-group flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-[0.2em] uppercase border-b border-white/10 pb-2" style={{ color: group.color, textShadow: `0 0 10px ${group.color}40` }}>
                {group.group}
              </h4>
              <div className="flex flex-wrap gap-3">
                {group.labels.map((label, lblIdx) => (
                  <div 
                    key={lblIdx} 
                    className="mobile-skill-chip px-5 py-2.5 rounded-full text-xs font-bold text-white bg-white/5 backdrop-blur-md" 
                    style={{ 
                      boxShadow: `0 4px 15px ${group.color}15`, 
                      border: `1px solid ${group.color}30` 
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  )
}
