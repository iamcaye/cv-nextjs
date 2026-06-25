'use client'

import { useState } from 'react'
import MotionSection from './MotionSection'

const contactLinks = [
  {
    label: 'Email',
    display: 'cayetano.biehler@gmail.com',
    href: 'mailto:cayetano.biehler@gmail.com',
    external: false,
  },
  {
    label: 'LinkedIn',
    display: '/in/cayetanobiehler',
    href: 'https://www.linkedin.com/in/cayetanobiehler/',
    external: true,
  },
  {
    label: 'GitHub',
    display: 'github.com/iamcaye',
    href: 'https://github.com/iamcaye',
    external: true,
  },
]

export default function Contact() {
  const [copied, setCopied] = useState(false)

  function copyEmail(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText('cayetano.biehler@gmail.com').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#999] dark:text-[#444] mb-10">
          05 · Contact
        </p>
      </MotionSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <MotionSection delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111] dark:text-[#fafafa] leading-[1.1] mb-4">
            Let&apos;s build<br />something{' '}
            <span className="text-[#f97316]">useful.</span>
          </h2>
          <p className="text-sm text-[#737373] leading-relaxed mb-8 max-w-sm">
            Open to interesting projects, collaborations or just a good conversation about software.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:cayetano.biehler@gmail.com"
              className="bg-[#f97316] text-[#111] font-semibold text-sm px-6 py-3 rounded hover:bg-[#ea6c0a] transition-colors"
            >
              Send me an email
            </a>
            <a
              href="/cv.pdf"
              className="border border-[#d4d0c8] dark:border-[#2a2a2a] text-[#111] dark:text-[#fafafa] font-medium text-sm px-6 py-3 rounded hover:border-[#999] dark:hover:border-[#555] transition-colors"
            >
              Download CV ↓
            </a>
          </div>
        </MotionSection>

        <MotionSection delay={0.2}>
          <div className="flex flex-col gap-3">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between gap-4 px-5 py-4 bg-white dark:bg-[#161616] border border-[#e8e6e0] dark:border-[#222] rounded-lg hover:border-[#f97316] dark:hover:border-[#f97316] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[#111] dark:text-[#fafafa]">
                    {link.label}
                  </p>
                  <p className="text-xs text-[#999] dark:text-[#555] mt-0.5">{link.display}</p>
                </div>
                {link.label === 'Email' && (
                  <button
                    onClick={copyEmail}
                    title={copied ? 'Copied!' : 'Copy email'}
                    className="flex-shrink-0 p-1.5 rounded text-[#999] hover:text-[#f97316] hover:bg-[#f97316]/10 transition-colors"
                  >
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                )}
              </a>
            ))}
          </div>
        </MotionSection>
      </div>
    </section>
  )
}
