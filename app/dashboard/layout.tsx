'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth')
        return
      }

      setIsAuthed(true)
    }

    checkAuth()
  }, [supabase, router])

  // Auto-logout functionality
  useEffect(() => {
    if (!isAuthed) return

    let timeoutId: NodeJS.Timeout

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/')
      }, 300000) // 5 minutes in ms
    }

    // Events to track activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']

    // Setup listeners
    const setup = () => {
      events.forEach(event => {
        document.addEventListener(event, resetTimer)
      })
      resetTimer() // Initial start
    }

    setup()

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      events.forEach(event => {
        document.removeEventListener(event, resetTimer)
      })
    }
  }, [isAuthed, supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isAuthed === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}
