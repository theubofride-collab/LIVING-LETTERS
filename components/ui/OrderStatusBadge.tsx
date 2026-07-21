import { CommandeStatut } from '@/types'

const STATUS_CONFIG: Record<CommandeStatut, { label: string; bg: string; text: string; dot: string }> = {
  EN_ATTENTE:    { label: 'En attente',    bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  VALIDEE:       { label: 'Validée',       bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  EN_LIVRAISON:  { label: 'En livraison',  bg: '#EDE9FE', text: '#6D28D9', dot: '#7C3AED' },
  LIVREE:        { label: 'Livrée',        bg: '#F0FDF4', text: '#166534', dot: '#22C55E' },
  ANNULEE:       { label: 'Annulée',       bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
}

interface OrderStatusBadgeProps {
  statut: CommandeStatut
}

export default function OrderStatusBadge({ statut }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[statut]
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: config.bg, color: config.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.dot }} />
      {config.label}
    </span>
  )
}
