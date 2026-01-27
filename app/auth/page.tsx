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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpEmail, setOtpEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Email/Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Email OTP Login - Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: otpEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setOtpSent(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // Email OTP Login - Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: otp,
        type: 'email',
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Invalid OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // Google Login
  const handleGoogleLogin = async () => {
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
      setError(error instanceof Error ? error.message : 'Google login failed')
      setIsLoading(false)
    }
  }

  // Ethereum Wallet Login
  const handleEthereumLogin = async () => {
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

      // Sign message for verification
      const message = `Sign this message to login to Chama\n\nWallet: ${address}\nTimestamp: ${Date.now()}`
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })

      // Sign up or login with Ethereum wallet
      const { error } = await supabase.auth.signInWithPassword({
        email: `eth_${address}@chama.local`,
        password: signature,
      })

      if (error?.status === 400) {
        // User doesn't exist, create account
        const { error: signUpError } = await supabase.auth.signUp({
          email: `eth_${address}@chama.local`,
          password: signature,
          options: {
            data: {
              wallet_type: 'ethereum',
              wallet_address: address,
            },
          },
        })
        if (signUpError) throw signUpError
      } else if (error) {
        throw error
      }

      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Ethereum login failed')
      setIsLoading(false)
    }
  }

  // Solana Wallet Login
  const handleSolanaLogin = async () => {
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

      // Generate message for signing
      const message = new TextEncoder().encode(
        `Sign this message to login to Chama\n\nWallet: ${address}\nTimestamp: ${Date.now()}`
      )

      // @ts-ignore - Phantom provider
      const { signature } = await window.solana.signMessage(message)
      const signatureString = Buffer.from(signature).toString('hex')

      // Sign up or login with Solana wallet
      const { error } = await supabase.auth.signInWithPassword({
        email: `sol_${address}@chama.local`,
        password: signatureString,
      })

      if (error?.status === 400) {
        // User doesn't exist, create account
        const { error: signUpError } = await supabase.auth.signUp({
          email: `sol_${address}@chama.local`,
          password: signatureString,
          options: {
            data: {
              wallet_type: 'solana',
              wallet_address: address,
            },
          },
        })
        if (signUpError) throw signUpError
      } else if (error) {
        throw error
      }

      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Solana login failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Welcome to Chama</CardTitle>
          <CardDescription>
            Choose how you want to connect to your savings group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            {/* Email/Password Tab */}
            <TabsContent value="email">
              <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* OTP Tab */}
            <TabsContent value="otp">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-email">Email</Label>
                    <Input
                      id="otp-email"
                      type="email"
                      placeholder="you@example.com"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send a code to your email
                  </p>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the code sent to {otpEmail}
                  </p>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setOtpSent(false)
                      setError(null)
                    }}
                  >
                    Back
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* Social & Wallet Tab */}
            <TabsContent value="social" className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full bg-transparent"
                disabled={isLoading}
              >
                Sign in with Google
              </Button>
              <Button
                onClick={handleEthereumLogin}
                variant="outline"
                className="w-full bg-transparent"
                disabled={isLoading}
              >
                Connect Ethereum Wallet
              </Button>
              <Button
                onClick={handleSolanaLogin}
                variant="outline"
                className="w-full bg-transparent"
                disabled={isLoading}
              >
                Connect Solana Wallet
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="text-primary underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
