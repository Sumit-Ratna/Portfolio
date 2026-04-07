import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function ParticleNebula() {
  const pointsRef = useRef()
  const { mouse, camera } = useThree()

  // Generate 8000 particles
  const particleCount = 8000
  const [positions, colors, basePositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const basePos = new Float32Array(particleCount * 3)
    const cols = new Float32Array(particleCount * 3)

    const color1 = new THREE.Color("#7c3aed") // deep purple
    const color2 = new THREE.Color("#2563eb") // electric blue

    for (let i = 0; i < particleCount; i++) {
      // Galaxy / nebula logarithmic spiral shape
      const radius = Math.random() * 20
      const spinAngle = radius * 0.5 // spiral twisting
      const branchAngle = ((i % 3) / 3) * Math.PI * 2 // 3 arms
      
      // Randomness spread that decreases along the radius or stays constant
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3

      const x = Math.cos(branchAngle + spinAngle) * radius + randomX
      const y = randomY
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      basePos[i * 3] = x
      basePos[i * 3 + 1] = y
      basePos[i * 3 + 2] = z

      // Gradient based on distance from center to give varying colors
      const mixedColor = color1.clone().lerp(color2, radius / 20)
      cols[i * 3] = mixedColor.r
      cols[i * 3 + 1] = mixedColor.g
      cols[i * 3 + 2] = mixedColor.b
    }

    return [pos, cols, basePos]
  }, [])

  // Raycaster for spring-repel
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const raycaster = useRef(new THREE.Raycaster())

  useFrame(() => {
    if (!pointsRef.current) return

    // Spring-repel proximity logic 
    raycaster.current.setFromCamera(mouse, camera)
    const intersectPoint = new THREE.Vector3()
    raycaster.current.ray.intersectPlane(planeRef.current, intersectPoint)

    const positionsArray = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3
      const basex = basePositions[idx]
      const basey = basePositions[idx + 1]
      const basez = basePositions[idx + 2]

      const px = positionsArray[idx]
      const py = positionsArray[idx + 1]
      const pz = positionsArray[idx + 2]

      // Distance to mouse intersection
      const dx = px - intersectPoint.x
      const dy = py - intersectPoint.y
      
      const distSq = dx * dx + dy * dy
      const repelDist = 5.0 
      
      if (distSq < repelDist * repelDist) {
        const force = (repelDist - Math.sqrt(distSq)) / repelDist
        // Push particles away
        positionsArray[idx] += dx * force * 0.03
        positionsArray[idx + 1] += dy * force * 0.03
      }

      // Spring back to base position
      positionsArray[idx] += (basex - positionsArray[idx]) * 0.02
      positionsArray[idx + 1] += (basey - positionsArray[idx + 1]) * 0.02
      positionsArray[idx + 2] += (basez - positionsArray[idx + 2]) * 0.02
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Constant slow rotation of the galaxy
    pointsRef.current.rotation.y += 0.001
    pointsRef.current.rotation.z -= 0.0005
    
    // On scroll: camera slowly pulls back
    const scrollDelta = window.scrollY
    camera.position.z = 10 + scrollDelta * 0.002
  })

  return (
    <points ref={pointsRef} rotation={[0.4, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function Typewriter({ text }) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    let currentText = ""
    let i = 0
    const delay = 1000 // initial delay
    
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (i < text.length) {
          currentText += text.charAt(i)
          setDisplayText(currentText)
          i++
        } else {
          clearInterval(intervalId)
        }
      }, 50) // typing speed
      
      return () => clearInterval(intervalId)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [text])

  return (
    <span>{displayText}<span className="animate-pulse">|</span></span>
  )
}

export default function Hero() {
  const titleText = "Sumit Kumar Ratna".split("")
  const ctaRef = useRef(null)

  useGSAP(() => {
    // Stagger character animate-in: y: 80px → 0, opacity 0 → 1, ease: expo.out, stagger: 0.04s
    gsap.fromTo('.hero-char', 
      { y: 80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.04, ease: 'expo.out', delay: 0.2 }
    )
  })

  // Magnetic CTA hover logic (follows cursor by 20% offset)
  const handleMouseMove = (e) => {
    if (!ctaRef.current) return
    const rect = ctaRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(ctaRef.current, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' })
  }

  const handleMouseLeave = () => {
    if (!ctaRef.current) return
    gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
  }

  return (
    <section className="relative w-full h-[100vh] overflow-hidden" id="hero">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ParticleNebula />
        </Canvas>
      </div>

      {/* HTML Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-8xl text-white tracking-tighter overflow-hidden flex flex-wrap justify-center mb-4 sm:mb-6 px-4 text-center">
          {titleText.map((char, i) => (
            <span key={i} className={`hero-char inline-block ${char === " " ? "w-[2vw]" : ""}`}>
              {char}
            </span>
          ))}
        </h1>

        <div className="font-body text-xs sm:text-sm md:text-xl text-white/70 tracking-wide bg-black/50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/10 backdrop-blur-md shadow-2xl mt-4">
          <Typewriter text="B.Tech CSE (AIML) · Full Stack Developer · AI/NLP Researcher" />
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 sm:mt-16 pointer-events-auto p-4 inline-flex flex-col sm:flex-row gap-4 items-center">
          <a 
            ref={ctaRef}
            href="#projects" 
            data-cursor="cta"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-white bg-white/5 border border-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            See My Work 
            <span className="inline-block animate-bounce ml-1">↓</span>
          </a>
          <a 
            href="https://drive.google.com/file/d/1hZU97NFsiszHPk8mJb19kEME6eUk-6aF/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-white/70 border border-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            📄 Resume
          </a>
        </div>
      </div>
      
      {/* Scroll indicator chevron below canvas (technically inside section at bottom) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 to-white/50 mb-2"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce text-white">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>

    </section>
  )
}
