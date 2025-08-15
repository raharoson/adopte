import apiClient from './client'
import { Message, Conversation, ApiResponse, PaginatedResponse } from '../types/api'

export class MessagesService {
  /**
   * Obtenir toutes les conversations de l'utilisateur connecté
   */
  static async getConversations(page = 1, limit = 20): Promise<PaginatedResponse<Conversation>> {
    return await apiClient.get<PaginatedResponse<Conversation>>('/conversations', { page, limit })
  }

  /**
   * Obtenir une conversation spécifique
   */
  static async getConversation(conversationId: number): Promise<Conversation> {
    const response = await apiClient.get<ApiResponse<Conversation>>(`/conversations/${conversationId}`)
    return response.data
  }

  /**
   * Obtenir les messages d'une conversation
   */
  static async getMessages(conversationId: number, page = 1, limit = 50): Promise<PaginatedResponse<Message>> {
    return await apiClient.get<PaginatedResponse<Message>>(`/conversations/${conversationId}/messages`, {
      page,
      limit
    })
  }

  /**
   * Envoyer un message
   */
  static async sendMessage(conversationId: number, content: string): Promise<Message> {
    const response = await apiClient.post<ApiResponse<Message>>(`/conversations/${conversationId}/messages`, {
      content
    })
    return response.data
  }

  /**
   * Envoyer un message à un match (créer une conversation si nécessaire)
   */
  static async sendMessageToMatch(matchId: number, content: string): Promise<Message> {
    const response = await apiClient.post<ApiResponse<Message>>('/messages/send-to-match', {
      matchId,
      content
    })
    return response.data
  }

  /**
   * Marquer un message comme lu
   */
  static async markMessageAsRead(messageId: number): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(`/messages/${messageId}/read`)
  }

  /**
   * Marquer tous les messages d'une conversation comme lus
   */
  static async markConversationAsRead(conversationId: number): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(`/conversations/${conversationId}/read`)
  }

  /**
   * Supprimer un message
   */
  static async deleteMessage(messageId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/messages/${messageId}`)
  }

  /**
   * Supprimer une conversation
   */
  static async deleteConversation(conversationId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/conversations/${conversationId}`)
  }

  /**
   * Obtenir le nombre de messages non lus
   */
  static async getUnreadCount(): Promise<{ total: number; conversations: { [key: number]: number } }> {
    const response = await apiClient.get<ApiResponse<{ total: number; conversations: { [key: number]: number } }>>('/messages/unread-count')
    return response.data
  }

  /**
   * Rechercher dans les messages
   */
  static async searchMessages(query: string, conversationId?: number): Promise<Message[]> {
    const params: any = { query }
    if (conversationId) {
      params.conversationId = conversationId
    }
    
    const response = await apiClient.get<ApiResponse<Message[]>>('/messages/search', params)
    return response.data
  }

  /**
   * Obtenir les conversations avec des messages non lus
   */
  static async getUnreadConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<ApiResponse<Conversation[]>>('/conversations/unread')
    return response.data
  }

  /**
   * Signaler un message
   */
  static async reportMessage(messageId: number, reason: string, description?: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/messages/report', {
      messageId,
      reason,
      description
    })
  }

  /**
   * Bloquer un utilisateur dans une conversation
   */
  static async blockUserInConversation(conversationId: number, userId: number): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`/conversations/${conversationId}/block`, {
      userId
    })
  }

  /**
   * Obtenir les statistiques des messages
   */
  static async getMessageStats(): Promise<{
    totalMessages: number
    totalConversations: number
    unreadMessages: number
    averageResponseTime: number // en minutes
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalMessages: number
      totalConversations: number
      unreadMessages: number
      averageResponseTime: number
    }>>('/messages/stats')
    return response.data
  }

  /**
   * Envoyer une photo dans un message
   */
  static async sendPhoto(conversationId: number, file: File, caption?: string): Promise<Message> {
    const response = await apiClient.uploadFile<ApiResponse<Message>>(
      `/conversations/${conversationId}/messages/photo`,
      file,
      { caption }
    )
    return response.data
  }

  /**
   * Obtenir l'historique des messages entre deux utilisateurs
   */
  static async getMessageHistory(otherUserId: number, page = 1, limit = 50): Promise<PaginatedResponse<Message>> {
    return await apiClient.get<PaginatedResponse<Message>>(`/messages/history/${otherUserId}`, {
      page,
      limit
    })
  }
}

export default MessagesService
