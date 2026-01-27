'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An error occurred during authentication'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>Something went wrong</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
            <p className="text-sm text-destructive">{message}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Please try again or contact support if the problem persists.
          </p>
          <div className="flex gap-2">
            <Link href="/auth" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Login
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div />}>
      <ErrorContent />
    </Suspense>
  )
}
