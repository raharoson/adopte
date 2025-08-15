import apiClient from './client'
import { User, UserProfile, UserPreferences, Photo, ApiResponse, PaginatedResponse, SearchFilters } from '../types/api'

export class UsersService {
  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  static async getCurrentUser(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/me')
    return response.data
  }

  /**
   * Mettre à jour le profil de l'utilisateur connecté
   */
  static async updateCurrentUser(userData: Partial<User>): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponse<UserProfile>>('/users/me', userData)
    return response.data
  }

  /**
   * Obtenir un utilisateur par son ID
   */
  static async getUserById(userId: number): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(`/users/${userId}`)
    return response.data
  }

  /**
   * Rechercher des utilisateurs
   */
  static async searchUsers(filters?: SearchFilters, page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    try {
      console.log('Calling /users API...')
      
      // Appeler l'API /users directement
      const response = await apiClient.get<{
        status: string
        users: any[]
        total: number
      }>('/users')
      
      console.log('Raw API response:', response)
      
      // Transformer les données pour correspondre à notre interface User
      const transformedUsers: User[] = response.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.name?.split(' ')[0] || user.name || 'N/A',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        avatar: user.avatar,
        bio: user.bio,
        age: user.age,
        location: user.location,
        interests: user.interests || [],
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }))
      
      console.log('Transformed users:', transformedUsers)
      
      // Simuler une réponse paginée
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedUsers = transformedUsers.slice(startIndex, endIndex)
      
      return {
        data: paginatedUsers,
        total: response.total || transformedUsers.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil((response.total || transformedUsers.length) / limit)
      }
    } catch (error) {
      console.error('Error in searchUsers:', error)
      throw error
    }
  }

  /**
   * Obtenir des suggestions d'utilisateurs
   */
  static async getRecommendations(limit = 10): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/users/recommendations', { limit })
    return response.data
  }

  /**
   * Mettre à jour les préférences utilisateur
   */
  static async updatePreferences(preferences: UserPreferences): Promise<UserPreferences> {
    const response = await apiClient.put<ApiResponse<UserPreferences>>('/users/me/preferences', preferences)
    return response.data
  }

  /**
   * Obtenir les photos de l'utilisateur connecté
   */
  static async getCurrentUserPhotos(): Promise<Photo[]> {
    const response = await apiClient.get<ApiResponse<Photo[]>>('/users/me/photos')
    return response.data
  }

  /**
   * Uploader une photo
   */
  static async uploadPhoto(file: File, isPrimary = false): Promise<Photo> {
    const response = await apiClient.uploadFile<ApiResponse<Photo>>(
      '/users/me/photos', 
      file, 
      { isPrimary }
    )
    return response.data
  }

  /**
   * Supprimer une photo
   */
  static async deletePhoto(photoId: number): Promise<void> {
    await apiClient.delete(`/users/me/photos/${photoId}`)
  }

  /**
   * Définir une photo comme principale
   */
  static async setPrimaryPhoto(photoId: number): Promise<Photo> {
    const response = await apiClient.patch<ApiResponse<Photo>>(`/users/me/photos/${photoId}/primary`)
    return response.data
  }

  /**
   * Signaler un utilisateur
   */
  static async reportUser(userId: number, reason: string, description?: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/users/report', {
      userId,
      reason,
      description
    })
  }

  /**
   * Bloquer un utilisateur
   */
  static async blockUser(userId: number): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`/users/${userId}/block`)
  }

  /**
   * Débloquer un utilisateur
   */
  static async unblockUser(userId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/users/${userId}/block`)
  }

  /**
   * Obtenir la liste des utilisateurs bloqués
   */
  static async getBlockedUsers(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/users/me/blocked')
    return response.data
  }

  /**
   * Supprimer le compte utilisateur
   */
  static async deleteAccount(): Promise<void> {
    await apiClient.delete<ApiResponse<void>>('/users/me')
  }

  /**
   * Obtenir les statistiques de l'utilisateur
   */
  static async getUserStats(): Promise<{
    totalLikes: number
    totalMatches: number
    profileViews: number
    messagesCount: number
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalLikes: number
      totalMatches: number
      profileViews: number
      messagesCount: number
    }>>('/users/me/stats')
    return response.data
  }
}

export default UsersService
