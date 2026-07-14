'use client'
import { useState, useEffect, useCallback } from 'react'
import { Utilisateur } from '@/types'
import { getStoredUser, isAuthenticated, removeToken, isAdmin } from '@/lib/auth'
import { authService } from '@/services/authService'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<Utilisateur | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = getStoredUser()
    if (stored && isAuthenticated()) {
      setUser(stored)
    }
    setLoading(false)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      removeToken()
    }
    setUser(null)
    router.push('/')
  }, [router])

  return {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    logout,
  }
}
