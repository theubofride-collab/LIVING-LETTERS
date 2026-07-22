'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { commandeService } from '@/services/commandeService'
import { Commande, CommandeStatut } from '@/types'
import OrderStatusBadge from '@/components/ui/OrderStatusBadge'
import { ShoppingBag, ChevronRight, Search } from 'lucide-react'

export default function CompteCommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    commandeService.getAll({ page: 0, size: 100 })
      .then(res => setCommandes(res.content))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? commandes.filter(c =>
        String(c.id).includes(search) ||
        new Date(c.dateCommande).toLocaleDateString('fr-FR').includes(search)
      )
    : commandes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (commandes.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
          <ShoppingBag className="w-8 h-8 text-brand-or" />
        </div>
        <h2 className="font-serif text-xl font-bold text-brand-dark mb-2">Aucune commande</h2>
        <p className="text-sm text-brand-muted mb-4">Vous n'avez pas encore passé de commande.</p>
        <Link href="/boutique" className="btn-primary text-sm inline-flex">Commencer mes achats</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-brand-dark mb-6">Mes commandes</h1>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input type="search" placeholder="Rechercher par numéro ou date…" className="input-field pl-10"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map(cmd => (
          <div key={cmd.id} className="card-flat p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-brand-dark text-sm">Commande #{cmd.id}</p>
                <OrderStatusBadge statut={cmd.statut} />
              </div>
              <p className="text-xs text-brand-muted">
                {new Date(cmd.dateCommande).toLocaleDateString('fr-FR')} à {new Date(cmd.dateCommande).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              {cmd.lignes && (
                <p className="text-xs text-brand-muted mt-1">
                  {cmd.lignes.length} article{cmd.lignes.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-brand-dark text-sm">{(cmd.montantTotal || 0).toLocaleString()} FCFA</p>
              <Link href={`/commande/confirmation?commandeId=${cmd.id}`}
                className="text-xs text-brand-orange font-semibold hover:underline inline-flex items-center gap-0.5 mt-1">
                Détail <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-brand-muted text-center mt-6">{filtered.length} commande(s) au total</p>
    </div>
  )
}
