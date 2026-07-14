'use client'
import { useState } from 'react'
import { User, Save } from 'lucide-react'
import { MOCK_UTILISATEUR } from '@/lib/mockData'

export default function ProfilPage() {
  const [form, setForm] = useState({
    nom: MOCK_UTILISATEUR.nom,
    email: MOCK_UTILISATEUR.email,
    sexe: MOCK_UTILISATEUR.sexe,
    motDePasse: '',
    confirm: '',
  })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
          {form.nom[0]}
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-dark">{form.nom}</h1>
          <p className="text-sm text-brand-muted">{form.email}</p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl mb-6 text-sm text-green-700 bg-green-50 border border-green-200">
          ✅ Profil mis à jour avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6">
        <h2 className="font-serif text-lg font-bold text-brand-dark mb-5">Informations personnelles</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="profil-nom">Nom complet</label>
            <input id="profil-nom" type="text" className="input-field"
              value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
          </div>
          <div>
            <label className="label" htmlFor="profil-sexe">Sexe</label>
            <select id="profil-sexe" className="input-field"
              value={form.sexe} onChange={e => setForm(f => ({ ...f, sexe: e.target.value as 'M' | 'F' }))}>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="profil-email">Adresse email</label>
            <input id="profil-email" type="email" className="input-field"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
        </div>

        <hr className="my-6 border-brand-cream-dark" />
        <h2 className="font-serif text-lg font-bold text-brand-dark mb-5">Changer le mot de passe</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="profil-mdp">Nouveau mot de passe</label>
            <input id="profil-mdp" type="password" className="input-field" placeholder="Laisser vide pour ne pas changer"
              value={form.motDePasse} onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))} />
          </div>
          <div>
            <label className="label" htmlFor="profil-confirm">Confirmer</label>
            <input id="profil-confirm" type="password" className="input-field"
              value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" id="profil-save" className="btn-primary gap-2">
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  )
}
