import apiClient from './client'
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../types/api'

export class AuthService {
  /**
   * Connexion utilisateur
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    
    // Stocker le token automatiquement
    if (response.data.token) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response.data
  }

  /**
   * Inscription utilisateur
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData)
    
    // Stocker le token automatiquement
    if (response.data.token) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response.data
  }

  /**
   * Déconnexion utilisateur
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      // Supprimer le token même si la requête échoue
      apiClient.removeAuthToken()
    }
  }

  /**
   * Rafraîchir le token
   */
  static async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh')
    
    if (response.data.token) {
      apiClient.setAuthToken(response.data.token)
    }
    
    return response.data
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token')
    return !!token
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  static async forgotPassword(email: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email })
  }

  /**
   * Réinitialisation de mot de passe
   */
  static async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/reset-password', { token, password })
  }

  /**
   * Vérification de l'email
   */
  static async verifyEmail(token: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/verify-email', { token })
  }

  /**
   * Renvoyer l'email de vérification
   */
  static async resendVerificationEmail(): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/resend-verification')
  }
}

export default AuthService
