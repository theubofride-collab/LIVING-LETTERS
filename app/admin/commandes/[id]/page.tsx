'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Download, Clock, CheckCircle, Truck, CheckCheck, XCircle } from 'lucide-react'
import { commandeService } from '@/services/commandeService'
import { factureService } from '@/services/factureService'
import { Commande, CommandeStatut, Facture } from '@/types'
import OrderStatusBadge from '@/components/ui/OrderStatusBadge'

const TRANSITIONS: Record<CommandeStatut, { to: CommandeStatut; label: string; icon: React.ReactNode }[]> = {
  EN_ATTENTE: [
    { to: 'VALIDEE', label: 'Valider la commande', icon: <CheckCircle className="w-4 h-4" /> },
    { to: 'ANNULEE', label: 'Annuler', icon: <XCircle className="w-4 h-4" /> },
  ],
  VALIDEE: [
    { to: 'EN_LIVRAISON', label: 'Mettre en livraison', icon: <Truck className="w-4 h-4" /> },
  ],
  EN_LIVRAISON: [
    { to: 'LIVREE', label: 'Marquer livrée', icon: <CheckCheck className="w-4 h-4" /> },
  ],
  LIVREE: [],
  ANNULEE: [],
}

const TIMELINE: { statut: CommandeStatut; label: string; icon: React.ReactNode }[] = [
  { statut: 'EN_ATTENTE', label: 'En attente', icon: <Clock className="w-4 h-4" /> },
  { statut: 'VALIDEE', label: 'Validée', icon: <CheckCircle className="w-4 h-4" /> },
  { statut: 'EN_LIVRAISON', label: 'En livraison', icon: <Truck className="w-4 h-4" /> },
  { statut: 'LIVREE', label: 'Livrée', icon: <CheckCheck className="w-4 h-4" /> },
]

const STATUT_ORDER: CommandeStatut[] = ['EN_ATTENTE', 'VALIDEE', 'EN_LIVRAISON', 'LIVREE']

export default function AdminCommandeDetailPage() {
  const { id } = useParams()
  const [commande, setCommande] = useState<Commande | null>(null)
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState(false)
  const [generatingFacture, setGeneratingFacture] = useState(false)
  const [facture, setFacture] = useState<Facture | null>(null)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    commandeService.getById(Number(id))
      .then(setCommande)
      .catch(() => setError('Commande introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatut = async (newStatut: CommandeStatut) => {
    if (!commande) return
    setChanging(true)
    try {
      const updated = await commandeService.updateStatut(commande.id, { statut: newStatut })
      setCommande(updated)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de statut.')
    } finally { setChanging(false) }
  }

  const handleGenererFacture = async () => {
    if (!commande) return
    setGeneratingFacture(true)
    try {
      const f = await factureService.generer(commande.id)
      setFacture(f)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération de la facture.')
    } finally { setGeneratingFacture(false) }
  }

  const handleDownloadPdf = async () => {
    if (!facture) return
    setDownloadingPdf(true)
    try {
      const blob = await factureService.downloadPdf(facture.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${facture.numFacture}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du téléchargement.')
    } finally { setDownloadingPdf(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!commande) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-muted">Commande introuvable.</p>
        <Link href="/admin/commandes" className="btn-primary mt-4 text-sm inline-flex">Retour</Link>
      </div>
    )
  }

  const currentIdx = STATUT_ORDER.indexOf(commande.statut)
  const transitionsPossibles = TRANSITIONS[commande.statut] || []

  return (
    <div className="max-w-3xl">
      <Link href="/admin/commandes" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-orange mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux commandes
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark">
          Commande #{commande.id}
        </h1>
        <OrderStatusBadge statut={commande.statut} />
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-6 text-sm text-red-700 bg-red-50 border border-red-200 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 mb-4">
        <h2 className="font-serif font-bold text-brand-dark mb-4">Statut</h2>
        <div className="flex items-center gap-0">
          {TIMELINE.map((step, idx) => {
            const isDone = STATUT_ORDER.indexOf(commande.statut) >= idx
            const isCurrent = step.statut === commande.statut
            return (
              <div key={step.statut} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isDone
                      ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                      : 'border-brand-cream-dark bg-white text-brand-muted'
                  } ${isCurrent ? 'ring-2 ring-brand-orange/30' : ''}`}>
                    {step.icon}
                  </div>
                  <span className={`text-[10px] mt-1 font-semibold text-center ${isDone ? 'text-brand-orange' : 'text-brand-muted'}`}>
                    {step.label}
                  </span>
                </div>
                {idx < TIMELINE.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded ${isDone ? 'bg-brand-orange' : 'bg-brand-cream-dark'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Infos commande */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 mb-4">
        <h2 className="font-serif font-bold text-brand-dark mb-4">Détails</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-brand-muted mb-0.5">Date</p>
            <p className="font-semibold text-brand-dark">
              {new Date(commande.dateCommande).toLocaleDateString('fr-FR')} à {new Date(commande.dateCommande).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div>
            <p className="text-brand-muted mb-0.5">Montant total</p>
            <p className="font-serif text-xl font-bold" style={{ color: '#EA580C' }}>
              {(commande.montantTotal || 0).toLocaleString()} FCFA
            </p>
          </div>
          <div>
            <p className="text-brand-muted mb-0.5">Client</p>
            <p className="font-semibold text-brand-dark">#{commande.utilisateurId}</p>
          </div>
          {commande.adresse && (
            <div>
              <p className="text-brand-muted mb-0.5">Adresse de livraison</p>
              <p className="font-semibold text-brand-dark">
                {commande.adresse.rue}, {commande.adresse.ville} ({commande.adresse.pays})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lignes de commande */}
      {commande.lignes && commande.lignes.length > 0 && (
        <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-brand-cream-dark">
            <h2 className="font-serif font-bold text-brand-dark">Articles commandés</h2>
          </div>
          <div className="divide-y divide-brand-cream-dark">
            {commande.lignes.map((ligne, idx) => (
              <div key={idx} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="font-semibold text-brand-dark text-sm">
                    {ligne.livre?.nom || `Livre #${ligne.livreId}`}
                  </p>
                  <p className="text-xs text-brand-muted">
                    {ligne.qte} × {ligne.prixUnitaire.toLocaleString()} FCFA
                  </p>
                </div>
                <p className="font-semibold text-brand-dark text-sm">
                  {(ligne.qte * ligne.prixUnitaire).toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark p-6">
        <h2 className="font-serif font-bold text-brand-dark mb-4">Actions</h2>

        {transitionsPossibles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {transitionsPossibles.map(({ to, label, icon }) => (
              <button key={to} disabled={changing}
                onClick={() => handleStatut(to)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all disabled:opacity-60 ${
                  to === 'ANNULEE'
                    ? 'border-red-300 text-red-600 hover:bg-red-50'
                    : 'border-brand-orange text-brand-orange hover:bg-brand-orange/10'
                }`}>
                {icon}
                {label}
              </button>
            ))}
          </div>
        )}

        {transitionsPossibles.length === 0 && (
          <p className="text-sm text-brand-muted mb-4">Aucune action disponible pour ce statut.</p>
        )}

        <div className="flex flex-wrap gap-2 border-t border-brand-cream-dark pt-4">
          {!facture ? (
            <button disabled={generatingFacture}
              onClick={handleGenererFacture}
              className="btn-primary text-sm disabled:opacity-60">
              <FileText className="w-4 h-4" />
              {generatingFacture ? 'Génération…' : 'Générer facture PDF'}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-green-700 font-semibold">
                Facture {facture.numFacture} générée
              </span>
              <button disabled={downloadingPdf}
                onClick={handleDownloadPdf}
                className="btn-secondary text-sm py-2 disabled:opacity-60">
                <Download className="w-4 h-4" />
                {downloadingPdf ? 'Téléchargement…' : 'Télécharger le PDF'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
