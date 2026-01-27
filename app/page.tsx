'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PrivacyPopup, TermsPopup, ContactPopup } from '@/components/pages/legal-popups'
import { ArrowRight, Users, TrendingUp, Lock, Zap, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fail-safe: If Supabase redirects here with a code, forward to callback
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      window.location.href = `/auth/callback?code=${code}`
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Chama Logo" className="h-16 w-auto" />
          </div>
          <div className="flex gap-4 items-center">
             {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            )}
            <Link href="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col justify-center">
        {/* Hero Section */}
      <section className="pt-40 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-6">
              Chama Savings made Simpler and More Secure
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Join or create a Chama savings group on the blockchain. Manage contributions, track payouts, and build wealth together with transparency and security.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>


        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="p-6 rounded-lg border border-border bg-background/50 hover:bg-primary hover:text-white transition-colors group">
              <Users className="w-8 h-8 text-primary mb-4 group-hover:text-white" />
              <h3 className="font-semibold text-lg mb-2">Chama Management</h3>
              <p className="text-sm text-muted-foreground group-hover:text-white hidden sm:block">
                Create and manage savings groups with transparent member tracking and role management.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-background/50 hover:bg-primary hover:text-white transition-colors group">
              <TrendingUp className="w-8 h-8 text-primary mb-4 group-hover:text-white" />
              <h3 className="font-semibold text-lg mb-2">Track Contributions</h3>
              <p className="text-sm text-muted-foreground group-hover:text-white hidden sm:block">
                Monitor all contributions in real-time with blockchain-verified transaction records.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-background/50 hover:bg-primary hover:text-white transition-colors group">
              <Zap className="w-8 h-8 text-primary mb-4 group-hover:text-white" />
              <h3 className="font-semibold text-lg mb-2">Automated Payouts</h3>
              <p className="text-sm text-muted-foreground group-hover:text-white hidden sm:block">
                Rotation-based payouts ensure every member gets their turn with smart contract automation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-border bg-background/50 hover:bg-primary hover:text-white transition-colors group">
              <Lock className="w-8 h-8 text-primary mb-4 group-hover:text-white" />
              <h3 className="font-semibold text-lg mb-2">Blockchain Security</h3>
              <p className="text-sm text-muted-foreground group-hover:text-white hidden sm:block">
                Powered by Hedera and Oasis Sapphire for secure, immutable transaction history.
              </p>
            </div>
          </div>
        </div>
      </section>
      </main>





      {/* Footer */}
      <footer className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 text-sm text-muted-foreground">
          <div>&copy; {new Date().getFullYear()} Decentralised Chama. All rights reserved.</div>
          <div>
            Made With ❤️ by{' '}
            <a
              href="https://codewitheugene.top/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              CodeWithEugene
            </a>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            <PrivacyPopup />
            <TermsPopup />
            <ContactPopup />
          </div>
        </div>
      </footer>
    </div>
  )
}
