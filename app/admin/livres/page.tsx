'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { livreService } from '@/services/livreService'
import { categorieService } from '@/services/categorieService'
import { Livre, Categorie, PageResponse } from '@/types'
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'

export default function AdminLivresPage() {
  const [pageData, setPageData] = useState<PageResponse<Livre> | null>(null)
  const [livres, setLivres] = useState<Livre[]>([])
  const [categories, setCategories] = useState<Categorie[]>([])
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filterCategorie, setFilterCategorie] = useState<number | ''>('')
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 10

  const loadLivres = async (p: number) => {
    setLoading(true)
    try {
      const data = await livreService.getAll({ page: p, size: 100 })
      setPageData(data)
      setLivres(data.content)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { loadLivres(page) }, [page])
  useEffect(() => { categorieService.getAll().then(setCategories).catch(() => {}) }, [])

  const handleDelete = async (id: number, nom: string) => {
    if (!confirm(`Supprimer le livre "${nom}" ? Cette action est irréversible.`)) return
    await livreService.delete(id)
    setLivres(prev => prev.filter(l => l.id !== id))
  }

  // Filtrage client-side
  let filteredLivres = livres

  if (search) {
    const q = search.toLowerCase()
    filteredLivres = filteredLivres.filter(l =>
      l.nom.toLowerCase().includes(q) ||
      l.categorie?.nom?.toLowerCase().includes(q) ||
      l.auteurs?.some(a => a.nom.toLowerCase().includes(q))
    )
  }
  if (filterCategorie !== '') {
    filteredLivres = filteredLivres.filter(l => l.categorieId === filterCategorie)
  }
  if (filterStock === 'low') {
    filteredLivres = filteredLivres.filter(l => l.stock > 0 && l.stock <= 5)
  } else if (filterStock === 'out') {
    filteredLivres = filteredLivres.filter(l => l.stock === 0)
  }

  const hasFilters = search || filterCategorie !== '' || filterStock !== 'all'

  const clearFilters = () => {
    setSearch(''); setFilterCategorie(''); setFilterStock('all')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark">Livres</h1>
        <Link href="/admin/livres/ajouter" className="btn-primary text-sm py-2.5">
          <Plus className="w-4 h-4" /> Nouveau livre
        </Link>
      </div>

      {/* Barre recherche + bouton filtre */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input type="search" placeholder="Rechercher par titre, catégorie ou auteur…"
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
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Catégorie</label>
              <select className="input-field" value={filterCategorie} onChange={e => setFilterCategorie(e.target.value ? Number(e.target.value) : '')}>
                <option value="">Toutes</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Stock</label>
              <select className="input-field" value={filterStock} onChange={e => setFilterStock(e.target.value as typeof filterStock)}>
                <option value="all">Tous</option>
                <option value="low">Stock bas (1-5)</option>
                <option value="out">Rupture (0)</option>
              </select>
            </div>
            {hasFilters && (
              <div className="flex items-end">
                <button onClick={clearFilters} className="btn-ghost text-xs gap-1">
                  <X className="w-3 h-3" /> Réinitialiser
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLivres.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brand-muted">Aucun livre trouvé.</p>
            {hasFilters && <button onClick={clearFilters} className="btn-ghost text-sm mt-2">Effacer les filtres</button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream text-brand-muted text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Titre</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Catégorie</th>
                  <th className="text-right px-4 py-3 font-semibold hidden md:table-cell">Prix</th>
                  <th className="text-right px-4 py-3 font-semibold">Stock</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filteredLivres.map(l => (
                  <tr key={l.id} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-cream flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">📖</span>
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark">{l.nom}</p>
                          {l.auteurs && l.auteurs.length > 0 && (
                            <p className="text-xs text-brand-muted">{l.auteurs.map(a => a.nom).join(', ')}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">{l.categorie?.nom || '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-dark hidden md:table-cell">{l.prix.toLocaleString()} FCFA</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        l.stock === 0 ? 'bg-red-50 text-red-600' : l.stock <= 5 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                      }`}>{l.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/livres/${l.id}`} className="p-2 rounded-lg hover:bg-brand-cream transition-colors" title="Modifier">
                          <Pencil className="w-4 h-4 text-brand-muted" />
                        </Link>
                        <button onClick={() => handleDelete(l.id, l.nom)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-brand-cream-dark">
          <p className="text-xs text-brand-muted">{filteredLivres.length} livre(s) affiché(s)</p>
          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg hover:bg-brand-cream disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={filteredLivres.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg hover:bg-brand-cream disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
