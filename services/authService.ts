import apiClient from '@/lib/apiClient'
import { setToken, setRefreshToken, setStoredUser, removeToken } from '@/lib/auth'
import { AuthResponse, LoginRequest, RegisterRequest, Utilisateur } from '@/types'

const BASE = '/v1/auth'

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(`${BASE}/login`, data)
    const { accessToken, refreshToken, utilisateur } = res.data
    setToken(accessToken)
    if (refreshToken) setRefreshToken(refreshToken)
    setStoredUser(utilisateur)
    try {
      document.cookie = `ll_token=${accessToken}; path=/; SameSite=Strict`
      document.cookie = `ll_role=${utilisateur.role}; path=/; SameSite=Strict`
    } catch (e) {}
    return res.data
  },

  async register(data: RegisterRequest): Promise<Utilisateur> {
    const res = await apiClient.post<Utilisateur>(`${BASE}/register`, data)
    return res.data
  },

  async refresh(refreshToken: string): Promise<string> {
    const res = await apiClient.post<{ accessToken: string }>(`${BASE}/refresh`, { refreshToken })
    setToken(res.data.accessToken)
    return res.data.accessToken
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${BASE}/logout`)
    } finally {
      removeToken()
      document.cookie = 'll_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'll_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  },

  async me(): Promise<Utilisateur> {
    const res = await apiClient.get<Utilisateur>(`${BASE}/me`)
    return res.data
  },
}
