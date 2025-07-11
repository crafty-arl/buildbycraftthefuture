import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SessionProvider from './components/auth/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from './lib/auth'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: '/build - Learn by Doing',
  description: 'What do you want to build today? Interactive coding modules where you run it, break it, and learn why. No setup, no fluff - just pure building.',
  keywords: ['learn coding', 'interactive programming', 'build projects', 'Python', 'JavaScript', 'learn by doing'],
  authors: [{ name: 'Carl', url: 'https://craftthefuture.xyz' }],
  creator: 'Carl - Craft The Future',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    title: '/build - Learn by Doing',
    description: 'What do you want to build today? Interactive coding that runs in your browser.',
    url: 'https://build.dev',
    siteName: '/build',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '/build - Learn by Doing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '/build - Learn by Doing',
    description: 'What do you want to build today? Interactive coding that runs in your browser.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="/build" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable} antialiased bg-build-bg text-build-text min-h-screen`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 