import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Modal, Button, Input, Chip } from './ui';
import { RecipeTemplate } from '../data/recipeTemplates';
import { RecipeAdjustment } from '../models/recipe';

interface AdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeTemplate;
  onSave: (adjustment: RecipeAdjustment) => void;
  initialAdjustment?: RecipeAdjustment;
}

export function AdjustmentModal({
  isOpen,
  onClose,
  recipe,
  onSave,
  initialAdjustment,
}: AdjustmentModalProps) {
  const [servings, setServings] = useState(initialAdjustment?.servings || recipe.servings || 2);
  const [addedIngredients, setAddedIngredients] = useState<string[]>(
    initialAdjustment?.addedIngredients || []
  );
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>(
    initialAdjustment?.excludedIngredients || []
  );
  const [newIngredient, setNewIngredient] = useState('');

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !addedIngredients.includes(newIngredient.trim())) {
      setAddedIngredients([...addedIngredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveAddedIngredient = (ingredient: string) => {
    setAddedIngredients(addedIngredients.filter(i => i !== ingredient));
  };

  const handleToggleExclude = (ingredientName: string) => {
    if (excludedIngredients.includes(ingredientName)) {
      setExcludedIngredients(excludedIngredients.filter(i => i !== ingredientName));
    } else {
      setExcludedIngredients([...excludedIngredients, ingredientName]);
    }
  };

  const handleSave = () => {
    const adjustment: RecipeAdjustment = {
      recipeId: recipe.id,
      servings,
      addedIngredients,
      excludedIngredients,
      timestamp: Date.now(),
    };
    onSave(adjustment);
    onClose();
  };

  const multiplier = servings / (recipe.servings || 2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajuster la recette">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-green-800 mb-3">
            Nombre de portions
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-10 h-10 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors"
            >
              <Minus className="w-5 h-5 text-green-800" />
            </button>
            <span className="text-2xl font-bold text-green-800 w-12 text-center">
              {servings}
            </span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-10 h-10 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 text-green-800" />
            </button>
            <span className="text-sm text-green-600">
              portions
            </span>
          </div>
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-3">
              Ingredients (x{multiplier.toFixed(1)})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recipe.ingredients.map((ingredient) => {
                const isExcluded = excludedIngredients.includes(ingredient.name);
                const adjustedQuantity = (ingredient.quantity * multiplier).toFixed(1);

                return (
                  <div
                    key={ingredient.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isExcluded
                        ? 'bg-red-50 border-red-200 opacity-50'
                        : 'bg-cream-50 border-cream-200'
                    }`}
                  >
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${isExcluded ? 'line-through text-green-600' : 'text-green-800'}`}>
                        {ingredient.name}
                      </span>
                      <span className="text-xs text-green-600 ml-2">
                        {adjustedQuantity} {ingredient.unit}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleExclude(ingredient.name)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        isExcluded
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {isExcluded ? 'Inclure' : 'Exclure'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-green-800 mb-3">
            Ajouter des ingredients
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Ex: Basilic, Parmesan..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={handleAddIngredient}
              disabled={!newIngredient.trim()}
              className="w-12 h-12 flex items-center justify-center p-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {addedIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {addedIngredients.map((ingredient) => (
                <Chip
                  key={ingredient}
                  variant="default"
                  className="flex items-center gap-2"
                  icon={
                    <button
                      onClick={() => handleRemoveAddedIngredient(ingredient)}
                      className="p-0.5 hover:bg-green-700 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  }
                >
                  {ingredient}
                </Chip>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={onClose} fullWidth>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} fullWidth>
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
