'use client'
import { useEffect, useState } from 'react'
import { auteurService } from '@/services/auteurService'
import { Auteur } from '@/types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function AdminAuteursPage() {
  const [auteurs, setAuteurs] = useState<Auteur[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Auteur | null>(null)
  const [form, setForm] = useState({ nom: '', description: '', profession: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await auteurService.getAll()
      setAuteurs(data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm({ nom: '', description: '', profession: '' })
    setSelected(null)
    setModal('add')
    setError('')
  }

  const openEdit = (a: Auteur) => {
    setForm({ nom: a.nom, description: a.description, profession: a.profession })
    setSelected(a)
    setModal('edit')
    setError('')
  }

  const handleDelete = async (a: Auteur) => {
    if (!confirm(`Supprimer l'auteur "${a.nom}" ?`)) return
    await auteurService.delete(a.id)
    setAuteurs(prev => prev.filter(x => x.id !== a.id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (modal === 'add') {
        const created = await auteurService.create({ nom: form.nom, description: form.description, profession: form.profession })
        setAuteurs(prev => [...prev, created])
      } else if (modal === 'edit' && selected) {
        const updated = await auteurService.update(selected.id, { nom: form.nom, description: form.description, profession: form.profession })
        setAuteurs(prev => prev.map(a => a.id === selected.id ? updated : a))
      }
      setModal(null)
    } catch (err: any) {
      setError(err.message || 'Erreur.')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark">Auteurs</h1>
        <button onClick={openAdd} className="btn-primary text-sm py-2.5">
          <Plus className="w-4 h-4" /> Nouvel auteur
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : auteurs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-cream-dark text-center py-16">
          <p className="text-brand-muted">Aucun auteur. Créez-en un !</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream text-brand-muted text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Nom</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Profession</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Description</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {auteurs.map(a => (
                  <tr key={a.id} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                          {a.nom.charAt(0)}
                        </div>
                        <p className="font-semibold text-brand-dark">{a.nom}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">
                      {a.profession}
                    </td>
                    <td className="px-4 py-3 text-brand-muted hidden md:table-cell">
                      <p className="truncate max-w-xs">{a.description}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(a)}
                          className="p-2 rounded-lg hover:bg-brand-cream transition-colors" title="Modifier">
                          <Pencil className="w-4 h-4 text-brand-muted" />
                        </button>
                        <button onClick={() => handleDelete(a)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              {modal === 'add' ? 'Nouvel auteur' : "Modifier l'auteur"}
            </h2>

            {error && (
              <div className="p-3 rounded-xl mb-4 text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nom complet *</label>
                <input required className="input-field" placeholder="Pasteur Samuel" value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
              </div>
              <div>
                <label className="label">Profession *</label>
                <input required className="input-field" placeholder="Pasteur & Auteur" value={form.profession}
                  onChange={e => setForm(f => ({ ...f, profession: e.target.value }))} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Biographie…" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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
