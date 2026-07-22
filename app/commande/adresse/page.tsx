'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { adresseService } from '@/services/adresseService'
import { AdresseLivraison } from '@/types'

export default function CommandeAdressePage() {
  const router = useRouter()
  const [adresses, setAdresses] = useState<AdresseLivraison[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ rue: '', ville: '', pays: 'Cameroun' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adresseService.getAll()
      .then(data => {
        setAdresses(data)
        if (data.length > 0) setSelected(data[0].id)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSaveAddress = async () => {
    if (!form.rue || !form.ville) return
    setSaving(true)
    try {
      const created = await adresseService.create({ rue: form.rue, ville: form.ville, pays: form.pays })
      setAdresses(prev => [...prev, created])
      setSelected(created.id)
      setShowForm(false)
      setForm({ rue: '', ville: '', pays: 'Cameroun' })
    } catch {} finally {
      setSaving(false)
    }
  }

  const handleContinue = () => {
    if (!selected) return
    sessionStorage.setItem('commande_adresseId', String(selected))
    router.push('/commande/paiement')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF5EC' }}>
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10" style={{ background: '#FFF5EC' }}>
      <div className="container-brand max-w-2xl">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {['Adresse', 'Paiement', 'Confirmation'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${i === 0 ? '' : 'opacity-40'}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: i === 0 ? '#EA580C' : '#E8E0D4', color: i === 0 ? '#C8A24A' : '#7A6355' }}>
                  {i + 1}
                </div>
                <span className={`text-sm font-semibold ${i === 0 ? 'text-brand-orange' : 'text-brand-muted'}`}>{step}</span>
              </div>
              {i < 2 && <div className="flex-1 h-px bg-brand-cream-dark mx-2 w-8" />}
            </div>
          ))}
        </div>

        <h1 className="font-serif text-2xl font-bold text-brand-dark mb-6">Adresse de livraison</h1>

        {adresses.length === 0 && !showForm ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-brand-muted mx-auto mb-3" />
            <p className="text-brand-muted mb-4">Aucune adresse enregistrée. Ajoutez une adresse pour continuer.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Ajouter une adresse
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {adresses.map((addr) => (
              <button key={addr.id} id={`addr-${addr.id}`}
                onClick={() => setSelected(addr.id)}
                className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${selected === addr.id ? 'border-brand-orange bg-white' : 'border-brand-cream-dark bg-white hover:border-brand-or/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${selected === addr.id ? 'bg-brand-orange' : 'bg-brand-cream-dark'}`}>
                  {selected === addr.id ? <Check className="w-4 h-4 text-brand-or" /> : <MapPin className="w-4 h-4 text-brand-muted" />}
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">{addr.rue}</p>
                  <p className="text-sm text-brand-muted">{addr.ville}, {addr.pays}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {!showForm ? (
          <button id="btn-nouvelle-adresse" onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-brand-cream-dark text-sm font-medium text-brand-muted hover:border-brand-or hover:text-brand-orange transition-all">
            <Plus className="w-4 h-4" /> Ajouter une nouvelle adresse
          </button>
        ) : (
          <div className="card-flat p-5 animate-slide-up">
            <h3 className="font-serif font-bold text-brand-dark mb-4">Nouvelle adresse</h3>
            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="new-rue">Rue / Quartier</label>
                <input id="new-rue" className="input-field" placeholder="Ex: Quartier Bastos, Rue 1.200"
                  value={form.rue} onChange={e => setForm(f => ({ ...f, rue: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="new-ville">Ville</label>
                  <input id="new-ville" className="input-field" placeholder="Yaoundé"
                    value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} />
                </div>
                <div>
                  <label className="label" htmlFor="new-pays">Pays</label>
                  <input id="new-pays" className="input-field"
                    value={form.pays} onChange={e => setForm(f => ({ ...f, pays: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary flex-1" disabled={saving} onClick={handleSaveAddress}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button className="btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Link href="/panier" className="btn-ghost gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour au panier
          </Link>
          <button onClick={handleContinue}
            className={`btn-primary gap-2 ${!selected ? 'opacity-50 pointer-events-none' : ''}`}>
            Continuer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
