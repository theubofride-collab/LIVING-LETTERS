import apiClient from '@/lib/apiClient'
import { Commentaire, PageParams } from '@/types'

export const commentaireService = {
  async getByLivre(livreId: number, params?: PageParams): Promise<Commentaire[]> {
    const res = await apiClient.get<Commentaire[]>(`/v1/livres/${livreId}/commentaires`, { params })
    return res.data
  },

  async create(livreId: number, data: Pick<Commentaire, 'note' | 'commentaire'>): Promise<Commentaire> {
    const res = await apiClient.post<Commentaire>(`/v1/livres/${livreId}/commentaires`, data)
    return res.data
  },

  async update(id: number, data: Pick<Commentaire, 'note' | 'commentaire'>): Promise<Commentaire> {
    const res = await apiClient.put<Commentaire>(`/v1/commentaires/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/v1/commentaires/${id}`)
  },
}
