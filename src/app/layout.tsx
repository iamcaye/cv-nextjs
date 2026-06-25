import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cayetano Biehler — Backend-focused Software Engineer',
  description:
    'Software Engineer based in Málaga. Backend, APIs, databases, full-stack. 4+ years building production applications.',
  icons: {
    icon: '/caye-pc.png',
  },
  openGraph: {
    title: 'Cayetano Biehler — Backend-focused Software Engineer',
    description:
      'Software Engineer based in Málaga. Backend, APIs, databases, full-stack.',
    url: 'https://iamcaye.com',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Script
          src="https://umami.iamcaye.com/script.js"
          data-website-id="05fc82e0-3b27-4b80-a434-84abbd183131"
        />
      </body>
    </html>
  )
}
