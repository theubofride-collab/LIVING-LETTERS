'use client'
import { useState, useEffect } from 'react'
import { User, Save } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import { setStoredUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function ProfilPage() {
  const { user, setUser } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({
    nom: '',
    email: '',
    sexe: 'M' as 'M' | 'F',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setForm({
        nom: user.nom,
        email: user.email,
        sexe: user.sexe,
      })
      setLoading(false)
    } else {
      authService.me()
        .then(u => {
          setForm({ nom: u.nom, email: u.email, sexe: u.sexe })
          setStoredUser(u)
          setUser(u)
        })
        .catch(() => router.push('/connexion'))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const updated = { ...user, nom: form.nom, email: form.email, sexe: form.sexe }
      setStoredUser(updated)
      setUser(updated)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
          {form.nom ? form.nom.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-dark">{form.nom}</h1>
          <p className="text-sm text-brand-muted">{form.email}</p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl mb-6 text-sm text-green-700 bg-green-50 border border-green-200">
          Profil mis à jour avec succès !
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
