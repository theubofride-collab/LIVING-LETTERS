'use client'
import { useEffect, useState } from 'react'
import { factureService } from '@/services/factureService'
import { Facture } from '@/types'
import { FileText, Download, Search } from 'lucide-react'

export default function CompteFacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  useEffect(() => {
    factureService.getAll()
      .then(setFactures)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (f: Facture) => {
    setDownloadingId(f.id)
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
    } catch {} finally { setDownloadingId(null) }
  }

  const filtered = search
    ? factures.filter(f =>
        f.numFacture.toLowerCase().includes(search.toLowerCase()) ||
        String(f.commandeId).includes(search)
      )
    : factures

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (factures.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
          <FileText className="w-8 h-8 text-brand-or" />
        </div>
        <h2 className="font-serif text-xl font-bold text-brand-dark mb-2">Aucune facture</h2>
        <p className="text-sm text-brand-muted">Vos factures apparaîtront ici après vos commandes.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-brand-dark mb-6">Mes factures</h1>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input type="search" placeholder="Rechercher par numéro de facture…" className="input-field pl-10"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map(f => (
          <div key={f.id} className="card-flat p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-cream">
                <FileText className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <p className="font-semibold text-brand-dark text-sm">{f.numFacture}</p>
                <p className="text-xs text-brand-muted">
                  {f.date} à {f.heure} — Commande #{f.commandeId}
                </p>
              </div>
            </div>
            <button disabled={downloadingId === f.id}
              onClick={() => handleDownload(f)}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10 transition-all disabled:opacity-60">
              <Download className="w-3.5 h-3.5" />
              {downloadingId === f.id ? '…' : 'PDF'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-brand-muted text-center mt-6">{filtered.length} facture(s)</p>
    </div>
  )
}
