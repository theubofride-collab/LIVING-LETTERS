'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { authService } from '@/services/authService'
import { useRouter } from 'next/navigation'

export default function InscriptionPage() {
  const [form, setForm] = useState({ nom: '', email: '', motDePasse: '', sexe: 'M' as 'M' | 'F', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.motDePasse !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true); setError('')
    try {
      await authService.register({ nom: form.nom, email: form.email, motDePasse: form.motDePasse, sexe: form.sexe })
      router.push('/')
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panneau gauche */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 text-center"
        style={{ background: 'linear-gradient(135deg, #EA580C 0%, #9A3412 50%, #1C1410 100%)' }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-2 border-brand-or/40"
          style={{ background: 'rgba(200,162,74,0.15)' }}>
          <BookOpen className="w-10 h-10 text-brand-or" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-white mb-4">Rejoignez-nous</h2>
        <p className="text-white/60 leading-relaxed max-w-sm">
          Créez votre compte gratuit et accédez à notre catalogue, suivez vos commandes et rejoignez notre club de lecture.
        </p>
        <p className="mt-8 font-serif italic text-white/40 text-sm max-w-xs">
          "La connaissance qui vient de Dieu — El Deah"
        </p>
      </div>

      {/* Panneau droit */}
      <div className="flex items-center justify-center p-6 lg:p-12" style={{ background: '#FFF5EC' }}>
        <div className="w-full max-w-md">
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Créer un compte</h1>
          <p className="text-brand-muted mb-8">Rejoignez la communauté Living Letters.</p>

          {error && (
            <div className="p-4 rounded-xl mb-6 text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="inscription-nom">Nom complet</label>
                <input id="inscription-nom" type="text" required className="input-field"
                  placeholder="Marie Nkomo"
                  value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
              </div>
              <div>
                <label className="label" htmlFor="inscription-sexe">Sexe</label>
                <select id="inscription-sexe" className="input-field"
                  value={form.sexe} onChange={e => setForm(f => ({ ...f, sexe: e.target.value as 'M' | 'F' }))}>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="inscription-email">Adresse email</label>
              <input id="inscription-email" type="email" required className="input-field"
                placeholder="votre@email.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="label" htmlFor="inscription-mdp">Mot de passe</label>
              <div className="relative">
                <input id="inscription-mdp" type={showPwd ? 'text' : 'password'} required minLength={8} className="input-field pr-11"
                  placeholder="Minimum 8 caractères"
                  value={form.motDePasse} onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="inscription-confirm">Confirmer le mot de passe</label>
              <input id="inscription-confirm" type="password" required className="input-field"
                placeholder="Répétez le mot de passe"
                value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
            </div>

            <button type="submit" id="inscription-submit" disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60">
              {loading ? 'Création en cours…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-brand-muted">
            Déjà un compte ?{' '}
            <Link href="/connexion" className="font-semibold text-brand-orange hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
