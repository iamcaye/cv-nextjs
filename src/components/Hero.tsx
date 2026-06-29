'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

const stack = ['TypeScript', 'Node.js', 'PostgreSQL', 'Angular', 'Next.js']

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-56px)] flex flex-col justify-center px-6 md:px-12 max-w-5xl mx-auto py-20 relative"
    >
      <motion.span
        {...fadeUp(0)}
        className="text-[#f97316] text-[10px] font-semibold tracking-[0.25em] uppercase mb-5 block"
      >
        Software Engineer
      </motion.span>

      <motion.h1
        {...fadeUp(0.1)}
        className="text-5xl md:text-[68px] font-extrabold tracking-[-1.5px] text-[#111] dark:text-[#fafafa] leading-[1.05] mb-5"
      >
        Hi, I&apos;m<br />Cayetano.
      </motion.h1>

      <motion.p
        {...fadeUp(0.2)}
        className="text-lg md:text-xl text-[#555] dark:text-[#a3a3a3] mb-7 max-w-xl leading-relaxed"
      >
        Backend-focused Software Engineer building
        <br className="hidden md:block" /> web products from idea to production.
      </motion.p>

      <motion.div {...fadeUp(0.3)} className="flex items-center flex-wrap mb-8">
        {stack.map((tech, i) => (
          <Fragment key={tech}>
            <span className="font-mono text-xs text-[#737373]">{tech}</span>
            {i < stack.length - 1 && (
              <span className="mx-2 font-mono text-xs text-[#ccc] dark:text-[#2a2a2a]">·</span>
            )}
          </Fragment>
        ))}
      </motion.div>

      <motion.p
        {...fadeUp(0.4)}
        className="text-sm leading-[1.8] text-[#737373] border-l-2 border-[#f97316] pl-5 mb-10 max-w-lg"
      >
        Software Engineer based in Málaga with more than 4 years of experience building and
        maintaining production applications. I work across the full stack, with a strong focus on
        backend architecture, APIs, databases and infrastructure.
      </motion.p>

      <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3">
        <a
          href="#projects"
          className="bg-[#f97316] text-[#111] font-semibold text-sm px-6 py-3 rounded hover:bg-[#ea6c0a] transition-colors"
        >
          View my work →
        </a>
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#d4d0c8] dark:border-[#2a2a2a] text-[#111] dark:text-[#fafafa] font-medium text-sm px-6 py-3 rounded hover:border-[#999] dark:hover:border-[#555] transition-colors"
        >
          Download CV ↓
        </a>
        <a
          href="#contact"
          className="text-[#737373] font-normal text-sm px-6 py-3 hover:text-[#111] dark:hover:text-[#fafafa] transition-colors"
        >
          Contact me
        </a>
      </motion.div>

      <div className="absolute bottom-8 left-6 md:left-12 flex items-center gap-3 text-[#ccc] dark:text-[#333] text-[10px] tracking-[0.15em] uppercase select-none">
        <div className="w-10 h-px bg-[#ccc] dark:bg-[#333]" />
        Scroll
      </div>
    </section>
  )
}
