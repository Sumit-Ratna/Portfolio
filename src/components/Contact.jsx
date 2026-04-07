import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { FiMail, FiDownload } from 'react-icons/fi'

export default function Contact() {
  const containerRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo('.contact-title span',
      { y: 100, opacity: 0 },
      { 
        y: 0, opacity: 1, 
        stagger: 0.1, 
        duration: 1, 
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          once: true
        }
      }
    )

    gsap.fromTo('.contact-icon',
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: '.contact-icons-wrap',
          start: 'top 80%',
          once: true
        }
      }
    )
  }, { scope: containerRef })

  const splitTitle = "Let's Build Something.".split(" ")

  return (
    <section ref={containerRef} className="w-full min-h-[60vh] sm:min-h-[70vh] bg-[#080808] flex flex-col items-center justify-center p-4 sm:p-6 border-t border-white/5 relative overflow-hidden" id="contact">
      
      {/* Huge Background Text for texture */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] sm:text-[15vw] font-black text-white/5 whitespace-nowrap pointer-events-none uppercase">
        Contact Get In Touch
      </div>

      <div className="relative z-10 text-center">
        <h2 className="contact-title font-display font-black text-3xl sm:text-5xl md:text-8xl tracking-tighter text-white mb-8 sm:mb-12 overflow-hidden flex flex-wrap justify-center gap-2 sm:gap-4">
          {splitTitle.map((word, i) => (
            <span key={i} className="inline-block">{word}</span>
          ))}
        </h2>

        <div className="contact-icons-wrap flex items-center justify-center gap-4 sm:gap-6 md:gap-10 pointer-events-auto flex-wrap">
          
          <a href="mailto:sumitkumarratna@gmail.com" data-email-hover="true" className="contact-icon text-white/50 hover:text-white hover:-translate-y-2 transition-all p-3 sm:p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20">
            <FiMail size={24} className="sm:w-8 sm:h-8" />
          </a>
          <a href="https://github.com/Sumit-Ratna" target="_blank" rel="noreferrer" className="contact-icon text-white/50 hover:text-white hover:-translate-y-2 transition-all p-3 sm:p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20">
            <FaGithub size={24} className="sm:w-8 sm:h-8" />
          </a>
          <a href="https://linkedin.com/in/sumit-kumar-ratna" target="_blank" rel="noreferrer" className="contact-icon text-white/50 hover:text-[#0a66c2] hover:-translate-y-2 transition-all p-3 sm:p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#0a66c2]/50">
            <FaLinkedin size={24} className="sm:w-8 sm:h-8" />
          </a>
          <a href="https://leetcode.com/u/Sumit_27_" target="_blank" rel="noreferrer" className="contact-icon text-white/50 hover:text-[#ffa116] hover:-translate-y-2 transition-all p-3 sm:p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#ffa116]/50">
            <SiLeetcode size={24} className="sm:w-8 sm:h-8" />
          </a>

        </div>

        {/* Resume Download Button */}
        <div className="mt-10 sm:mt-14">
          <a 
            href="https://drive.google.com/file/d/1hZU97NFsiszHPk8mJb19kEME6eUk-6aF/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-white bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 px-8 py-4 rounded-full hover:from-purple-600/40 hover:to-blue-600/40 hover:border-purple-500/50 transition-all duration-300 pointer-events-auto group"
          >
            <FiDownload size={18} className="group-hover:animate-bounce" />
            Download Resume
          </a>
        </div>
        
        <p className="mt-16 sm:mt-24 text-white/30 text-xs sm:text-sm font-medium tracking-widest uppercase">
          © {new Date().getFullYear()} Sumit Kumar Ratna. 
        </p>
      </div>

    </section>
  )
}
