'use client'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' }

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const iconSize = sizes[size]
  return (
    <div className="flex items-center gap-0.5" role={readonly ? 'img' : 'group'} aria-label={`Note : ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} disabled:cursor-default`}
        >
          <Star
            className={`${iconSize} transition-colors`}
            fill={n <= value ? '#C8A24A' : 'none'}
            color={n <= value ? '#C8A24A' : '#D1C5B8'}
          />
        </button>
      ))}
    </div>
  )
}
