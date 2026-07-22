'use client'
import { useEffect, useState } from 'react'
import { adresseService } from '@/services/adresseService'
import { AdresseLivraison } from '@/types'
import { MapPin, Plus, Pencil, Trash2, X } from 'lucide-react'

export default function CompteAdressesPage() {
  const [adresses, setAdresses] = useState<AdresseLivraison[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selected, setSelected] = useState<AdresseLivraison | null>(null)
  const [form, setForm] = useState({ rue: '', ville: '', pays: 'Cameroun' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await adresseService.getAll()
      setAdresses(data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm({ rue: '', ville: '', pays: 'Cameroun' })
    setSelected(null)
    setModal('add')
    setError('')
  }

  const openEdit = (a: AdresseLivraison) => {
    setForm({ rue: a.rue, ville: a.ville, pays: a.pays })
    setSelected(a)
    setModal('edit')
    setError('')
  }

  const handleDelete = async (a: AdresseLivraison) => {
    if (!confirm(`Supprimer l'adresse "${a.rue}, ${a.ville}" ?`)) return
    await adresseService.delete(a.id)
    setAdresses(prev => prev.filter(x => x.id !== a.id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (modal === 'add') {
        const created = await adresseService.create({ rue: form.rue, ville: form.ville, pays: form.pays })
        setAdresses(prev => [...prev, created])
      } else if (modal === 'edit' && selected) {
        const updated = await adresseService.update(selected.id, { rue: form.rue, ville: form.ville, pays: form.pays })
        setAdresses(prev => prev.map(a => a.id === selected.id ? updated : a))
      }
      setModal(null)
    } catch (err: any) {
      setError(err.message || 'Erreur.')
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Mes adresses</h1>
        <button onClick={openAdd} className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" /> Nouvelle adresse
        </button>
      </div>

      {adresses.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
            <MapPin className="w-8 h-8 text-brand-or" />
          </div>
          <h2 className="font-serif text-xl font-bold text-brand-dark mb-2">Aucune adresse</h2>
          <p className="text-sm text-brand-muted mb-4">Ajoutez une adresse de livraison pour vos commandes.</p>
          <button onClick={openAdd} className="btn-primary text-sm inline-flex">
            <Plus className="w-4 h-4" /> Ajouter une adresse
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {adresses.map(a => (
            <div key={a.id} className="card-flat p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-cream flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{a.rue}</p>
                  <p className="text-xs text-brand-muted">{a.ville}, {a.pays}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(a)}
                  className="p-2 rounded-lg hover:bg-brand-cream transition-colors" title="Modifier">
                  <Pencil className="w-4 h-4 text-brand-muted" />
                </button>
                <button onClick={() => handleDelete(a)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
            <button onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-4">
              {modal === 'add' ? 'Nouvelle adresse' : 'Modifier l\'adresse'}
            </h2>

            {error && (
              <div className="p-3 rounded-xl mb-4 text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Rue / Quartier *</label>
                <input required className="input-field" placeholder="Rue 1.234, Bastos" value={form.rue}
                  onChange={e => setForm(f => ({ ...f, rue: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Ville *</label>
                  <input required className="input-field" placeholder="Yaoundé" value={form.ville}
                    onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Pays *</label>
                  <input required className="input-field" value={form.pays}
                    onChange={e => setForm(f => ({ ...f, pays: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-60">
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button type="button" onClick={() => setModal(null)} className="btn-ghost text-sm">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
