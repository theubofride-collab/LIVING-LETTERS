import apiClient from '@/lib/apiClient'
import { AdresseLivraison } from '@/types'

const BASE = '/v1/adresses'

export const adresseService = {
  async getAll(): Promise<AdresseLivraison[]> {
    const res = await apiClient.get<AdresseLivraison[]>(BASE)
    return res.data
  },

  async getById(id: number): Promise<AdresseLivraison> {
    const res = await apiClient.get<AdresseLivraison>(`${BASE}/${id}`)
    return res.data
  },

  async create(data: Omit<AdresseLivraison, 'id'>): Promise<AdresseLivraison> {
    const res = await apiClient.post<AdresseLivraison>(BASE, data)
    return res.data
  },

  async update(id: number, data: Partial<AdresseLivraison>): Promise<AdresseLivraison> {
    const res = await apiClient.put<AdresseLivraison>(`${BASE}/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`)
  },
}
