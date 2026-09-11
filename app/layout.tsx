import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Pirata_One, Spectral } from 'next/font/google'
import './globals.css'

const display = Pirata_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const body = Spectral({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Black Compass — Pirate Crew Command',
  description:
    'A swashbuckler HR platform: manage your crew roster, assign tactical roles, audit skills, monitor scurvy and morale, and recommend optimal boarding parties.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#132029',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased font-[family-name:var(--font-body)]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
