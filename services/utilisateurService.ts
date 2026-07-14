import apiClient from '@/lib/apiClient'
import { Utilisateur, PageResponse, PageParams } from '@/types'

const BASE = '/v1/utilisateurs'

export const utilisateurService = {
  async getAll(params?: PageParams): Promise<PageResponse<Utilisateur>> {
    const res = await apiClient.get<PageResponse<Utilisateur>>(BASE, { params })
    return res.data
  },

  async getById(id: number): Promise<Utilisateur> {
    const res = await apiClient.get<Utilisateur>(`${BASE}/${id}`)
    return res.data
  },

  async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    const res = await apiClient.put<Utilisateur>(`${BASE}/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`)
  },
}
