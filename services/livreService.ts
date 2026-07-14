import apiClient from '@/lib/apiClient'
import { Livre, LivreFilters, PageResponse } from '@/types'

const BASE = '/v1/livres'

export const livreService = {
  async getAll(filters?: LivreFilters): Promise<PageResponse<Livre>> {
    const res = await apiClient.get<PageResponse<Livre>>(BASE, { params: filters })
    return res.data
  },

  async getById(id: number): Promise<Livre> {
    const res = await apiClient.get<Livre>(`${BASE}/${id}`)
    return res.data
  },

  async getBySlug(slug: string): Promise<Livre> {
    const res = await apiClient.get<Livre>(`${BASE}/slug/${slug}`)
    return res.data
  },

  async create(data: Partial<Livre>): Promise<Livre> {
    const res = await apiClient.post<Livre>(BASE, data)
    return res.data
  },

  async update(id: number, data: Partial<Livre>): Promise<Livre> {
    const res = await apiClient.put<Livre>(`${BASE}/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`)
  },
}
