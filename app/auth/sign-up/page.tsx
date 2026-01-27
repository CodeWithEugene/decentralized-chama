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
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to connect Ethereum wallet')
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const address = accounts[0]

      const message = `Sign this message to create account on Chama\n\nWallet: ${address}\nTimestamp: ${Date.now()}`
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
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
    )
  }

  // Method selection view
  if (signUpMode === 'methods') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
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
              className="w-full bg-transparent justify-start gap-3 h-auto py-3"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-lg">
                  🔵
                </text>
              </svg>
              <div className="text-left">
                <div className="font-semibold">Sign up with Google</div>
              </div>
            </Button>

            <Button
              onClick={handleEthereumSignUp}
              variant="outline"
              className="w-full bg-transparent justify-start gap-3 h-auto py-3"
              disabled={isLoading}
            >
              <div className="w-5 h-5 flex items-center justify-center text-lg">Ξ</div>
              <div className="text-left">
                <div className="font-semibold">Connect Ethereum Wallet</div>
              </div>
            </Button>

            <Button
              onClick={handleSolanaSignUp}
              variant="outline"
              className="w-full bg-transparent justify-start gap-3 h-auto py-3"
              disabled={isLoading}
            >
              <div className="w-5 h-5 flex items-center justify-center text-lg">◎</div>
              <div className="text-left">
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
              className="w-full bg-transparent justify-start gap-3"
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
    )
  }

  // Email sign-up view
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
  )
}
