'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { livreService } from '@/services/livreService'
import { categorieService } from '@/services/categorieService'
import { auteurService } from '@/services/auteurService'
import { Categorie, Auteur, Livre } from '@/types'
import ImageUpload from '@/components/ui/ImageUpload'

export default function AdminLivreEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const [categories, setCategories] = useState<Categorie[]>([])
  const [auteurs, setAuteurs] = useState<Auteur[]>([])
  const [selectedAuteurs, setSelectedAuteurs] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nom: '', description: '', stock: '', prix: '', categorieId: '', couverture: '', slug: '',
  })

  useEffect(() => {
    const numId = Number(id)
    Promise.all([
      livreService.getById(numId),
      categorieService.getAll(),
      auteurService.getAll(),
    ]).then(([livre, cats, auts]) => {
      setCategories(cats)
      setAuteurs(auts)
      setSelectedAuteurs(livre.auteurs?.map(a => a.id) || [])
      setForm({
        nom: livre.nom,
        description: livre.description,
        stock: String(livre.stock),
        prix: String(livre.prix),
        categorieId: String(livre.categorieId),
        couverture: livre.couverture || '',
        slug: livre.slug || '',
      })
    }).catch(() => setError('Impossible de charger le livre.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const toggleAuteur = (auteurId: number) => {
    setSelectedAuteurs(prev =>
      prev.includes(auteurId) ? prev.filter(a => a !== auteurId) : [...prev, auteurId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await livreService.update(Number(id), {
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
      setError(err.message || 'Erreur lors de la mise à jour.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/livres" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-orange mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux livres
      </Link>
      <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark mb-6">Modifier le livre</h1>

      {error && (
        <div className="p-4 rounded-xl mb-6 text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-brand-cream-dark p-6 space-y-5">
        <div>
          <label className="label">Titre *</label>
          <input name="nom" required className="input-field" value={form.nom} onChange={handleChange} />
        </div>

        <div>
          <label className="label">Description *</label>
          <textarea name="description" required rows={4} className="input-field resize-none" value={form.description} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Prix (FCFA) *</label>
            <input name="prix" type="number" required min="0" className="input-field" value={form.prix} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Stock *</label>
            <input name="stock" type="number" required min="0" className="input-field" value={form.stock} onChange={handleChange} />
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
          <label className="label">Slug</label>
          <input name="slug" className="input-field" value={form.slug} onChange={handleChange} />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
          <Link href="/admin/livres" className="btn-ghost text-sm">Annuler</Link>
        </div>
      </form>
    </div>
  )
}
