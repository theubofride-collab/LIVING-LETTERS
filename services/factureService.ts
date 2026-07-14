import apiClient from '@/lib/apiClient'
import { Facture } from '@/types'

const BASE = '/v1/factures'

export const factureService = {
  async getAll(): Promise<Facture[]> {
    const res = await apiClient.get<Facture[]>(BASE)
    return res.data
  },

  async getById(id: number): Promise<Facture> {
    const res = await apiClient.get<Facture>(`${BASE}/${id}`)
    return res.data
  },

  async downloadPdf(id: number): Promise<Blob> {
    const res = await apiClient.get(`${BASE}/${id}/pdf`, { responseType: 'blob' })
    return res.data as Blob
  },

  async generer(commandeId: number): Promise<Facture> {
    const res = await apiClient.post<Facture>(`/v1/commandes/${commandeId}/facture`)
    return res.data
  },
}
