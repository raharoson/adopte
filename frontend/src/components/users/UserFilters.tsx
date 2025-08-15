import React, { useState } from 'react'
import { SearchFilters } from '../../types/api'

interface UserFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  loading?: boolean
}

const UserFilters: React.FC<UserFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  onSearch,
  loading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAgeRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 18
    const newAgeRange = {
      ...filters.ageRange,
      [type]: numValue
    }
    onFiltersChange({
      ...filters,
      ageRange: newAgeRange
    })
  }

  const handleDistanceChange = (value: string) => {
    const numValue = parseInt(value) || 50
    onFiltersChange({
      ...filters,
      maxDistance: numValue
    })
  }

  const handleLocationChange = (value: string) => {
    onFiltersChange({
      ...filters,
      location: value || undefined
    })
  }

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(i => i.trim()).filter(Boolean)
    onFiltersChange({
      ...filters,
      interests: interests.length > 0 ? interests : undefined
    })
  }

  const resetFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Header avec bouton d'expansion */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Rechercher des utilisateurs</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? 'Moins de filtres' : 'Plus de filtres'}
        </button>
      </div>

      {/* Recherche de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localisation
          </label>
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="Paris, Lyon, Marseille..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance maximale (km)
          </label>
          <select
            value={filters.maxDistance || 50}
            onChange={(e) => handleDistanceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
            <option value={200}>200 km</option>
          </select>
        </div>
      </div>

      {/* Filtres avancés */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Tranche d'âge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tranche d'âge
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={filters.ageRange?.min || 18}
                    onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Min"
                  />
                </div>
                <span className="flex items-center text-gray-500">à</span>
                <div className="flex-1">
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={filters.ageRange?.max || 35}
                    onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Centres d'intérêt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Centres d'intérêt
              </label>
              <input
                type="text"
                value={filters.interests?.join(', ') || ''}
                onChange={(e) => handleInterestsChange(e.target.value)}
                placeholder="Sport, Musique, Voyage (séparés par des virgules)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Recherche...
            </div>
          ) : (
            'Rechercher'
          )}
        </button>
        
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          Réinitialiser
        </button>
      </div>

      {/* Résumé des filtres actifs */}
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.location && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            📍 {filters.location}
          </span>
        )}
        {filters.ageRange && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            🎂 {filters.ageRange.min}-{filters.ageRange.max} ans
          </span>
        )}
        {filters.maxDistance && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            📏 {filters.maxDistance} km
          </span>
        )}
        {filters.interests && filters.interests.length > 0 && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            ❤️ {filters.interests.length} intérêt{filters.interests.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

export default UserFilters
