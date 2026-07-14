import apiClient from '@/lib/apiClient'
import { Commande, PageResponse, PageParams, PasserCommandeRequest, StatutRequest } from '@/types'

const BASE = '/v1/commandes'

export const commandeService = {
  async passerCommande(data: PasserCommandeRequest): Promise<Commande> {
    const res = await apiClient.post<Commande>(BASE, data)
    return res.data
  },

  async getAll(params?: PageParams): Promise<PageResponse<Commande>> {
    const res = await apiClient.get<PageResponse<Commande>>(BASE, { params })
    return res.data
  },

  async getById(id: number): Promise<Commande> {
    const res = await apiClient.get<Commande>(`${BASE}/${id}`)
    return res.data
  },

  async updateStatut(id: number, data: StatutRequest): Promise<Commande> {
    const res = await apiClient.patch<Commande>(`${BASE}/${id}/statut`, data)
    return res.data
  },

  async annuler(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`)
  },
}
