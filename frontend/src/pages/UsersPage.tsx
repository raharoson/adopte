import React, { useState, useEffect } from 'react'
import { UsersService } from '../api'
import { User, ApiError } from '../types/api'

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    ageRange: { min: 18, max: 35 },
    maxDistance: 50
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [actionLoading, setActionLoading] = useState<{ [userId: number]: boolean }>({})

  const USERS_PER_PAGE = 12

  // Charger les utilisateurs
  const loadUsers = async (page = 1, searchFilters = filters) => {
    try {
      setLoading(true)
      setError(null)

      const response = await UsersService.searchUsers(searchFilters, page, USERS_PER_PAGE)
      
      setUsers(response.data)
      setCurrentPage(response.page)
      setTotalPages(response.totalPages)
      setTotalUsers(response.total)
    } catch (error: any) {
      const apiError = error as ApiError
      setError(apiError.message)
      console.error('Erreur lors du chargement des utilisateurs:', apiError)
    } finally {
      setLoading(false)
    }
  }

  // Charger les utilisateurs au montage
  useEffect(() => {
    loadUsers()
  }, [])

  // Gérer la recherche
  const handleSearch = () => {
    setCurrentPage(1)
    loadUsers(1, filters)
  }

  // Gérer le changement de filtres
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  // Gérer les likes
  const handleLike = async (userId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }))
      
      const result = await MatchesService.likeUser(userId)
      
      // Retirer l'utilisateur de la liste après le like
      setUsers(prev => prev.filter(user => user.id !== userId))
      
      if (result.isMatch) {
        // Afficher une notification de match
        alert(`C'est un match avec ${result.match?.user1.firstName || result.match?.user2.firstName} ! 🎉`)
      }
    } catch (error: any) {
      const apiError = error as ApiError
      console.error('Erreur lors du like:', apiError)
      alert('Erreur lors du like: ' + apiError.message)
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  // Gérer les dislikes
  const handleDislike = async (userId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }))
      
      await MatchesService.dislikeUser(userId)
      
      // Retirer l'utilisateur de la liste après le dislike
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (error: any) {
      const apiError = error as ApiError
      console.error('Erreur lors du dislike:', apiError)
      alert('Erreur lors du dislike: ' + apiError.message)
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  // Voir le profil d'un utilisateur
  const handleViewProfile = (userId: number) => {
    // Ici vous pouvez naviguer vers une page de profil détaillé
    console.log('Voir profil utilisateur:', userId)
    alert(`Fonctionnalité à venir: voir le profil de l'utilisateur ${userId}`)
  }

  // Gérer la pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadUsers(page, filters)
    }
  }

  // Générer les boutons de pagination
  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      )
    }

    return buttons
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Découvrir des utilisateurs</h1>
          <p className="text-gray-600 mt-2">
            {totalUsers > 0 ? `${totalUsers} utilisateur${totalUsers > 1 ? 's' : ''} trouvé${totalUsers > 1 ? 's' : ''}` : 'Aucun utilisateur trouvé'}
          </p>
        </div>

        {/* Filtres de recherche */}
        <UserFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Chargement des utilisateurs...</span>
            </div>
          </div>
        )}

        {/* Grille des utilisateurs */}
        {!loading && users.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {users.map((user) => (
                <div key={user.id} className={actionLoading[user.id] ? 'opacity-50' : ''}>
                  <UserCard
                    user={user}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onViewProfile={handleViewProfile}
                    showActions={true}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>

                {renderPaginationButtons()}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}

        {/* Message aucun utilisateur trouvé */}
        {!loading && users.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500 mb-4">
              Essayez de modifier vos critères de recherche pour trouver plus d'utilisateurs.
            </p>
            <button
              onClick={() => {
                setFilters({})
                loadUsers(1, {})
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage
