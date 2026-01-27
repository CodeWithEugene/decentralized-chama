import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dchama.vercel.app/'),
  title: 'Decentralised Chama',
  description: 'DChama is a decentralized financial platform that digitizes traditional Kenyan informal savings groups (Chamas) by using blockchain smart contracts to automate contributions, secure rotating payouts, and provide immutable, transparent record-keeping for all members.',
  generator: 'v0.app',
  openGraph: {
    title: 'Decentralised Chama',
    description: 'DChama is a decentralized financial platform that digitizes traditional Kenyan informal savings groups (Chamas) by using blockchain smart contracts to automate contributions, secure rotating payouts, and provide immutable, transparent record-keeping for all members.',
    url: 'https://dchama.vercel.app/',
    siteName: 'Decentralised Chama',
    images: [
      {
        url: '/icon.png', // Must be an absolute URL in production usually, but relative works for some scrapers if generic metadata base is set. Vercel usually handles relative in OG if metadataBase is set, but we'll stick to simple relative for now as requested.
        width: 512, // Assuming standard icon size, beneficial to specify if known
        height: 512,
        alt: 'Decentralised Chama Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
  },
}

import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
