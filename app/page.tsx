'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PrivacyPopup, TermsPopup, ContactPopup } from '@/components/pages/legal-popups'
import { ArrowRight, Users, TrendingUp, Lock, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-background/80 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <img src="/icon.png" alt="Chama Icon" className="h-8 w-8" />
            <span>Chama</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance mb-6">
              Decentralized Savings Groups, Made Simple
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
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
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-border bg-background/50 hover:bg-card/50 transition-colors">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Group Management</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage savings groups with transparent member tracking and role management.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-border bg-background/50 hover:bg-card/50 transition-colors">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Track Contributions</h3>
              <p className="text-sm text-muted-foreground">
                Monitor all contributions in real-time with blockchain-verified transaction records.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-border bg-background/50 hover:bg-card/50 transition-colors">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Automated Payouts</h3>
              <p className="text-sm text-muted-foreground">
                Rotation-based payouts ensure every member gets their turn with smart contract automation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-border bg-background/50 hover:bg-card/50 transition-colors">
              <Lock className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Blockchain Security</h3>
              <p className="text-sm text-muted-foreground">
                Powered by Hedera and Oasis Sapphire for secure, immutable transaction history.
              </p>
            </div>
          </div>
        </div>
      </section>





      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 text-sm text-muted-foreground">
          <div>&copy; {new Date().getFullYear()} Chama. All rights reserved.</div>
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
