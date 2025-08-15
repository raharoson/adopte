import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import SimpleUsersPage from './pages/SimpleUsersPage'
import ApiDebug from './components/ApiDebug'

type Page = 'home' | 'users' | 'debug'

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <SimpleUsersPage />
      case 'debug':
        return <div className="flex-grow bg-gray-50 py-8"><ApiDebug /></div>
      case 'home':
      default:
        return (
          <main className="flex-grow bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Bienvenue sur Adopte
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  La plateforme de rencontres nouvelle génération
                </p>
                <div className="space-x-4">
                  <button 
                    onClick={() => setCurrentPage('users')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Découvrir les utilisateurs
                  </button>
                  <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-200">
                    En savoir plus
                  </button>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => setCurrentPage('debug')}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 text-sm"
                  >
                    Debug API
                  </button>
                </div>
              </div>
            </div>
          </main>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Navigation simple */}
      {currentPage !== 'home' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-4 py-3">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Retour à l'accueil
              </button>
            </nav>
          </div>
        </div>
      )}
      
      {renderPage()}
      
      <Footer />
    </div>
  )
}

export default App
