import apiClient from './client'
import { Match, SwipeAction, ApiResponse, PaginatedResponse } from '../types/api'

export class MatchesService {
  /**
   * Effectuer un swipe (like ou dislike)
   */
  static async swipe(action: SwipeAction): Promise<{ isMatch: boolean; match?: Match }> {
    const response = await apiClient.post<ApiResponse<{ isMatch: boolean; match?: Match }>>('/matches/swipe', action)
    return response.data
  }

  /**
   * Liker un utilisateur
   */
  static async likeUser(targetUserId: number): Promise<{ isMatch: boolean; match?: Match }> {
    return this.swipe({ targetUserId, action: 'like' })
  }

  /**
   * Disliker un utilisateur
   */
  static async dislikeUser(targetUserId: number): Promise<void> {
    await this.swipe({ targetUserId, action: 'dislike' })
  }

  /**
   * Obtenir tous les matches de l'utilisateur connecté
   */
  static async getMatches(page = 1, limit = 20): Promise<PaginatedResponse<Match>> {
    return await apiClient.get<PaginatedResponse<Match>>('/matches', { page, limit })
  }

  /**
   * Obtenir un match spécifique
   */
  static async getMatchById(matchId: number): Promise<Match> {
    const response = await apiClient.get<ApiResponse<Match>>(`/matches/${matchId}`)
    return response.data
  }

  /**
   * Supprimer un match (unmatch)
   */
  static async deleteMatch(matchId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/matches/${matchId}`)
  }

  /**
   * Obtenir les likes reçus
   */
  static async getReceivedLikes(page = 1, limit = 20): Promise<PaginatedResponse<{
    id: number
    userId: number
    user: {
      id: number
      firstName: string
      lastName: string
      avatar?: string
      age?: number
    }
    createdAt: string
  }>> {
    return await apiClient.get<PaginatedResponse<{
      id: number
      userId: number
      user: {
        id: number
        firstName: string
        lastName: string
        avatar?: string
        age?: number
      }
      createdAt: string
    }>>('/matches/likes-received', { page, limit })
  }

  /**
   * Obtenir les likes envoyés
   */
  static async getSentLikes(page = 1, limit = 20): Promise<PaginatedResponse<{
    id: number
    targetUserId: number
    user: {
      id: number
      firstName: string
      lastName: string
      avatar?: string
      age?: number
    }
    createdAt: string
  }>> {
    return await apiClient.get<PaginatedResponse<{
      id: number
      targetUserId: number
      user: {
        id: number
        firstName: string
        lastName: string
        avatar?: string
        age?: number
      }
      createdAt: string
    }>>('/matches/likes-sent', { page, limit })
  }

  /**
   * Super like un utilisateur (si cette fonctionnalité existe)
   */
  static async superLike(targetUserId: number): Promise<{ isMatch: boolean; match?: Match }> {
    const response = await apiClient.post<ApiResponse<{ isMatch: boolean; match?: Match }>>('/matches/super-like', {
      targetUserId
    })
    return response.data
  }

  /**
   * Annuler le dernier swipe (rewind)
   */
  static async undoLastSwipe(): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/matches/undo')
  }

  /**
   * Obtenir les statistiques des matches
   */
  static async getMatchStats(): Promise<{
    totalMatches: number
    totalLikesSent: number
    totalLikesReceived: number
    matchRate: number
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalMatches: number
      totalLikesSent: number
      totalLikesReceived: number
      matchRate: number
    }>>('/matches/stats')
    return response.data
  }

  /**
   * Vérifier si un utilisateur a déjà été swiped
   */
  static async hasSwipedUser(targetUserId: number): Promise<{ hasSwiped: boolean; action?: 'like' | 'dislike' }> {
    const response = await apiClient.get<ApiResponse<{ hasSwiped: boolean; action?: 'like' | 'dislike' }>>(
      `/matches/has-swiped/${targetUserId}`
    )
    return response.data
  }

  /**
   * Obtenir les matches mutuel récents
   */
  static async getRecentMatches(limit = 10): Promise<Match[]> {
    const response = await apiClient.get<ApiResponse<Match[]>>('/matches/recent', { limit })
    return response.data
  }
}

export default MatchesService
