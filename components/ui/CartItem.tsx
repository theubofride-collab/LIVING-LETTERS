'use client'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { ContenuPanier } from '@/types'

interface CartItemProps {
  item: ContenuPanier
  onUpdateQte: (livreId: number, qte: number) => void
  onRemove: (livreId: number) => void
}

function formatPrix(prix: number): string {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(prix)
}

export default function CartItem({ item, onUpdateQte, onRemove }: CartItemProps) {
  const prix = item.livre?.prix ?? 0
  const total = prix * item.qte

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-brand-cream-dark">
      {/* Couverture miniature */}
      {item.livre?.couverture && (item.livre.couverture.startsWith('http') || item.livre.couverture.startsWith('data:')) ? (
        <img src={item.livre.couverture} alt={item.livre?.nom || ''} className="w-16 h-20 rounded-lg flex-shrink-0 object-cover" />
      ) : (
        <div className="w-16 h-20 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
          <span className="font-serif text-brand-or text-lg">✦</span>
        </div>
      )}

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <h3 className="font-serif font-semibold text-brand-dark text-sm line-clamp-2 leading-snug">
          {item.livre?.nom ?? `Livre #${item.livreId}`}
        </h3>
        {item.livre?.auteurs && item.livre.auteurs.length > 0 && (
          <p className="text-xs text-brand-muted mt-0.5">{item.livre.auteurs.map(a => a.nom).join(', ')}</p>
        )}
        <p className="text-sm font-bold mt-1" style={{ color: '#EA580C' }}>
          {formatPrix(prix)} / unité
        </p>
      </div>

      {/* Contrôle quantité */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 border border-brand-cream-dark rounded-lg overflow-hidden">
          <button
            id={`qty-minus-${item.livreId}`}
            onClick={() => onUpdateQte(item.livreId, item.qte - 1)}
            className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-brand-orange hover:bg-brand-cream transition-colors"
            aria-label="Diminuer la quantité"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-brand-dark">{item.qte}</span>
          <button
            id={`qty-plus-${item.livreId}`}
            onClick={() => onUpdateQte(item.livreId, item.qte + 1)}
            className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-brand-orange hover:bg-brand-cream transition-colors"
            aria-label="Augmenter la quantité"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Total ligne */}
      <div className="text-right flex-shrink-0 min-w-[80px]">
        <p className="font-bold font-serif" style={{ color: '#EA580C' }}>{formatPrix(total)}</p>
      </div>

      {/* Supprimer */}
      <button
        id={`remove-item-${item.livreId}`}
        onClick={() => onRemove(item.livreId)}
        className="p-2 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
        aria-label="Supprimer du panier"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
