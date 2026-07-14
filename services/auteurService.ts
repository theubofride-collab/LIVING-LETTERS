import apiClient from '@/lib/apiClient'
import { Auteur } from '@/types'

const BASE = '/v1/auteurs'

export const auteurService = {
  async getAll(): Promise<Auteur[]> {
    const res = await apiClient.get<Auteur[]>(BASE)
    return res.data
  },

  async getById(id: number): Promise<Auteur> {
    const res = await apiClient.get<Auteur>(`${BASE}/${id}`)
    return res.data
  },

  async create(data: Omit<Auteur, 'id'>): Promise<Auteur> {
    const res = await apiClient.post<Auteur>(BASE, data)
    return res.data
  },

  async update(id: number, data: Partial<Auteur>): Promise<Auteur> {
    const res = await apiClient.put<Auteur>(`${BASE}/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`)
  },
}
