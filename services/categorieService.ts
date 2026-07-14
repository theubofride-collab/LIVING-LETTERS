import apiClient from '@/lib/apiClient'
import { Categorie } from '@/types'

const BASE = '/v1/categories'

export const categorieService = {
  async getAll(): Promise<Categorie[]> {
    const res = await apiClient.get<Categorie[]>(BASE)
    return res.data
  },

  async getById(id: number): Promise<Categorie> {
    const res = await apiClient.get<Categorie>(`${BASE}/${id}`)
    return res.data
  },

  async create(data: Omit<Categorie, 'id'>): Promise<Categorie> {
    const res = await apiClient.post<Categorie>(BASE, data)
    return res.data
  },

  async update(id: number, data: Partial<Categorie>): Promise<Categorie> {
    const res = await apiClient.put<Categorie>(`${BASE}/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`)
  },
}
