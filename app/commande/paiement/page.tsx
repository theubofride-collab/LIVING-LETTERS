'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Smartphone, Check } from 'lucide-react'

const MOYENS_PAIEMENT = [
  { id: 'MOMO', label: 'MTN Mobile Money', color: '#FCD34D', icon: '📱' },
  { id: 'ORANGE_MONEY', label: 'Orange Money', color: '#F97316', icon: '🟠' },
]

export default function CommandePaiementPage() {
  const [moyen, setMoyen] = useState<string | null>(null)
  const [numero, setNumero] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePayer = async () => {
    if (!moyen || !numero) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    window.location.href = '/commande/confirmation'
  }

  return (
    <div className="min-h-screen py-10" style={{ background: '#FFF5EC' }}>
      <div className="container-brand max-w-2xl">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {['Adresse', 'Paiement', 'Confirmation'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${i <= 1 ? '' : 'opacity-40'}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: i <= 1 ? '#EA580C' : '#E8E0D4', color: i <= 1 ? '#C8A24A' : '#7A6355' }}>
                  {i === 0 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-semibold ${i === 1 ? 'text-brand-orange' : i === 0 ? 'text-brand-muted' : 'text-brand-muted'}`}>{step}</span>
              </div>
              {i < 2 && <div className="flex-1 h-px bg-brand-cream-dark mx-2 w-8" />}
            </div>
          ))}
        </div>

        <h1 className="font-serif text-2xl font-bold text-brand-dark mb-6">Paiement</h1>

        {/* Récap montant */}
        <div className="card-flat p-4 mb-6 flex justify-between items-center">
          <span className="text-sm text-brand-muted">Total à payer</span>
          <span className="font-serif text-2xl font-bold" style={{ color: '#EA580C' }}>27 500 FCFA</span>
        </div>

        {/* Choix mode de paiement */}
        <div className="mb-6">
          <p className="label mb-3">Mode de paiement</p>
          <div className="grid grid-cols-2 gap-3">
            {MOYENS_PAIEMENT.map((m) => (
              <button key={m.id} id={`pay-${m.id}`}
                onClick={() => setMoyen(m.id)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${moyen === m.id ? 'border-brand-orange' : 'border-brand-cream-dark bg-white hover:border-brand-or/50'}`}
                style={moyen === m.id ? { background: '#FFF8F0' } : { background: 'white' }}>
                <span className="text-3xl">{m.icon}</span>
                <span className="text-sm font-semibold text-brand-dark">{m.label}</span>
                {moyen === m.id && <Check className="w-4 h-4 text-brand-orange" />}
              </button>
            ))}
          </div>
        </div>

        {/* Numéro de téléphone */}
        {moyen && (
          <div className="mb-6 animate-slide-up">
            <label className="label" htmlFor="paiement-numero">
              <Smartphone className="inline w-4 h-4 mr-1" />
              Numéro {moyen === 'MOMO' ? 'MTN MoMo' : 'Orange Money'}
            </label>
            <input
              id="paiement-numero"
              type="tel"
              placeholder="Ex: 6 70 00 00 00"
              className="input-field"
              value={numero}
              onChange={e => setNumero(e.target.value)}
            />
            <p className="text-xs text-brand-muted mt-2">
              Vous recevrez une demande de paiement sur ce numéro. Confirmez depuis votre téléphone.
            </p>
          </div>
        )}

        {/* Sécurité */}
        <div className="p-4 rounded-xl mb-6 flex items-center gap-3"
          style={{ background: 'rgba(110,30,43,0.05)', border: '1px solid rgba(110,30,43,0.1)' }}>
          <span className="text-2xl">🔒</span>
          <p className="text-xs text-brand-muted">Paiement sécurisé. Vos données sont protégées et ne sont jamais stockées sur nos serveurs.</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Link href="/commande/adresse" className="btn-ghost gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <button
            id="paiement-confirmer"
            onClick={handlePayer}
            disabled={!moyen || !numero || loading}
            className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Traitement en cours…' : 'Confirmer le paiement'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
