'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Plus, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { MOCK_ADRESSES } from '@/lib/mockData'
import { AdresseLivraison } from '@/types'

export default function CommandeAdressePage() {
  const [selected, setSelected] = useState<number | null>(MOCK_ADRESSES[0]?.id ?? null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ rue: '', ville: '', pays: 'Cameroun' })

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

        {/* Adresses sauvegardées */}
        <div className="space-y-3 mb-6">
          {MOCK_ADRESSES.map((addr) => (
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

        {/* Nouvelle adresse */}
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
                <button className="btn-primary flex-1" onClick={() => setShowForm(false)}>Enregistrer</button>
                <button className="btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <Link href="/panier" className="btn-ghost gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour au panier
          </Link>
          <Link href="/commande/paiement" id="adresse-suivant"
            className={`btn-primary gap-2 ${!selected ? 'opacity-50 pointer-events-none' : ''}`}>
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
