import apiClient from '@/lib/apiClient'
import { Panier, ContenuPanier } from '@/types'

const BASE = '/v1/panier'

export const panierService = {
  async getPanier(): Promise<Panier> {
    const res = await apiClient.get<Panier>(BASE)
    return res.data
  },

  async addItem(livreId: number, qte: number): Promise<ContenuPanier> {
    const res = await apiClient.post<ContenuPanier>(`${BASE}/items`, { livreId, qte })
    return res.data
  },

  async updateItem(itemId: number, qte: number): Promise<ContenuPanier> {
    const res = await apiClient.put<ContenuPanier>(`${BASE}/items/${itemId}`, { qte })
    return res.data
  },

  async removeItem(itemId: number): Promise<void> {
    await apiClient.delete(`${BASE}/items/${itemId}`)
  },
}
