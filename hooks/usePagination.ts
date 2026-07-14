'use client'
import { useState } from 'react'

export function usePagination(initialPage = 0, initialSize = 12) {
  const [page, setPage] = useState(initialPage)
  const [size] = useState(initialSize)

  const nextPage = () => setPage(p => p + 1)
  const prevPage = () => setPage(p => Math.max(0, p - 1))
  const goToPage = (n: number) => setPage(n)
  const reset = () => setPage(0)

  return { page, size, nextPage, prevPage, goToPage, reset }
}
