# Smart Meal - Mobile-First Recipe App

Application mobile-first pour la gestion de recettes, inspiree du design Smart Meal.

## Stack Technique

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling avec theme custom (cream/green/gold)
- **React Router** - Navigation
- **Zustand** - State management avec persistance localStorage
- **TanStack Query** - Data fetching
- **Headless UI** - Composants accessibles
- **Lucide React** - Icones

## Structure du Projet

```
src/
├── components/
│   ├── RequireAuth.tsx   # Guard pour proteger les routes
│   └── ui/              # Design system (Button, Card, Chip, Input...)
├── data/
│   └── mockData.ts      # Donnees mock pour le developpement
├── layouts/
│   ├── PublicLayout.tsx # Layout sans navigation (onboarding/login/paywall)
│   └── AppLayout.tsx    # Layout avec bottom nav fixe
├── lib/
│   └── queryClient.ts   # Configuration TanStack Query
├── pages/
│   ├── OnboardingPage.tsx
│   ├── LoginPage.tsx
│   ├── PaywallPage.tsx
│   ├── HomePage.tsx
│   ├── GeneratePage.tsx
│   ├── RecipePage.tsx
│   ├── AccountPage.tsx
│   └── ContactPage.tsx
├── stores/
│   └── useAppStore.ts   # Store Zustand global + auth
├── App.tsx              # Routes et providers
├── main.tsx             # Point d'entree
└── index.css            # Styles globaux Tailwind
```

## Routes

| Route | Protection | Layout | Description |
|-------|-----------|--------|-------------|
| `/` | Public | Public | Onboarding |
| `/login` | Public | Public | Connexion Apple/Google/Email |
| `/paywall` | Auth | Public | Choix abonnement |
| `/home` | Auth | App | Accueil avec recettes |
| `/generate` | Auth | App | Generation de recettes |
| `/recipe/:id` | Auth | App | Detail d'une recette |
| `/account` | Auth | App | Compte utilisateur |
| `/contact` | Auth | App | Contact |

## Authentification

### Fonctionnement

L'app utilise une authentification locale (sans backend) avec persistance dans localStorage.

**Cle localStorage:** `smartmeal_session_v1`

### Flux d'authentification

1. **Onboarding** (`/`) → Bouton "Continuer" → `/login`
2. **Login** (`/login`) → 3 options:
   - Bouton "Continuer avec Apple"
   - Bouton "Continuer avec Google"
   - Lien "Autres options..." → Formulaire email
3. **Paywall** (`/paywall`) → Choix du plan → `/home`
   - Option "X" pour skip avec plan gratuit
4. **App protegee** → Toutes les routes sous `/home`, `/generate`, `/recipe`, `/account`, `/contact`

### Store Auth

```typescript
// Methodes disponibles
loginWithProvider('apple' | 'google')  // Login OAuth simule
loginWithEmail(email)                   // Login email
setPlan('free' | 'weekly' | 'monthly' | 'annual')
logout()                                // Deconnexion + clear localStorage
initSession()                           // Restaurer session au chargement
```

### Protection des routes

Composant `<RequireAuth>` qui redirige vers `/login` si non authentifie.

### Persistance

La session est automatiquement sauvegardee dans localStorage et restauree au refresh de la page.

## Plans et Abonnements

### Configuration des plans

Les plans sont definis dans `src/config/plans.ts`:

- **Free** - Gratuit (3 recettes/jour, fonctionnalites limitees)
- **Weekly** - 3,99 EUR/semaine (toutes fonctionnalites)
- **Monthly** - 6,99 EUR/mois (toutes fonctionnalites)
- **Annual** - 39,99 EUR/an (meilleur prix, -80%)

### Fonctionnalites Premium

1. Recettes illimitees
2. Sauvegarde de favoris
3. Affinage des resultats
4. Regimes personnalises
5. Cuisine du monde
6. Garde-manger

### Choix du plan

Sur la page `/paywall`, l'utilisateur peut:
- Choisir un plan premium (trial gratuit simule)
- Cliquer sur "Rester en version gratuite" pour le plan free
- Cliquer sur "X" pour skip directement en free

Le plan choisi est:
- Stocke dans localStorage via `smartmeal_session_v1`
- Visible dans la page `/account`
- Modifiable en retournant sur `/paywall`

**Note:** En V1, aucun paiement reel n'est implemente. L'integration Stripe sera ajoutee en V2.

## Recettes et Donnees

### Recettes Trending

Les recettes trending sont definies dans `src/data/trendingRecipes.ts`:

- 8 recettes statiques avec id, titre, temps, calories, tags, image
- Affichees sur la page `/home` en grille 2 colonnes mobile
- Navigation vers `/recipe/:id` au clic
- Images optimisees avec lazy loading automatique

### Donnees Mock

Les recettes supplementaires sont dans `src/data/mockData.ts`:

- Recettes additionnelles pour generation et tests
- Categories de recettes
- Donnees utilisateur mock

### Performance

- Images legeres via Pexels (w=800)
- Lazy loading automatique sur toutes les images (CardImage)
- Chargement instantane (pas d'appel reseau)
- Gestion des etats empty

## Generation de Recettes

### Page `/generate`

Page "Parle a Smart Meal" permettant de generer des recettes a partir d'ingredients:

**Saisie des ingredients:**
- Input manuel avec bouton "+" pour ajouter
- Reconnaissance vocale Web Speech API (si disponible dans le navigateur)
- Bouton micro avec etats visuels (repos, ecoute, erreur)
- Fallback gracieux si Speech API non disponible
- Validation des doublons (normalisation des textes)

**Affichage:**
- Ingredients en chips avec bouton supprimer
- Compteur d'ingredients
- Bouton "Tout effacer"
- Etat empty si aucun ingredient

**Generation locale:**
- Algorithme de matching local (pas d'API externe)
- Score base sur ingredients correspondants
- 3-6 meilleures recettes selon matching
- Fallback sur 3 recettes passe-partout si aucun match
- Etat loading pendant generation (800ms simule)
- Affichage resultats en grille 2 colonnes

**Store Zustand (`recipesStore`):**
- `ingredients: string[]` - Liste ingredients saisies
- `generatedRecipes: RecipeTemplate[]` - Recettes generees
- `isGenerating: boolean` - Etat loading
- `addIngredient(ingredient)` - Ajoute ingredient (avec dedupe)
- `removeIngredient(ingredient)` - Retire ingredient
- `clearIngredients()` - Efface tout
- `generateFromIngredients()` - Lance generation locale

**Catalogue local (`recipeTemplates.ts`):**
- 15 recettes templates avec ingredients cles
- Chaque recette: id, title, time, kcal, tags, imageUrl, keyIngredients, difficulty, description
- 3 recettes fallback pour zero matching

**Algorithme de matching:**
- Normalisation texte (minuscules, sans accents, sans ponctuation)
- Score par ingredient correspondant (+10 points)
- Bonus ratio d'ingredients matches (+20 max)
- Tri par score decroissant
- Seuil minimum: score > 5
- Fonctionne 100% offline

### Performance

- Images legeres via Pexels (w=800)
- Lazy loading automatique sur toutes les images (CardImage)
- Chargement instantane (pas d'appel reseau)
- Gestion des etats empty

## Design System

### Couleurs

- **Cream** - Fond principal (#FDF8F3)
- **Green** - Couleur primaire (#2D5A3D)
- **Gold** - Accent (#E8A54B)

### Composants UI

- `Button` - primary, secondary, ghost, outline
- `Card` - default, elevated, outlined
- `Chip` - default, success, warning, outline
- `Input` - avec label et validation
- `Textarea` - avec label et validation
- `Divider` - horizontal, vertical, avec label
- `Modal` - avec transitions
- `Toast` - success, error, info
- `Loader` - sm, md, lg
- `EmptyState` - avec action optionnelle

## Scripts

```bash
npm run dev      # Serveur de developpement
npm run build    # Build production
npm run preview  # Preview du build
npm run lint     # ESLint
npm run typecheck # Verification TypeScript
```

## Design Mobile-First

- Max-width: 430px
- Bottom navigation fixe sur les pages app
- Safe area pour iOS
- Touch-friendly (cibles 44px minimum)
- Animations et transitions fluides

## Tests Manuels

### Session persistence
1. Login via email/provider
2. Choisir un plan
3. Refresh la page → Session conservee
4. Naviguer vers `/home` → Acces OK
5. Logout → Redirect vers `/`

### Routes protegees
1. Tenter d'acceder `/home` sans auth → Redirect `/login`
2. Login → Redirect `/paywall`
3. Skip paywall → Redirect `/home`
4. Acces aux autres routes protegees OK
