'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { utilisateurService } from '@/services/utilisateurService'
import { Utilisateur, PageResponse, UserRole } from '@/types'
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, Shield, User } from 'lucide-react'

export default function AdminUtilisateursPage() {
  const [pageData, setPageData] = useState<PageResponse<Utilisateur> | null>(null)
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 10

  const load = async (p: number) => {
    setLoading(true)
    try {
      const data = await utilisateurService.getAll({ page: p, size: PAGE_SIZE })
      setPageData(data)
      setUtilisateurs(data.content)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = async (u: Utilisateur) => {
    if (!confirm(`Supprimer l'utilisateur "${u.nom}" (${u.email}) ? Cette action est irréversible.`)) return
    await utilisateurService.delete(u.id)
    setUtilisateurs(prev => prev.filter(x => x.id !== u.id))
  }

  const filtered = search
    ? utilisateurs.filter(u =>
        u.nom.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : utilisateurs

  const totalPages = pageData?.totalPages || 1

  return (
    <div>
      <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark mb-6">Utilisateurs</h1>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input
          type="search"
          placeholder="Rechercher par nom ou email…"
          className="input-field pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brand-muted">Aucun utilisateur trouvé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream text-brand-muted text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Nom</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Sexe</th>
                  <th className="text-left px-4 py-3 font-semibold">Rôle</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                          u.role === 'ADMIN' ? 'bg-brand-dark' : ''
                        }`} style={u.role !== 'ADMIN' ? { background: 'linear-gradient(135deg, #EA580C, #9A3412)' } : {}}>
                          {u.role === 'ADMIN' ? <Shield className="w-4 h-4" /> : u.nom.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark">{u.nom}</p>
                          <p className="text-xs text-brand-muted sm:hidden">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3 text-brand-muted hidden md:table-cell">{u.sexe === 'M' ? 'Homme' : 'Femme'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'ADMIN'
                          ? 'bg-brand-dark/10 text-brand-dark'
                          : 'bg-brand-orange/10 text-brand-orange'
                      }`}>
                        {u.role === 'ADMIN' ? 'Admin' : 'Client'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/utilisateurs?edit=${u.id}`}
                          className="p-2 rounded-lg hover:bg-brand-cream transition-colors" title="Voir / Modifier">
                          <Pencil className="w-4 h-4 text-brand-muted" />
                        </Link>
                        <button onClick={() => handleDelete(u)}
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
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-brand-cream-dark">
            <p className="text-xs text-brand-muted">
              Page {page + 1} sur {totalPages} — {pageData?.totalElements || 0} utilisateur(s)
            </p>
            <div className="flex items-center gap-1">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg hover:bg-brand-cream disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg hover:bg-brand-cream disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline edit panel via URL query — simple implementation */}
      <EditPanel />
    </div>
  )
}

function EditPanel() {
  const [userId, setUserId] = useState<number | null>(null)
  const [user, setUser] = useState<Utilisateur | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const editId = params.get('edit')
    if (editId) {
      setUserId(Number(editId))
      setLoading(true)
      utilisateurService.getById(Number(editId))
        .then(setUser)
        .catch(() => setError('Utilisateur introuvable.'))
        .finally(() => setLoading(false))
    }
  }, [])

  if (!userId || loading) return null
  if (!user) return null

  const handleRoleChange = async (newRole: UserRole) => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const updated = await utilisateurService.update(user.id, { role: newRole })
      setUser(updated)
      setSuccess('Rôle mis à jour avec succès.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Erreur.')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => { window.history.replaceState({}, '', '/admin/utilisateurs'); setUserId(null) }} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
        <h2 className="font-serif text-xl font-bold text-brand-dark mb-4">Modifier l'utilisateur</h2>

        {error && <div className="p-3 rounded-xl mb-4 text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>}
        {success && <div className="p-3 rounded-xl mb-4 text-sm text-green-700 bg-green-50 border border-green-200">{success}</div>}

        <div className="space-y-3 mb-6">
          <div>
            <p className="text-xs text-brand-muted">Nom</p>
            <p className="font-semibold text-brand-dark">{user.nom}</p>
          </div>
          <div>
            <p className="text-xs text-brand-muted">Email</p>
            <p className="font-semibold text-brand-dark">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-brand-muted">Sexe</p>
            <p className="font-semibold text-brand-dark">{user.sexe === 'M' ? 'Homme' : 'Femme'}</p>
          </div>
          <div>
            <p className="text-xs text-brand-muted mb-1">Rôle</p>
            <div className="flex gap-2">
              <button disabled={saving} onClick={() => handleRoleChange('CLIENT')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all disabled:opacity-60 ${
                  user.role === 'CLIENT'
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                    : 'border-brand-cream-dark text-brand-muted hover:border-brand-orange/50'
                }`}>
                <User className="w-4 h-4 inline mr-1" /> Client
              </button>
              <button disabled={saving} onClick={() => handleRoleChange('ADMIN')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all disabled:opacity-60 ${
                  user.role === 'ADMIN'
                    ? 'border-brand-dark bg-brand-dark/10 text-brand-dark'
                    : 'border-brand-cream-dark text-brand-muted hover:border-brand-dark/50'
                }`}>
                <Shield className="w-4 h-4 inline mr-1" /> Admin
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => { window.history.replaceState({}, '', '/admin/utilisateurs'); setUserId(null) }}
          className="btn-ghost text-sm w-full justify-center">
          Fermer
        </button>
      </div>
    </div>
  )
}
