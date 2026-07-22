'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, BookOpen, Users, AlertTriangle, TrendingUp,
  Clock, CheckCircle, Truck, XCircle, ArrowRight,
} from 'lucide-react'
import { commandeService } from '@/services/commandeService'
import { livreService } from '@/services/livreService'
import { utilisateurService } from '@/services/utilisateurService'
import { CommandeStatut } from '@/types'

interface Stats {
  commandesAttente: number
  commandesValidees: number
  commandesEnLivraison: number
  commandesLivrees: number
  commandesAnnulees: number
  totalClients: number
  stockBas: number
  totalLivres: number
  totalVentes: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    commandesAttente: 0, commandesValidees: 0, commandesEnLivraison: 0,
    commandesLivrees: 0, commandesAnnulees: 0,
    totalClients: 0, stockBas: 0, totalLivres: 0, totalVentes: 0,
  })
  const [recentCommandes, setRecentCommandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [cmdPage, livrePage, userPage] = await Promise.all([
          commandeService.getAll({ page: 0, size: 1000 }),
          livreService.getAll({ page: 0, size: 1000 }),
          utilisateurService.getAll({ page: 0, size: 1000 }),
        ])

        const commandes = cmdPage.content
        const statuts: Record<CommandeStatut, number> = {
          EN_ATTENTE: 0, VALIDEE: 0, EN_LIVRAISON: 0, LIVREE: 0, ANNULEE: 0,
        }
        let totalVentes = 0
        for (const c of commandes) {
          statuts[c.statut] = (statuts[c.statut] || 0) + 1
          if (c.statut !== 'ANNULEE') totalVentes += c.montantTotal || 0
        }

        setStats({
          commandesAttente: statuts.EN_ATTENTE,
          commandesValidees: statuts.VALIDEE,
          commandesEnLivraison: statuts.EN_LIVRAISON,
          commandesLivrees: statuts.LIVREE,
          commandesAnnulees: statuts.ANNULEE,
          totalClients: userPage.totalElements,
          stockBas: livrePage.content.filter(l => l.stock > 0 && l.stock <= 5).length,
          totalLivres: livrePage.totalElements,
          totalVentes,
        })

        setRecentCommandes(
          commandes
            .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
            .slice(0, 5)
        )
      } catch {
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-brand-muted">Chargement du tableau de bord…</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-dark mb-6">Tableau de bord</h1>

      {/* Stats principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <CarteStat
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Commandes en attente"
          value={stats.commandesAttente}
          color="#F59E0B"
          href="/admin/commandes"
        />
        <CarteStat
          icon={<Users className="w-5 h-5" />}
          label="Clients"
          value={stats.totalClients}
          color="#3B82F6"
          href="/admin/utilisateurs"
        />
        <CarteStat
          icon={<BookOpen className="w-5 h-5" />}
          label="Livres en catalogue"
          value={stats.totalLivres}
          color="#C8A24A"
          href="/admin/livres"
        />
        <CarteStat
          icon={<TrendingUp className="w-5 h-5" />}
          label="Ventes totales"
          value={`${stats.totalVentes.toLocaleString()} FCFA`}
          color="#22C55E"
        />
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <MiniStat icon={<Clock className="w-4 h-4" />} label="En attente" value={stats.commandesAttente} color="#F59E0B" />
        <MiniStat icon={<CheckCircle className="w-4 h-4" />} label="Validées" value={stats.commandesValidees} color="#3B82F6" />
        <MiniStat icon={<Truck className="w-4 h-4" />} label="En livraison" value={stats.commandesEnLivraison} color="#7C3AED" />
        <MiniStat icon={<XCircle className="w-4 h-4" />} label="Annulées" value={stats.commandesAnnulees} color="#EF4444" />
      </div>

      {/* Alert stock bas */}
      {stats.stockBas > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-8 border"
          style={{ background: '#FEF3C7', borderColor: '#FDE68A' }}>
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{stats.stockBas} livre{stats.stockBas > 1 ? 's' : ''}</strong> avec un stock bas (≤ 5 exemplaires).
          </p>
          <Link href="/admin/livres" className="ml-auto text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
            Voir <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Commandes récentes */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-cream-dark">
          <h2 className="font-serif font-bold text-brand-dark">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-xs font-semibold text-brand-orange hover:underline flex items-center gap-1">
            Tout voir <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentCommandes.length === 0 ? (
          <p className="px-6 py-10 text-sm text-brand-muted text-center">Aucune commande pour le moment.</p>
        ) : (
          <div className="divide-y divide-brand-cream-dark">
            {recentCommandes.map((cmd) => (
              <Link key={cmd.id} href={`/admin/commandes/${cmd.id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-brand-cream/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Commande #{cmd.id}</p>
                  <p className="text-xs text-brand-muted">
                    {new Date(cmd.dateCommande).toLocaleDateString('fr-FR')} — Client #{cmd.utilisateurId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-dark">{(cmd.montantTotal || 0).toLocaleString()} FCFA</p>
                  <StatutPill statut={cmd.statut} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CarteStat({ icon, label, value, color, href }: {
  icon: React.ReactNode; label: string; value: string | number; color: string; href?: string
}) {
  const content = (
    <div className="bg-white rounded-xl p-5 border border-brand-cream-dark hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-brand-dark font-serif">{value}</p>
      <p className="text-xs text-brand-muted mt-1">{label}</p>
    </div>
  )
  return href ? <Link href={href}>{content}</Link> : content
}

function MiniStat({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: number; color: string
}) {
  return (
    <div className="bg-white rounded-xl px-4 py-3 border border-brand-cream-dark flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-brand-dark">{value}</p>
        <p className="text-[10px] text-brand-muted">{label}</p>
      </div>
    </div>
  )
}

function StatutPill({ statut }: { statut: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    EN_ATTENTE: { label: 'En attente', bg: '#FEF3C7', text: '#92400E' },
    VALIDEE: { label: 'Validée', bg: '#DBEAFE', text: '#1E40AF' },
    EN_LIVRAISON: { label: 'En livraison', bg: '#EDE9FE', text: '#6D28D9' },
    LIVREE: { label: 'Livrée', bg: '#F0FDF4', text: '#166534' },
    ANNULEE: { label: 'Annulée', bg: '#FEE2E2', text: '#991B1B' },
  }
  const c = map[statut] || { label: statut, bg: '#F3F4F6', text: '#374151' }
  return (
    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  )
}
