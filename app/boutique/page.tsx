'use client'
import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import BookCard from '@/components/ui/BookCard'
import CategoryFilter from '@/components/ui/CategoryFilter'
import Pagination from '@/components/ui/Pagination'
import { livreService } from '@/services/livreService'
import { categorieService } from '@/services/categorieService'
import { auteurService } from '@/services/auteurService'
import { Livre, Categorie, Auteur } from '@/types'
import { usePanier } from '@/hooks/usePanier'
import { usePagination } from '@/hooks/usePagination'

const PAGE_SIZE = 6

export default function BoutiquePage() {
  const [search, setSearch] = useState('')
  const [categorieId, setCategorieId] = useState<number | null>(null)
  const [auteurId, setAuteurId] = useState<number | null>(null)
  const [minPrix, setMinPrix] = useState('')
  const [maxPrix, setMaxPrix] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { page, goToPage, reset } = usePagination(0, PAGE_SIZE)
  const { addItem } = usePanier()

  const [livres, setLivres] = useState<Livre[]>([])
  const [categories, setCategories] = useState<Categorie[]>([])
  const [auteurs, setAuteurs] = useState<Auteur[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchLivres = useCallback(async () => {
    setLoading(true)
    try {
      const res = await livreService.getAll({
        page,
        size: PAGE_SIZE,
        q: search || undefined,
        categorieId: categorieId ?? undefined,
        auteurId: auteurId ?? undefined,
        minPrix: minPrix ? parseFloat(minPrix) : undefined,
        maxPrix: maxPrix ? parseFloat(maxPrix) : undefined,
      })
      setLivres(res.content)
      setTotalPages(res.totalPages)
      setTotalResults(res.totalElements)
    } catch {
      setLivres([])
    } finally {
      setLoading(false)
    }
  }, [page, search, categorieId, auteurId, minPrix, maxPrix])

  useEffect(() => { fetchLivres() }, [fetchLivres])

  useEffect(() => {
    categorieService.getAll().then(setCategories).catch(() => {})
    auteurService.getAll().then(setAuteurs).catch(() => {})
  }, [])

  const handleFilterChange = (fn: () => void) => { fn(); reset() }

  const handleAddToCart = (livre: Livre) => {
    addItem({ qte: 1, panierId: 1, livreId: livre.id, livre })
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF5EC' }}>
      {/* Header boutique */}
      <div className="py-12 text-center" style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">Notre Boutique</h1>
        <p className="text-white/60 text-sm">Explorez des livres</p>
      </div>

      <div className="container-brand py-10">
        {/* Barre recherche + bouton filtre */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              id="boutique-search"
              type="search"
              placeholder="Rechercher un titre, auteur, thème…"
              className="input-field pl-10"
              value={search}
              onChange={(e) => { setSearch(e.target.value); reset() }}
            />
          </div>
          <button
            id="boutique-toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all"
            style={showFilters
              ? { background: '#EA580C', borderColor: '#EA580C', color: '#C8A24A' }
              : { background: 'white', borderColor: '#E8E0D4', color: '#7A6355' }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>

        {/* Filtres étendus */}
        {showFilters && (
          <div className="card-flat mb-6 p-5 animate-slide-up">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label" htmlFor="filter-categorie">Catégorie</label>
                <select id="filter-categorie" className="input-field"
                  value={categorieId ?? ''}
                  onChange={(e) => handleFilterChange(() => setCategorieId(e.target.value ? parseInt(e.target.value) : null))}>
                  <option value="">Toutes</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="filter-auteur">Auteur</label>
                <select id="filter-auteur" className="input-field"
                  value={auteurId ?? ''}
                  onChange={(e) => handleFilterChange(() => setAuteurId(e.target.value ? parseInt(e.target.value) : null))}>
                  <option value="">Tous</option>
                  {auteurs.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="filter-prix-min">Prix minimum (FCFA)</label>
                <input id="filter-prix-min" type="number" placeholder="0" className="input-field"
                  value={minPrix} onChange={(e) => handleFilterChange(() => setMinPrix(e.target.value))} />
              </div>
              <div>
                <label className="label" htmlFor="filter-prix-max">Prix maximum (FCFA)</label>
                <input id="filter-prix-max" type="number" placeholder="50000" className="input-field"
                  value={maxPrix} onChange={(e) => handleFilterChange(() => setMaxPrix(e.target.value))} />
              </div>
            </div>
            <button className="btn-ghost mt-3 text-xs gap-1" onClick={() => handleFilterChange(() => {
              setCategorieId(null); setAuteurId(null); setMinPrix(''); setMaxPrix(''); setSearch('')
            })}>
              <X className="w-3 h-3" /> Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Filtre catégories pills */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selected={categorieId}
            onChange={(id) => handleFilterChange(() => setCategorieId(id))}
          />
        </div>

        {/* Résultats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-brand-muted">
            <strong className="text-brand-dark">{totalResults}</strong> résultat{totalResults > 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : livres.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">Aucun résultat</h3>
            <p className="text-brand-muted">Essayez d'autres filtres ou termes de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {livres.map((livre) => (
              <BookCard key={livre.id} livre={livre} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        )}
      </div>
    </div>
  )
}
