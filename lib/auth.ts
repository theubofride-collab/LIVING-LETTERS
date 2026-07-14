// ============================================================
// Living Letters — Gestion JWT (lib/auth.ts)
// Stockage : localStorage (dev) → à migrer vers cookie httpOnly en prod
// ============================================================

import { Utilisateur, UserRole } from '@/types'

const TOKEN_KEY = 'll_token'
const REFRESH_KEY = 'll_refresh_token'
const USER_KEY = 'll_user'

// ---- Getters ----
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_KEY)
}

export function getStoredUser(): Utilisateur | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Utilisateur
  } catch {
    return null
  }
}

// ---- Setters ----
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(REFRESH_KEY, token)
}

export function setStoredUser(user: Utilisateur): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// ---- Suppression (logout) ----
export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

// ---- Helpers ----
export function isAuthenticated(): boolean {
  return !!getToken()
}

export function getUserRole(): UserRole | null {
  const user = getStoredUser()
  return user?.role ?? null
}

export function isAdmin(): boolean {
  return getUserRole() === 'ADMIN'
}

/**
 * Décode le payload d'un JWT (sans vérification de signature côté client)
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * Vérifie si le token est expiré (côté client uniquement, non sécurisé)
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload || typeof payload.exp !== 'number') return true
  return Date.now() >= payload.exp * 1000
}
