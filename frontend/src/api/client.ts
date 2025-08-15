import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { ApiError } from '../types/api'

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Intercepteur pour les requêtes
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Intercepteur pour les réponses
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => {
        return this.handleError(error)
      }
    )
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  public setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  public removeAuthToken(): void {
    localStorage.removeItem('auth_token')
  }

  private handleError(error: AxiosError): Promise<never> {
    let apiError: ApiError

    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          apiError = {
            message: 'Non autorisé. Veuillez vous connecter.',
            code: 'UNAUTHORIZED'
          }
          this.removeAuthToken()
          // Redirection vers la page de connexion si nécessaire
          window.location.href = '/login'
          break
        case 403:
          apiError = {
            message: 'Accès interdit.',
            code: 'FORBIDDEN'
          }
          break
        case 404:
          apiError = {
            message: 'Ressource non trouvée.',
            code: 'NOT_FOUND'
          }
          break
        case 422:
          apiError = {
            message: data.message || 'Données invalides.',
            code: 'VALIDATION_ERROR',
            field: data.field
          }
          break
        case 500:
          apiError = {
            message: 'Erreur serveur interne.',
            code: 'SERVER_ERROR'
          }
          break
        default:
          apiError = {
            message: data.message || 'Une erreur est survenue.',
            code: 'UNKNOWN_ERROR'
          }
      }
    } else if (error.request) {
      // La requête a été envoyée mais pas de réponse reçue
      apiError = {
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
        code: 'NETWORK_ERROR'
      }
    } else {
      // Autre erreur
      apiError = {
        message: error.message || 'Une erreur inattendue est survenue.',
        code: 'UNKNOWN_ERROR'
      }
    }

    return Promise.reject(apiError)
  }

  // Méthodes HTTP de base
  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params })
    return response.data
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  public async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data)
    return response.data
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }

  // Méthode pour l'upload de fichiers
  public async uploadFile<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key])
      })
    }

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient()
export default apiClient
