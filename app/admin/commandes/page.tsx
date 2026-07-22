'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { commandeService } from '@/services/commandeService'
import { Commande, PageResponse, CommandeStatut } from '@/types'
import OrderStatusBadge from '@/components/ui/OrderStatusBadge'
import { Eye, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'

export default function AdminCommandesPage() {
  const [pageData, setPageData] = useState<PageResponse<Commande> | null>(null)
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterStatut, setFilterStatut] = useState<CommandeStatut | ''>('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const PAGE_SIZE = 10

  const load = async (p: number) => {
    setLoading(true)
    try {
      const data = await commandeService.getAll({ page: p, size: 100 })
      setPageData(data)
      setCommandes(data.content)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load(page) }, [page])

  // Filtrage client-side
  let filtered = commandes

  if (filterStatut) {
    filtered = filtered.filter(c => c.statut === filterStatut)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(c =>
      String(c.id).includes(q) ||
      String(c.utilisateurId).includes(q) ||
      (c.montantTotal || 0).toLocaleString().includes(q)
    )
  }

  if (dateFrom) {
    filtered = filtered.filter(c => new Date(c.dateCommande) >= new Date(dateFrom))
  }
  if (dateTo) {
    const to = new Date(dateTo)
    to.setHours(23, 59, 59, 999)
    filtered = filtered.filter(c => new Date(c.dateCommande) <= to)
  }

  const hasActiveFilters = search || dateFrom || dateTo || filterStatut

  const clearFilters = () => {
    setSearch(''); setDateFrom(''); setDateTo(''); setFilterStatut('')
  }

  const statuts: { value: CommandeStatut | ''; label: string }[] = [
    { value: '', label: 'Toutes' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'VALIDEE', label: 'Validées' },
    { value: 'EN_LIVRAISON', label: 'En livraison' },
    { value: 'LIVREE', label: 'Livrées' },
    { value: 'ANNULEE', label: 'Annulées' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark mb-6">Commandes</h1>

      {/* Barre recherche + bouton filtre */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input type="search" placeholder="Rechercher par ID, client ou montant…"
            className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all ${
            showFilters ? 'border-brand-orange bg-brand-orange/10 text-brand-orange' : 'border-brand-cream-dark text-brand-muted hover:border-brand-orange/50'
          }`}>
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filtres</span>
        </button>
      </div>

      {/* Filtres étendus */}
      {showFilters && (
        <div className="card-flat mb-4 p-4 animate-slide-up">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Date début</label>
              <input type="date" className="input-field" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="label">Date fin</label>
              <input type="date" className="input-field" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <button onClick={clearFilters} className="btn-ghost text-xs gap-1">
                  <X className="w-3 h-3" /> Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statuts.map(s => (
          <button key={s.value} onClick={() => { setFilterStatut(s.value as CommandeStatut | '') }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterStatut === s.value
                ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                : 'border-brand-cream-dark text-brand-muted hover:border-brand-orange/50'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brand-muted">Aucune commande trouvée.</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-sm mt-2">Effacer les filtres</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream text-brand-muted text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">ID</th>
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Client</th>
                  <th className="text-left px-4 py-3 font-semibold">Statut</th>
                  <th className="text-right px-4 py-3 font-semibold">Montant</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filtered.map(cmd => (
                  <tr key={cmd.id} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-brand-dark">#{cmd.id}</td>
                    <td className="px-4 py-3 text-brand-muted">
                      {new Date(cmd.dateCommande).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">
                      Client #{cmd.utilisateurId}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge statut={cmd.statut} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-dark">
                      {(cmd.montantTotal || 0).toLocaleString()} FCFA
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/commandes/${cmd.id}`}
                        className="p-2 rounded-lg hover:bg-brand-cream inline-flex transition-colors" title="Voir le détail">
                        <Eye className="w-4 h-4 text-brand-muted" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-brand-cream-dark">
          <p className="text-xs text-brand-muted">
            {filtered.length} commande(s) affichée(s)
          </p>
          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg hover:bg-brand-cream disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={filtered.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg hover:bg-brand-cream disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
