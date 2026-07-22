'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { factureService } from '@/services/factureService'
import { Facture } from '@/types'
import { Download, FileText, ExternalLink, Search } from 'lucide-react'

export default function AdminFacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await factureService.getAll()
      setFactures(data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDownload = async (f: Facture) => {
    setDownloadingId(f.id); setError('')
    try {
      const blob = await factureService.downloadPdf(f.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${f.numFacture}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du téléchargement.')
    } finally { setDownloadingId(null) }
  }

  const filtered = search
    ? factures.filter(f =>
        f.numFacture.toLowerCase().includes(search.toLowerCase()) ||
        String(f.commandeId).includes(search)
      )
    : factures

  return (
    <div>
      <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark mb-6">Factures</h1>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input
          type="search"
          placeholder="Rechercher par numéro de facture ou ID commande…"
          className="input-field pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-4 text-sm text-red-700 bg-red-50 border border-red-200 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
              <FileText className="w-8 h-8 text-brand-or" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-dark mb-1">Aucune facture</h3>
            <p className="text-sm text-brand-muted">Les factures sont générées depuis la page de détail d'une commande.</p>
            <Link href="/admin/commandes" className="btn-primary text-sm mt-4 inline-flex">
              Voir les commandes
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream text-brand-muted text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">N° Facture</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Heure</th>
                  <th className="text-left px-4 py-3 font-semibold">Commande</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {filtered.map(f => (
                  <tr key={f.id} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-orange flex-shrink-0" />
                        <span className="font-semibold text-brand-dark">{f.numFacture}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">
                      {f.date}
                    </td>
                    <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">
                      {f.heure}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/commandes/${f.commandeId}`}
                        className="text-brand-orange hover:underline font-semibold flex items-center gap-1">
                        #{f.commandeId}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        disabled={downloadingId === f.id}
                        onClick={() => handleDownload(f)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10 transition-all disabled:opacity-60"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {downloadingId === f.id ? '…' : 'PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Compteur */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-brand-cream-dark">
            <p className="text-xs text-brand-muted">
              {filtered.length} facture{filtered.length > 1 ? 's' : ''} au total
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
