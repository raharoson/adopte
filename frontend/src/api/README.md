# Client API Adopte

Ce client API TypeScript fournit une interface complète pour interagir avec les microservices PHP du backend Adopte.

## Structure

```
src/api/
├── client.ts          # Client HTTP de base avec Axios
├── auth.ts           # Service d'authentification
├── users.ts          # Service de gestion des utilisateurs
├── matches.ts        # Service des matches et swipes
├── messages.ts       # Service de messagerie
├── index.ts          # Exports centralisés
└── README.md         # Cette documentation
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` basé sur `.env.example` :

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
```

## Utilisation

### Import des services

```typescript
import { AuthService, UsersService, MatchesService, MessagesService } from '../api'
// ou
import { AuthService } from '../api/auth'
```

### Authentification

```typescript
// Connexion
const response = await AuthService.login({
  email: 'user@example.com',
  password: 'password'
})

// Le token est automatiquement stocké
console.log(response.user)

// Inscription
const newUser = await AuthService.register({
  email: 'user@example.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe'
})

// Déconnexion
await AuthService.logout()

// Vérifier l'authentification
const isLoggedIn = AuthService.isAuthenticated()
```

### Gestion des utilisateurs

```typescript
// Profil actuel
const profile = await UsersService.getCurrentUser()

// Mettre à jour le profil
const updatedProfile = await UsersService.updateCurrentUser({
  bio: 'Ma nouvelle bio',
  age: 25
})

// Rechercher des utilisateurs
const users = await UsersService.searchUsers({
  ageRange: { min: 20, max: 30 },
  maxDistance: 50
})

// Upload d'une photo
const photo = await UsersService.uploadPhoto(file, true) // true = photo principale
```

### Matches et Swipes

```typescript
// Liker un utilisateur
const result = await MatchesService.likeUser(123)
if (result.isMatch) {
  console.log('C\'est un match !', result.match)
}

// Disliker un utilisateur
await MatchesService.dislikeUser(123)

// Obtenir les matches
const matches = await MatchesService.getMatches(1, 20) // page, limit

// Statistiques
const stats = await MatchesService.getMatchStats()
```

### Messages

```typescript
// Obtenir les conversations
const conversations = await MessagesService.getConversations()

// Envoyer un message
const message = await MessagesService.sendMessage(conversationId, 'Hello!')

// Marquer comme lu
await MessagesService.markConversationAsRead(conversationId)

// Messages non lus
const unreadCount = await MessagesService.getUnreadCount()
```

## Gestion des erreurs

Le client gère automatiquement les erreurs et les transforme en objets `ApiError` :

```typescript
import { ApiError } from '../api'

try {
  const user = await UsersService.getCurrentUser()
} catch (error: any) {
  const apiError = error as ApiError
  
  switch (apiError.code) {
    case 'UNAUTHORIZED':
      // Rediriger vers la page de connexion
      break
    case 'VALIDATION_ERROR':
      // Afficher l'erreur de validation
      console.log('Champ:', apiError.field)
      break
    case 'NETWORK_ERROR':
      // Problème de réseau
      break
    default:
      console.error(apiError.message)
  }
}
```

## Intercepteurs

Le client inclut des intercepteurs automatiques pour :

- **Ajout du token Bearer** dans les headers
- **Gestion des erreurs HTTP** standardisée
- **Redirection automatique** en cas d'erreur 401
- **Suppression du token** en cas de déconnexion

## Upload de fichiers

```typescript
// Upload simple
const photo = await UsersService.uploadPhoto(file)

// Upload avec données supplémentaires
const photo = await UsersService.uploadPhoto(file, true) // isPrimary

// Upload dans un message
const message = await MessagesService.sendPhoto(conversationId, file, 'Caption')
```

## Types TypeScript

Tous les types sont définis dans `src/types/api.ts` :

- `User`, `UserProfile`, `UserPreferences`
- `Match`, `SwipeAction`
- `Message`, `Conversation`
- `ApiResponse<T>`, `PaginatedResponse<T>`
- `ApiError`

## Configuration avancée

### Timeout personnalisé

Le client a un timeout par défaut de 10 secondes. Pour le modifier, éditez `src/api/client.ts`.

### Headers personnalisés

```typescript
// Le client ajoute automatiquement :
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <token>' // si connecté
}
```

### URLs de base

L'URL de base est configurable via `VITE_API_BASE_URL` et par défaut sur `http://localhost:8000/api`.

## Exemples d'utilisation

Voir `src/components/ApiExample.tsx` pour des exemples complets d'utilisation dans des composants React.

## Debugging

Pour déboguer les requêtes API, ouvrez les outils de développement du navigateur et consultez l'onglet Network. Toutes les erreurs sont également loggées dans la console.
