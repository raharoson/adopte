import React from 'react'
import { User } from '../../types/api'

interface UserCardProps {
  user: User
  onLike?: (userId: number) => void
  onDislike?: (userId: number) => void
  onViewProfile?: (userId: number) => void
  showActions?: boolean
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onLike, 
  onDislike, 
  onViewProfile,
  showActions = true 
}) => {
  const handleLike = () => {
    if (onLike) onLike(user.id)
  }

  const handleDislike = () => {
    if (onDislike) onDislike(user.id)
  }

  const handleViewProfile = () => {
    if (onViewProfile) onViewProfile(user.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Photo de profil */}
      <div className="relative h-48 bg-gray-200">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
            <span className="text-4xl font-bold text-white">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Badge âge */}
        {user.age && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-sm">
            {user.age} ans
          </div>
        )}
      </div>

      {/* Informations utilisateur */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {user.firstName} {user.lastName}
        </h3>
        
        {user.location && (
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {user.location}
          </div>
        )}

        {user.bio && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* Centres d'intérêt */}
        {user.interests && user.interests.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {user.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
              {user.interests.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{user.interests.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-3 border-t border-gray-200">
            <button
              onClick={handleViewProfile}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
            >
              Voir profil
            </button>
            
            <button
              onClick={handleDislike}
              className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
              title="Passer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button
              onClick={handleLike}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              title="J'aime"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCard
