import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const ringTextRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const isDown = useRef(false)

  useEffect(() => {
    // Bail out for touch devices or reduced motion
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouchDevice || prefersReducedMotion) {
      document.documentElement.style.cursor = 'auto'
      return
    }

    const dot = dotRef.current
    const ring = ringRef.current
    const ringText = ringTextRef.current
    if (!dot || !ring) return

    // GSAP quickTo for buttery-smooth ring following
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    // ---- Mouse Move ----
    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY

      // Dot follows exactly (no lag)
      gsap.set(dot, { x: e.clientX, y: e.clientY })

      // Ring follows with smooth lerp via quickTo
      ringX(e.clientX)
      ringY(e.clientY)
    }

    // ---- Hover Detection ----
    const onMouseOver = (e) => {
      const target = e.target

      // CTA buttons (data-cursor="cta")
      if (target.closest('[data-cursor="cta"]')) {
        applyState('cta')
        applyMagnetic(target.closest('[data-cursor="cta"]'))
        return
      }

      // Video hover (data-video-hover or data-cursor="video")
      if (target.closest('[data-video-hover]') || target.closest('[data-cursor="video"]')) {
        applyState('video')
        return
      }

      // Links and buttons
      if (target.closest('a') || target.closest('button')) {
        applyState('link')
        applyMagnetic(target.closest('a') || target.closest('button'))
        return
      }

      // Default
      applyState('default')
    }

    // ---- State Application ----
    function applyState(state) {
      // Reset all
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(ring, {
        width: 36, height: 36,
        borderRadius: '50%',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,1)',
        duration: 0.4,
        ease: 'power2.out'
      })
      if (ringText) ringText.textContent = ''

      switch (state) {
        case 'link':
          // Ring expands to 56px, dot disappears
          gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25 })
          gsap.to(ring, {
            width: 56, height: 56,
            backgroundColor: 'rgba(255,255,255,0.06)',
            duration: 0.4,
            ease: 'back.out(1.5)'
          })
          break

        case 'video':
          // Ring becomes play icon, scale 1.5x
          gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25 })
          gsap.to(ring, {
            width: 80, height: 80,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: 'rgba(255,255,255,0)',
            duration: 0.4,
            ease: 'back.out(1.5)'
          })
          if (ringText) {
            ringText.textContent = '▶'
            ringText.style.color = '#080808'
            ringText.style.fontSize = '20px'
            ringText.style.fontWeight = 'bold'
          }
          break

        case 'cta':
          // Ring morphs to pill shape with text
          gsap.to(dot, { scale: 0, opacity: 0, duration: 0.25 })
          gsap.to(ring, {
            width: 120, height: 44,
            borderRadius: '22px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: 'rgba(255,255,255,0)',
            duration: 0.4,
            ease: 'back.out(1.5)'
          })
          if (ringText) {
            ringText.textContent = "Let's go →"
            ringText.style.color = '#080808'
            ringText.style.fontSize = '13px'
            ringText.style.fontWeight = '700'
          }
          break

        default:
          break
      }
    }

    // ---- Magnetic Effect ----
    function applyMagnetic(el) {
      if (!el) return

      const handleMagMove = (e) => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        // Move element toward cursor by 20% of offset
        gsap.to(el, { x: dx * 0.2, y: dy * 0.2, duration: 0.3, ease: 'power2.out' })
      }

      const handleMagLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
        applyState('default')
        el.removeEventListener('mousemove', handleMagMove)
        el.removeEventListener('mouseleave', handleMagLeave)
      }

      el.addEventListener('mousemove', handleMagMove)
      el.addEventListener('mouseleave', handleMagLeave)
    }

    // ---- Click States ----
    const onMouseDown = () => {
      isDown.current = true
      gsap.to(dot, { scale: 0.6, duration: 0.15, ease: 'power2.in' })
      gsap.to(ring, { scale: 0.8, duration: 0.15, ease: 'power2.in' })
    }

    const onMouseUp = () => {
      isDown.current = false
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' })
      gsap.to(ring, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' })
    }

    // ---- Hide on leave window ----
    const onMouseLeave = () => {
      gsap.to(dot, { opacity: 0, duration: 0.3 })
      gsap.to(ring, { opacity: 0, duration: 0.3 })
    }
    const onMouseEnter = () => {
      gsap.to(dot, { opacity: 1, duration: 0.3 })
      gsap.to(ring, { opacity: 1, duration: 0.3 })
    }

    // ---- Bind Events ----
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  // Render via portal to ensure it's always on top
  return createPortal(
    <>
      {/* Dot: follows exactly, no lag */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          backgroundColor: 'white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          willChange: 'transform',
          transform: 'translate(-50%, -50%)',
          marginLeft: '-5px',
          marginTop: '-5px',
        }}
      />
      {/* Ring: follows with GSAP quickTo lerp */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          border: '1.5px solid white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          mixBlendMode: 'difference',
          willChange: 'transform, width, height, border-radius, background-color',
          transform: 'translate(-50%, -50%)',
          marginLeft: '-18px',
          marginTop: '-18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 0.4s cubic-bezier(0.23,1,0.32,1), height 0.4s cubic-bezier(0.23,1,0.32,1), border-radius 0.4s cubic-bezier(0.23,1,0.32,1), background-color 0.35s ease',
        }}
      >
        <span
          ref={ringTextRef}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
            transition: 'all 0.3s ease',
          }}
        />
      </div>
    </>,
    document.body
  )
}
