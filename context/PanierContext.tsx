'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ContenuPanier } from '@/types'

const STORAGE_KEY = 'll_panier'

interface PanierContextValue {
  items: ContenuPanier[]
  total: number
  count: number
  loading: boolean
  addItem: (item: ContenuPanier) => void
  removeItem: (livreId: number) => void
  updateQte: (livreId: number, qte: number) => void
  clearPanier: () => void
}

const PanierContext = createContext<PanierContextValue | null>(null)

function loadFromStorage(): ContenuPanier[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(items: ContenuPanier[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function PanierProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContenuPanier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setItems(loadFromStorage())
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) saveToStorage(items)
  }, [items, loading])

  const total = items.reduce((acc, item) => acc + (item.livre?.prix || 0) * item.qte, 0)
  const count = items.reduce((acc, item) => acc + item.qte, 0)

  const addItem = useCallback((item: ContenuPanier) => {
    setItems(prev => {
      const existing = prev.find(i => i.livreId === item.livreId)
      if (existing) {
        return prev.map(i => i.livreId === item.livreId ? { ...i, qte: i.qte + item.qte } : i)
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((livreId: number) => {
    setItems(prev => prev.filter(i => i.livreId !== livreId))
  }, [])

  const updateQte = useCallback((livreId: number, qte: number) => {
    if (qte <= 0) {
      setItems(prev => prev.filter(i => i.livreId !== livreId))
      return
    }
    setItems(prev => prev.map(i => i.livreId === livreId ? { ...i, qte } : i))
  }, [])

  const clearPanier = useCallback(() => setItems([]), [])

  return (
    <PanierContext.Provider value={{ items, total, count, loading, addItem, removeItem, updateQte, clearPanier }}>
      {children}
    </PanierContext.Provider>
  )
}

export function usePanierContext(): PanierContextValue {
  const ctx = useContext(PanierContext)
  if (!ctx) throw new Error('usePanierContext must be used within PanierProvider')
  return ctx
}
