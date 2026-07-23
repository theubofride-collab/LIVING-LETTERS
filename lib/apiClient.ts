// ============================================================
// Living Letters — Client API centralisé (lib/apiClient.ts)
// - Base URL via NEXT_PUBLIC_API_URL
// - Injection automatique du token JWT (Authorization: Bearer)
// - Gestion d'erreurs ProblemDetail RFC 7807 (Spring Boot)
// ============================================================

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ProblemDetail } from '@/types'
import { getToken, removeToken, isTokenExpired } from './auth'

// ---- Instance axios ----
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 60000,
})

// ---- Intercepteur requête : injection du Bearer token ----
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ---- Intercepteur réponse : parsing ProblemDetail ----
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 401 → token expiré, tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = typeof window !== 'undefined'
          ? localStorage.getItem('ll_refresh_token')
          : null
        if (refreshToken) {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/v1/auth/refresh`,
            { refreshToken }
          )
          if (data.accessToken) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('ll_token', data.accessToken)
            }
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
            return apiClient(originalRequest)
          }
        }
      } catch {
        // Refresh échoué → déconnexion
        removeToken()
        if (typeof window !== 'undefined') {
          window.location.href = '/connexion'
        }
      }
    }

    // Construction d'une erreur normalisée ProblemDetail
    return Promise.reject(parseApiError(error))
  }
)

// ---- Parser d'erreur ProblemDetail ----
export function parseApiError(error: AxiosError): ApiError {
  if (error.response?.data) {
    const data = error.response.data as Partial<ProblemDetail>
    return new ApiError(
      data.detail || data.title || 'Une erreur est survenue',
      error.response.status,
      data as ProblemDetail
    )
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
    return new ApiError(
      'Impossible de joindre le serveur. Vérifiez votre connexion.',
      0,
      null
    )
  }
  return new ApiError(error.message || 'Erreur inattendue', 0, null)
}

// ---- Classe d'erreur personnalisée ----
export class ApiError extends Error {
  public readonly status: number
  public readonly problem: ProblemDetail | null

  constructor(message: string, status: number, problem: ProblemDetail | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}

export default apiClient
