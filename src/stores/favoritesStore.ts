import { create } from 'zustand';
import { Favorite, FavoriteSchema, RecipeAdjustment } from '../models/recipe';

const STORAGE_KEY = 'smartmeal_favorites_v1';

interface FavoritesStore {
  favorites: Favorite[];
  loadFavorites: () => void;
  addFavorite: (recipeId: string, recipeTitle: string, recipeImageUrl?: string, adjustment?: RecipeAdjustment) => void;
  removeFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  getFavorite: (recipeId: string) => Favorite | undefined;
}

function loadFromStorage(): Favorite[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.map(item => {
      try {
        return FavoriteSchema.parse(item);
      } catch {
        return null;
      }
    }).filter((item): item is Favorite => item !== null);
  } catch {
    return [];
  }
}

function saveToStorage(favorites: Favorite[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  loadFavorites: () => {
    const favorites = loadFromStorage();
    set({ favorites });
  },

  addFavorite: (recipeId, recipeTitle, recipeImageUrl, adjustment) => {
    const favorite: Favorite = {
      recipeId,
      recipeTitle,
      recipeImageUrl,
      timestamp: Date.now(),
      adjustment,
    };

    set((state) => {
      const filtered = state.favorites.filter(f => f.recipeId !== recipeId);
      const updated = [...filtered, favorite];
      saveToStorage(updated);
      return { favorites: updated };
    });
  },

  removeFavorite: (recipeId) => {
    set((state) => {
      const updated = state.favorites.filter(f => f.recipeId !== recipeId);
      saveToStorage(updated);
      return { favorites: updated };
    });
  },

  isFavorite: (recipeId) => {
    return get().favorites.some(f => f.recipeId === recipeId);
  },

  getFavorite: (recipeId) => {
    return get().favorites.find(f => f.recipeId === recipeId);
  },
}));
