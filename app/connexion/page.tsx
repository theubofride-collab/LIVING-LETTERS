'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { authService } from '@/services/authService'
import { useRouter } from 'next/navigation'

export default function ConnexionPage() {
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await authService.login(form)
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panneau gauche — décoratif */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 text-center"
        style={{ background: 'linear-gradient(135deg, #EA580C 0%, #9A3412 50%, #1C1410 100%)' }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-2 border-brand-or/40"
          style={{ background: 'rgba(200,162,74,0.15)' }}>
          <BookOpen className="w-10 h-10 text-brand-or" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-white mb-4">Living Letters</h2>
        <p className="text-white/60 leading-relaxed max-w-sm">
          Connectez-vous pour accéder à votre compte, suivre vos commandes et profiter de tous nos services.
        </p>
        <p className="mt-8 font-serif text-base italic text-white/40 max-w-xs leading-relaxed">
          "Read, Think and Become"
        </p>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex items-center justify-center p-6 lg:p-12" style={{ background: '#FFF5EC' }}>
        <div className="w-full max-w-md">
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Bon retour !</h1>
          <p className="text-brand-muted mb-8">Connectez-vous à votre compte Living Letters.</p>

          {error && (
            <div className="p-4 rounded-xl mb-6 text-sm text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="connexion-email">Adresse email</label>
              <input id="connexion-email" type="email" required className="input-field"
                placeholder="votre@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="label" htmlFor="connexion-mdp">Mot de passe</label>
              <div className="relative">
                <input id="connexion-mdp" type={showPwd ? 'text' : 'password'} required className="input-field pr-11"
                  placeholder="Votre mot de passe"
                  value={form.motDePasse}
                  onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-orange transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" id="connexion-submit" disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-brand-muted">
            Pas encore de compte ?{' '}
            <Link href="/inscription" className="font-semibold text-brand-orange hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
