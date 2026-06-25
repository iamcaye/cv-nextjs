'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

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
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="text-[#737373] hover:text-[#111] dark:hover:text-[#fafafa] transition-colors text-base leading-none"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? '○' : '●'}
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
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="text-[#737373] text-base"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? '○' : '●'}
            </button>
          )}
          <button
            className="text-[#737373] dark:text-[#737373] text-lg leading-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e8e6e0] dark:border-[#222] bg-[#fafaf8] dark:bg-[#111111] px-6 py-5 flex flex-col gap-4">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#737373] hover:text-[#111] dark:hover:text-[#fafafa] transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="/cv.pdf"
            className="bg-[#f97316] text-[#111] font-semibold text-sm px-4 py-2.5 rounded text-center mt-1"
          >
            Download CV ↓
          </a>
        </div>
      )}
    </nav>
  )
}
