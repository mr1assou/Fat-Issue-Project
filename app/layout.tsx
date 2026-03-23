import React from "react"
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ReduxProvider } from '@/lib/redux/provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitlyAi - Less Stubborn Fat, Better Life',
  description: 'Discover personalized fat-loss solutions and join a community dedicated to improving confidence and overall wellness.',
  generator: 'v0.app',
  keywords: ['sleep', 'wellness', 'health', 'sleep improvement', 'rest', 'relaxation'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
