import React, { useState } from 'react'
import { apiClient } from '../api'

const ApiDebug: React.FC = () => {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApi = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Testing direct API call to /users...')
      
      // Test direct de l'API
      const result = await apiClient.get('/users')
      console.log('Raw API Response:', result)
      setResponse({
        message: 'Réponse brute de l\'API:',
        data: result
      })
    } catch (error: any) {
      console.error('API Error:', error)
      setError(error.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const testSearchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Test de la route de recherche
      const result = await apiClient.get('/users/search', { page: 1, limit: 10 })
      console.log('Search API Response:', result)
      setResponse(result)
    } catch (error: any) {
      console.error('Search API Error:', error)
      setError(error.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Debug</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testApi}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test GET /users
        </button>
        
        <button
          onClick={testSearchUsers}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          Test GET /users/search
        </button>
      </div>

      {loading && (
        <div className="text-blue-600 mb-4">Chargement...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {response && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Réponse de l'API:</h3>
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default ApiDebug
