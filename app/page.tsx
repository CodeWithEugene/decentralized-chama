'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Users, TrendingUp, Lock, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-background/80 border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Chama</div>
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 pt-16 border-t border-border">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <p className="text-sm text-muted-foreground">Active Groups</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">$5M+</div>
              <p className="text-sm text-muted-foreground">Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Powerful Features for Group Savings
          </h2>
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

      {/* Auth Methods Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Multiple Ways to Connect
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your preferred authentication method
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-lg border border-border">
              <h3 className="font-semibold text-lg mb-4">Traditional Auth</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Email & Password
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  One-Time Password (OTP)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Google Sign-In
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-lg border border-border">
              <h3 className="font-semibold text-lg mb-4">Web3 Wallets</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Ethereum (MetaMask)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Solana (Phantom)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  More Coming Soon
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-card/50 rounded-lg p-12">
          <h2 className="text-4xl font-bold text-foreground">
            Ready to Start Saving Together?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of users managing their savings groups on Chama
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="gap-2">
              Create Your Group <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 text-sm text-muted-foreground">
          <div>&copy; 2026 Chama. All rights reserved.</div>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
