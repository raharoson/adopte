import React, { useState, useEffect } from 'react'
import { AuthService, UsersService, User, ApiError } from '../api'

const ApiExample: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Exemple de connexion
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const authResponse = await AuthService.login({ email, password })
      setUser(authResponse.user)
      
      console.log('Connexion réussie:', authResponse)
    } catch (error: any) {
      const apiError = error as ApiError
      setError(apiError.message)
      console.error('Erreur de connexion:', apiError)
    } finally {
      setLoading(false)
    }
  }

  // Exemple de récupération du profil utilisateur
  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userProfile = await UsersService.getCurrentUser()
      setUser(userProfile)
      
      console.log('Profil utilisateur:', userProfile)
    } catch (error: any) {
      const apiError = error as ApiError
      setError(apiError.message)
      console.error('Erreur récupération profil:', apiError)
    } finally {
      setLoading(false)
    }
  }

  // Exemple de déconnexion
  const handleLogout = async () => {
    try {
      await AuthService.logout()
      setUser(null)
      console.log('Déconnexion réussie')
    } catch (error: any) {
      console.error('Erreur déconnexion:', error)
    }
  }

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      fetchUserProfile()
    }
  }, [])

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Exemple API Client</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Chargement...
        </div>
      )}
      
      {user ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Utilisateur connecté:</h3>
          <p>Nom: {user.firstName} {user.lastName}</p>
          <p>Email: {user.email}</p>
          {user.age && <p>Âge: {user.age}</p>}
          {user.location && <p>Localisation: {user.location}</p>}
          
          <button
            onClick={handleLogout}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Test de connexion:</h3>
          <button
            onClick={() => handleLogin('test@example.com', 'password')}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Se connecter (test)
          </button>
        </div>
      )}
      
      <div className="space-y-2">
        <button
          onClick={fetchUserProfile}
          disabled={loading || !AuthService.isAuthenticated()}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Récupérer le profil
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h4 className="font-semibold">État de l'authentification:</h4>
        <p>Connecté: {AuthService.isAuthenticated() ? 'Oui' : 'Non'}</p>
      </div>
    </div>
  )
}

export default ApiExample
