'use client'
import { useState, useEffect, useCallback } from 'react'
import { ContenuPanier } from '@/types'
import { MOCK_PANIER } from '@/lib/mockData'

const USE_MOCK = process.env.NEXT_PUBLIC_API_URL === undefined || process.env.NEXT_PUBLIC_API_URL === ''

export function usePanier() {
  const [items, setItems] = useState<ContenuPanier[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (USE_MOCK) {
      setItems(MOCK_PANIER.contenus || [])
    }
  }, [])

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
      removeItem(livreId)
      return
    }
    setItems(prev => prev.map(i => i.livreId === livreId ? { ...i, qte } : i))
  }, [removeItem])

  const clearPanier = useCallback(() => setItems([]), [])

  return { items, total, count, loading, addItem, removeItem, updateQte, clearPanier }
}
