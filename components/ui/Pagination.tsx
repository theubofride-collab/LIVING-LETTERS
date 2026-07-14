'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number    // 0-indexed (Spring Data)
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)
  const visiblePages = pages.filter(p => Math.abs(p - currentPage) <= 2)

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        id="pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-orange hover:bg-brand-cream disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Page précédente"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {visiblePages[0] > 0 && (
        <>
          <button onClick={() => onPageChange(0)} className="w-9 h-9 rounded-lg text-sm font-medium text-brand-muted hover:bg-brand-cream transition-colors">1</button>
          {visiblePages[0] > 1 && <span className="text-brand-muted px-1">…</span>}
        </>
      )}

      {visiblePages.map((p) => (
        <button
          key={p}
          id={`pagination-page-${p + 1}`}
          onClick={() => onPageChange(p)}
          className="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
          style={
            p === currentPage
              ? { background: 'linear-gradient(135deg, #EA580C, #9A3412)', color: '#C8A24A' }
              : { color: '#7A6355' }
          }
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p + 1}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 2 && <span className="text-brand-muted px-1">…</span>}
          <button onClick={() => onPageChange(totalPages - 1)} className="w-9 h-9 rounded-lg text-sm font-medium text-brand-muted hover:bg-brand-cream transition-colors">{totalPages}</button>
        </>
      )}

      <button
        id="pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-orange hover:bg-brand-cream disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Page suivante"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
