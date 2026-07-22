'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, AlertCircle } from 'lucide-react'
import { commandeService } from '@/services/commandeService'
import { Commande } from '@/types'

function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(prix)
}

export default function CommandeConfirmationPage() {
  const [commande, setCommande] = useState<Commande | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const commandeId = params.get('commandeId')
    if (commandeId) {
      commandeService.getById(parseInt(commandeId))
        .then(setCommande)
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF5EC' }}>
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-16" style={{ background: '#FFF5EC' }}>
      <div className="max-w-lg w-full mx-4 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
          <CheckCircle className="w-12 h-12 text-brand-or" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-3">
          Commande confirmée !
        </h1>
        <p className="text-brand-muted mb-6">
          Merci pour votre commande. Nous avons bien reçu votre paiement et votre commande est en cours de préparation.
        </p>

        {commande ? (
          <>
            <div className="card-flat p-5 mb-6 text-center">
              <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Numéro de commande</p>
              <p className="font-mono text-xl font-bold" style={{ color: '#EA580C' }}>#{commande.id}</p>
            </div>

            <div className="card p-5 mb-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Date de commande</span>
                <span className="font-medium text-brand-dark">
                  {new Date(commande.dateCommande).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Statut</span>
                <span className="font-medium text-brand-dark">{commande.statut}</span>
              </div>
              {commande.adresse && (
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Livraison</span>
                  <span className="font-medium text-brand-dark">{commande.adresse.ville}, {commande.adresse.pays}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-brand-cream-dark pt-3">
                <span className="font-bold text-brand-dark">Total payé</span>
                <span className="font-serif font-bold" style={{ color: '#EA580C' }}>
                  {formatPrix(commande.montantTotal || 0)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="card-flat p-5 mb-6">
            <p className="text-sm text-brand-muted">Commande enregistrée avec succès.</p>
          </div>
        )}

        <div className="p-4 rounded-xl mb-8 flex items-start gap-3"
          style={{ background: 'rgba(110,30,43,0.05)', border: '1px solid rgba(110,30,43,0.1)' }}>
          <Package className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-muted text-left">
            Votre commande sera livrée sous <strong>3 à 5 jours ouvrables</strong>. Un SMS de confirmation vous sera envoyé à chaque étape.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/compte/commandes" id="confirmation-mes-commandes" className="btn-primary">
            Suivre ma commande
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/boutique" className="btn-secondary">
            Continuer mes achats
          </Link>
        </div>

        <p className="mt-10 font-serif text-sm italic text-brand-muted">
          "Que la grâce et la paix vous soient données en abondance."
        </p>
      </div>
    </div>
  )
}
