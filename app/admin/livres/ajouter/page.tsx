'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { livreService } from '@/services/livreService'
import { categorieService } from '@/services/categorieService'
import { auteurService } from '@/services/auteurService'
import { Categorie, Auteur } from '@/types'
import ImageUpload from '@/components/ui/ImageUpload'

export default function AdminLivreAjouterPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Categorie[]>([])
  const [auteurs, setAuteurs] = useState<Auteur[]>([])
  const [selectedAuteurs, setSelectedAuteurs] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nom: '', description: '', stock: '', prix: '', categorieId: '', couverture: '', slug: '',
  })

  useEffect(() => {
    Promise.all([categorieService.getAll(), auteurService.getAll()])
      .then(([c, a]) => { setCategories(c); setAuteurs(a) })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const toggleAuteur = (id: number) => {
    setSelectedAuteurs(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const livre = await livreService.create({
        nom: form.nom,
        description: form.description,
        stock: parseInt(form.stock) || 0,
        prix: parseFloat(form.prix) || 0,
        categorieId: parseInt(form.categorieId) || 0,
        couverture: form.couverture || undefined,
        slug: form.slug || undefined,
      })
      router.push('/admin/livres')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/livres" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-orange mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux livres
      </Link>
      <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark mb-6">Nouveau livre</h1>

      {error && (
        <div className="p-4 rounded-xl mb-6 text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-brand-cream-dark p-6 space-y-5">
        <div>
          <label className="label">Titre *</label>
          <input name="nom" required className="input-field" placeholder="Titre du livre" value={form.nom} onChange={handleChange} />
        </div>

        <div>
          <label className="label">Description *</label>
          <textarea name="description" required rows={4} className="input-field resize-none" placeholder="Description du livre" value={form.description} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Prix (FCFA) *</label>
            <input name="prix" type="number" required min="0" className="input-field" placeholder="8500" value={form.prix} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Stock *</label>
            <input name="stock" type="number" required min="0" className="input-field" placeholder="24" value={form.stock} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="label">Catégorie *</label>
          <select name="categorieId" required className="input-field" value={form.categorieId} onChange={handleChange}>
            <option value="">Sélectionner une catégorie</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Auteurs</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {auteurs.map(a => (
              <button key={a.id} type="button" onClick={() => toggleAuteur(a.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedAuteurs.includes(a.id)
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                    : 'border-brand-cream-dark text-brand-muted hover:border-brand-orange/50'
                }`}>
                {a.nom}
              </button>
            ))}
          </div>
        </div>

        <ImageUpload
          value={form.couverture}
          onChange={(url) => setForm(f => ({ ...f, couverture: url }))}
        />

        <div>
          <label className="label">Slug (optionnel)</label>
          <input name="slug" className="input-field" placeholder="titre-du-livre" value={form.slug} onChange={handleChange} />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Création…' : 'Créer le livre'}
          </button>
          <Link href="/admin/livres" className="btn-ghost text-sm">Annuler</Link>
        </div>
      </form>
    </div>
  )
}
