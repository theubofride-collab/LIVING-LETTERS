'use client'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { Livre } from '@/types'
import { useToast } from '@/context/ToastContext'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

interface BookCardProps {
  livre: Livre
  onAddToCart?: (livre: Livre) => void
}

function formatPrix(prix: number): string {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(prix)
}

export default function BookCard({ livre, onAddToCart }: BookCardProps) {
  const slug = livre.slug || livre.id.toString()
  const stockFaible = livre.stock > 0 && livre.stock <= 5
  const enRupture = livre.stock === 0
  const { showToast } = useToast()
  const router = useRouter()

  const handleAdd = () => {
    if (!isAuthenticated()) {
      showToast('Connectez-vous pour ajouter au panier')
      router.push('/connexion?redirect=/boutique')
      return
    }
    onAddToCart?.(livre)
    showToast(`${livre.nom} ajouté au panier`)
  }

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: '0 2px 16px rgba(28,20,16,0.08)' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(28,20,16,0.14)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 16px rgba(28,20,16,0.08)')}
    >
      {/* Couverture */}
      <Link href={`/boutique/${slug}`} className="block overflow-hidden" aria-label={`Voir ${livre.nom}`}>
        <div className="relative h-56 overflow-hidden"
          style={{ background: livre.couverture ? 'transparent' : 'linear-gradient(135deg, #EA580C 0%, #9A3412 50%, #1C1410 100%)' }}>
          {livre.couverture ? (
            <img src={livre.couverture} alt={livre.nom} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 border-2 border-brand-or/40"
                style={{ background: 'rgba(200,162,74,0.15)' }}>
                <span className="font-serif text-2xl text-brand-or">✦</span>
              </div>
              <p className="font-serif text-white/90 text-sm font-semibold line-clamp-2 leading-tight">{livre.nom}</p>
            </div>
          )}

          {/* Badge statut stock */}
          {enRupture && (
            <div className="absolute top-3 left-3 badge" style={{ background: '#DC2626', color: 'white' }}>
              Épuisé
            </div>
          )}
          {stockFaible && !enRupture && (
            <div className="absolute top-3 left-3 badge" style={{ background: '#F59E0B', color: '#1C1410' }}>
              Derniers exemplaires
            </div>
          )}

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        </div>
      </Link>

      {/* Infos */}
      <div className="p-4">
        {/* Catégorie */}
        {livre.categorie && (
          <span className="text-[11px] font-semibold tracking-wider uppercase"
            style={{ color: '#C8A24A' }}>
            {livre.categorie.nom}
          </span>
        )}

        {/* Titre */}
        <Link href={`/boutique/${slug}`}>
          <h3 className="mt-1 font-serif text-base font-bold leading-snug line-clamp-2 text-brand-dark group-hover:text-brand-orange transition-colors">
            {livre.nom}
          </h3>
        </Link>

        {/* Auteur */}
        {livre.auteurs && livre.auteurs.length > 0 && (
          <p className="mt-1 text-xs text-brand-muted font-medium">
            {livre.auteurs.map(a => a.nom).join(', ')}
          </p>
        )}

        {/* Note */}
        {livre.notemoyenne !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 fill-brand-or text-brand-or" />
            <span className="text-xs font-semibold text-brand-dark-soft">{livre.notemoyenne.toFixed(1)}</span>
            {livre.nbCommentaires !== undefined && (
              <span className="text-xs text-brand-muted">({livre.nbCommentaires})</span>
            )}
          </div>
        )}

        {/* Prix + Ajout panier */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-serif text-lg font-bold" style={{ color: '#EA580C' }}>
            {formatPrix(livre.prix)}
          </span>
          <button
            id={`add-cart-${livre.id}`}
            onClick={handleAdd}
            disabled={enRupture}
            aria-label={`Ajouter ${livre.nom} au panier`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: enRupture ? '#E8E0D4' : 'linear-gradient(135deg, #C8A24A 0%, #A8832A 100%)',
              color: enRupture ? '#9E8E80' : '#1C1410',
              boxShadow: enRupture ? 'none' : '0 2px 8px rgba(200,162,74,0.3)',
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </article>
  )
}
