'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const EthereumIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
        <path d="M16.498 4L9 16.22l7.498-3.35z"/>
        <path fillOpacity=".602" d="M16.498 21.968l7.497-4.353-7.497-3.349z"/>
        <path d="M16.498 21.968V28L9 17.615z"/>
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
        <path fillOpacity=".602" d="M16.498 12.872v3.353l-7.498-3.353z"/>
      </g>
    </g>
  </svg>
)

const SolanaIcon = ({ className }: { className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 311" className={className}>
      <defs>
         <linearGradient id="solana_gradient" x1="0.659" y1="0.518" x2="0.108" y2="0.638" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#00ffa3"/>
            <stop offset="1" stopColor="#dc1fff"/>
         </linearGradient>
      </defs>
      <path fill="url(#solana_gradient)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm269.6-104.4c-2.4 2.4-5.7 3.8-9.2 3.8H7.6c-5.8 0-8.7-7-4.6-11.1l62.7-62.7c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7zM64.6 29.3c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1L333.1 99.3c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 29.3z"/>
   </svg>
)

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [signUpMode, setSignUpMode] = useState<'methods' | 'email'>('methods')
  const router = useRouter()
  const supabase = createClient()

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Google sign up failed')
      setIsLoading(false)
    }
  }

  // Ethereum Sign Up
  const handleEthereumSignUp = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // @ts-ignore - MetaMask
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to connect Ethereum wallet')
      }

      // @ts-ignore - MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const address = accounts[0]

      const message = `Sign this message to create account on Chama\n\nWallet: ${address}\nTimestamp: ${Date.now()}`
      // @ts-ignore - MetaMask
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })

      const { error } = await supabase.auth.signUp({
        email: `eth_${address}@chama.local`,
        password: signature,
        options: {
          data: {
            wallet_type: 'ethereum',
            wallet_address: address,
          },
        },
      })

      if (error) throw error
      setSignUpSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Ethereum sign up failed')
      setIsLoading(false)
    }
  }

  // Solana Sign Up
  const handleSolanaSignUp = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // @ts-ignore - Phantom provider
      if (!window.solana) {
        throw new Error('Please install Phantom wallet to connect Solana wallet')
      }

      // @ts-ignore - Phantom provider
      const response = await window.solana.connect()
      const address = response.publicKey.toString()

      const message = new TextEncoder().encode(
        `Sign this message to create account on Chama\n\nWallet: ${address}\nTimestamp: ${Date.now()}`
      )

      // @ts-ignore - Phantom provider
      const { signature } = await window.solana.signMessage(message)
      const signatureString = Buffer.from(signature).toString('hex')

      const { error } = await supabase.auth.signUp({
        email: `sol_${address}@chama.local`,
        password: signatureString,
        options: {
          data: {
            wallet_type: 'solana',
            wallet_address: address,
          },
        },
      })

      if (error) throw error
      setSignUpSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Solana sign up failed')
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            created_at: new Date().toISOString(),
          },
        },
      })
      if (error) throw error
      setSignUpSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (signUpSuccess) {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex bg-muted relative">
          <img src="/auth.png" alt="Authentication" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent a confirmation link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in the email to confirm your account and start using Chama.
            </p>
            <Button
              onClick={() => router.push('/auth')}
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  // Method selection view
  if (signUpMode === 'methods') {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex bg-muted relative">
          <img src="/auth.png" alt="Authentication" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <CardTitle className="text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Choose how you want to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Web3 Wallets First */}
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full bg-transparent justify-center gap-3 h-auto py-3"
              disabled={isLoading}
            >
              <GoogleIcon className="w-5 h-5" />
              <div className="text-center">
                <div className="font-semibold">Sign up with Google</div>
              </div>
            </Button>

            <Button
              onClick={handleEthereumSignUp}
              variant="outline"
              className="w-full bg-transparent justify-center gap-3 h-auto py-3"
              disabled={isLoading}
            >
              <EthereumIcon className="w-5 h-5" />
              <div className="text-center">
                <div className="font-semibold">Connect Ethereum Wallet</div>
              </div>
            </Button>

            <Button
              onClick={handleSolanaSignUp}
              variant="outline"
              className="w-full bg-transparent justify-center gap-3 h-auto py-3"
              disabled={isLoading}
            >
              <SolanaIcon className="w-5 h-5" />
              <div className="text-center">
                <div className="font-semibold">Connect Solana Wallet</div>
              </div>
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or sign up with email</span>
              </div>
            </div>

            {/* Email Option */}
            <Button
              onClick={() => {
                setSignUpMode('email')
                setError(null)
              }}
              variant="outline"
              className="w-full bg-transparent justify-center gap-3"
              disabled={isLoading}
            >
              <Mail size={18} />
              Sign up with email
            </Button>

            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link
                href="/auth"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Email sign-up view
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex bg-muted relative">
        <img src="/auth.png" alt="Authentication" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <button
            onClick={() => {
              setSignUpMode('methods')
              setError(null)
            }}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <CardTitle>Sign Up with Email</CardTitle>
          <CardDescription>
            Create your account to start saving
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/auth"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
