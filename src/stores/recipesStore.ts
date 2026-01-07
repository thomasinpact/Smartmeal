import { create } from 'zustand';
import { RECIPE_TEMPLATES, FALLBACK_RECIPES, RecipeTemplate } from '../data/recipeTemplates';

interface RecipeMatch {
  recipe: RecipeTemplate;
  score: number;
}

interface RecipesStore {
  ingredients: string[];
  generatedRecipes: RecipeTemplate[];
  isGenerating: boolean;

  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  generateFromIngredients: () => void;
  clearGenerated: () => void;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
}

function calculateMatchScore(recipeIngredients: string[], userIngredients: string[]): number {
  const normalizedUserIngredients = userIngredients.map(normalizeText);
  const normalizedRecipeIngredients = recipeIngredients.map(normalizeText);

  let score = 0;

  for (const userIng of normalizedUserIngredients) {
    for (const recipeIng of normalizedRecipeIngredients) {
      if (recipeIng.includes(userIng) || userIng.includes(recipeIng)) {
        score += 10;
      }
    }
  }

  const matchedIngredients = normalizedRecipeIngredients.filter(recipeIng =>
    normalizedUserIngredients.some(userIng =>
      recipeIng.includes(userIng) || userIng.includes(recipeIng)
    )
  );

  const matchRatio = matchedIngredients.length / normalizedRecipeIngredients.length;
  score += matchRatio * 20;

  return score;
}

export const useRecipesStore = create<RecipesStore>((set, get) => ({
  ingredients: [],
  generatedRecipes: [],
  isGenerating: false,

  addIngredient: (ingredient: string) => {
    const normalized = ingredient.trim();
    if (!normalized) return;

    set((state) => {
      if (state.ingredients.some(ing =>
        normalizeText(ing) === normalizeText(normalized)
      )) {
        return state;
      }

      return {
        ingredients: [...state.ingredients, normalized],
      };
    });
  },

  removeIngredient: (ingredient: string) => {
    set((state) => ({
      ingredients: state.ingredients.filter(ing => ing !== ingredient),
    }));
  },

  clearIngredients: () => {
    set({ ingredients: [] });
  },

  generateFromIngredients: () => {
    const { ingredients } = get();

    if (ingredients.length === 0) {
      set({ generatedRecipes: [] });
      return;
    }

    set({ isGenerating: true });

    setTimeout(() => {
      const matches: RecipeMatch[] = RECIPE_TEMPLATES.map(recipe => ({
        recipe,
        score: calculateMatchScore(recipe.keyIngredients, ingredients),
      }));

      matches.sort((a, b) => b.score - a.score);

      const topMatches = matches.filter(m => m.score > 5).slice(0, 6);

      const recipes = topMatches.length > 0
        ? topMatches.map(m => m.recipe)
        : FALLBACK_RECIPES;

      set({
        generatedRecipes: recipes,
        isGenerating: false,
      });
    }, 800);
  },

  clearGenerated: () => {
    set({ generatedRecipes: [] });
  },
}));
