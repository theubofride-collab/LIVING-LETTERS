import apiClient from '@/lib/apiClient'
import { Paiement, PaiementRequest } from '@/types'

export const paiementService = {
  async payer(commandeId: number, data: PaiementRequest): Promise<Paiement> {
    const res = await apiClient.post<Paiement>(`/v1/commandes/${commandeId}/paiement`, data)
    return res.data
  },
}
