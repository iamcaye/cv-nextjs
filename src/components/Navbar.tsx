'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const expandTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerExpand = () => {
    setExpanded(true)
    if (expandTimer.current) clearTimeout(expandTimer.current)
    expandTimer.current = setTimeout(() => setExpanded(false), 2000)
  }

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    triggerExpand()
    return () => { if (expandTimer.current) clearTimeout(expandTimer.current) }
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-[#fafaf8]/80 dark:bg-[#111111]/80 backdrop-blur-md border-b border-[#e8e6e0] dark:border-[#222]">
      <div className="max-w-5xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <Link
          href="#hero"
          className="font-bold text-sm tracking-wide text-[#111] dark:text-[#fafafa]"
        >
          caye.
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[#737373] hover:text-[#111] dark:hover:text-[#fafafa] transition-colors"
            >
              {label}
            </a>
          ))}
          {mounted && (
            <button
              onClick={() => { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); triggerExpand() }}
              className={`flex items-center gap-1 leading-none transition-all duration-300 rounded-full text-[#737373] hover:text-[#111] dark:hover:text-[#fafafa] ${
                expanded
                  ? 'border border-[#d0cec8] dark:border-[#333] px-2.5 py-1 text-sm'
                  : 'text-base'
              }`}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? '○' : '●'}
              <span
                className="overflow-hidden whitespace-nowrap text-xs transition-all duration-300"
                style={{ maxWidth: expanded ? '3rem' : '0', opacity: expanded ? 1 : 0 }}
              >
                {resolvedTheme}
              </span>
            </button>
          )}
          <a
            href="/cv.pdf"
            className="bg-[#f97316] text-[#111] font-semibold text-sm px-4 py-1.5 rounded hover:bg-[#ea6c0a] transition-colors"
          >
            Download CV ↓
          </a>
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          {mounted && (
            <button
              onClick={() => { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); triggerExpand() }}
              className={`flex items-center gap-1 leading-none transition-all duration-300 rounded-full text-[#737373] ${
                expanded
                  ? 'border border-[#d0cec8] dark:border-[#333] px-2.5 py-1 text-sm'
                  : 'text-base'
              }`}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? '○' : '●'}
              <span
                className="overflow-hidden whitespace-nowrap text-xs transition-all duration-300"
                style={{ maxWidth: expanded ? '3rem' : '0', opacity: expanded ? 1 : 0 }}
              >
                {resolvedTheme}
              </span>
            </button>
          )}
          <button
            className="text-[#737373] dark:text-[#737373] text-lg leading-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="border-t border-[#e8e6e0] dark:border-[#222] bg-[#fafaf8] dark:bg-[#111111] px-6 py-5 flex flex-col gap-4">
          {navLinks.map(({ label, href }, i) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#737373] hover:text-[#111] dark:hover:text-[#fafafa] transition-all duration-200"
              style={{
                transitionDelay: menuOpen ? `${i * 40}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(-6px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="/cv.pdf"
            className="bg-[#f97316] text-[#111] font-semibold text-sm px-4 py-2.5 rounded text-center mt-1 transition-all duration-200"
            style={{
              transitionDelay: menuOpen ? `${navLinks.length * 40}ms` : '0ms',
              transform: menuOpen ? 'translateY(0)' : 'translateY(-6px)',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            Download CV ↓
          </a>
        </div>
      </div>
    </nav>
  )
}
