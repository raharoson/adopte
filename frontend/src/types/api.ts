// Types pour l'authentification
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Types pour l'utilisateur
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  age?: number
  location?: string
  interests?: string[]
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  photos?: Photo[]
  preferences?: UserPreferences
}

export interface UserPreferences {
  ageRange: {
    min: number
    max: number
  }
  maxDistance: number
  interests: string[]
}

// Types pour les photos
export interface Photo {
  id: number
  userId: number
  url: string
  isPrimary: boolean
  createdAt: string
}

// Types pour les matches
export interface Match {
  id: number
  userId1: number
  userId2: number
  user1: User
  user2: User
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}

// Types pour les messages
export interface Message {
  id: number
  matchId: number
  senderId: number
  receiverId: number
  content: string
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: number
  match: Match
  messages: Message[]
  lastMessage?: Message
}

// Types pour les réponses API génériques
export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Types pour les erreurs
export interface ApiError {
  message: string
  code?: string
  field?: string
}

// Types pour les actions utilisateur
export interface SwipeAction {
  targetUserId: number
  action: 'like' | 'dislike'
}

// Types pour la recherche
export interface SearchFilters {
  ageRange?: {
    min: number
    max: number
  }
  maxDistance?: number
  interests?: string[]
  location?: string
}
