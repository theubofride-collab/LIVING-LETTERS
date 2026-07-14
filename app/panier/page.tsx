'use client'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import CartItem from '@/components/ui/CartItem'
import { usePanier } from '@/hooks/usePanier'

function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(prix)
}

export default function PanierPage() {
  const { items, total, updateQte, removeItem, clearPanier } = usePanier()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 container-brand py-16">
        <div className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
          <ShoppingBag className="w-12 h-12 text-brand-or" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Votre panier est vide</h1>
        <p className="text-brand-muted text-center">Découvrez notre sélection d'ouvrages et commencez votre lecture !</p>
        <Link href="/boutique" id="panier-cta-boutique" className="btn-primary">
          Explorer la boutique
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10" style={{ background: '#FFF5EC' }}>
      <div className="container-brand">
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-8">Mon panier</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.livreId}
                item={item}
                onUpdateQte={updateQte}
                onRemove={removeItem}
              />
            ))}
            <button id="panier-vider" onClick={clearPanier} className="btn-ghost text-sm text-red-500 hover:bg-red-50">
              Vider le panier
            </button>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="font-serif text-xl font-bold text-brand-dark mb-5">Récapitulatif</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Sous-total ({items.reduce((a, i) => a + i.qte, 0)} article{items.reduce((a, i) => a + i.qte, 0) > 1 ? 's' : ''})</span>
                  <span>{formatPrix(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Livraison</span>
                  <span className="text-green-600 font-medium">À calculer</span>
                </div>
                <div className="border-t border-brand-cream-dark pt-3 flex justify-between font-bold">
                  <span className="font-serif text-brand-dark">Total</span>
                  <span className="font-serif text-xl" style={{ color: '#EA580C' }}>{formatPrix(total)}</span>
                </div>
              </div>

              <Link href="/commande/adresse" id="panier-commander" className="btn-primary w-full justify-center">
                Passer la commande
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/boutique" className="btn-ghost w-full justify-center mt-2 text-sm">
                Continuer mes achats
              </Link>

              <div className="mt-5 p-3 rounded-xl text-center" style={{ background: '#F0EBE0' }}>
                <p className="text-xs text-brand-muted">Paiement sécurisé via MoMo & Orange Money</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
