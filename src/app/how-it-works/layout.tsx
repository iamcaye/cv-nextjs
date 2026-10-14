import { Newsreader } from 'next/font/google'
import 'katex/dist/katex.min.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  // Next 13.4 ships no fallback metrics for Newsreader.
  adjustFontFallback: false,
})

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${serif.variable} min-h-screen bg-[#fafaf8] dark:bg-[#111111]`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
