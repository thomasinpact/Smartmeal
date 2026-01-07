import { z } from 'zod';

export const RecipeStepSchema = z.object({
  id: z.string(),
  order: z.number(),
  instruction: z.string(),
  duration: z.number().optional(),
  tip: z.string().optional(),
});

export type RecipeStep = z.infer<typeof RecipeStepSchema>;

export const RecipeIngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  optional: z.boolean().default(false),
});

export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  time: z.number(),
  kcal: z.number(),
  difficulty: z.enum(['facile', 'moyen', 'difficile']).optional(),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
  servings: z.number().default(2),
  ingredients: z.array(RecipeIngredientSchema).default([]),
  steps: z.array(RecipeStepSchema).default([]),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const RecipeAdjustmentSchema = z.object({
  recipeId: z.string(),
  servings: z.number(),
  addedIngredients: z.array(z.string()).default([]),
  excludedIngredients: z.array(z.string()).default([]),
  timestamp: z.number(),
});

export type RecipeAdjustment = z.infer<typeof RecipeAdjustmentSchema>;

export const FavoriteSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  recipeImageUrl: z.string().optional(),
  timestamp: z.number(),
  adjustment: RecipeAdjustmentSchema.optional(),
});

export type Favorite = z.infer<typeof FavoriteSchema>;
