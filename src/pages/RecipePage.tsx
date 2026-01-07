import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Heart, ChefHat, AlertCircle, Users } from 'lucide-react';
import { Button, Chip, FullPageLoader } from '../components/ui';
import { mockRecipes } from '../data/mockData';
import { TRENDING_RECIPES } from '../data/trendingRecipes';
import { RECIPE_TEMPLATES } from '../data/recipeTemplates';
import { AdjustmentModal } from '../components/AdjustmentModal';
import { CookingMode } from '../components/CookingMode';
import { useFavoritesStore } from '../stores/favoritesStore';
import { RecipeAdjustment } from '../models/recipe';

export function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentAdjustment, setCurrentAdjustment] = useState<RecipeAdjustment | undefined>();

  const {
    favorites,
    loadFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavorite,
  } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const recipe = mockRecipes.find((r) => r.id === id);
  const trendingRecipe = TRENDING_RECIPES.find((r) => r.id === id);
  const generatedRecipe = RECIPE_TEMPLATES.find((r) => r.id === id);

  const displayRecipe = generatedRecipe || trendingRecipe;

  useEffect(() => {
    if (id) {
      const favorite = getFavorite(id);
      if (favorite?.adjustment) {
        setCurrentAdjustment(favorite.adjustment);
      }
    }
  }, [id, getFavorite, favorites]);

  if (!recipe && !trendingRecipe && !generatedRecipe) {
    return <FullPageLoader />;
  }

  const handleToggleFavorite = () => {
    if (!id) return;

    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      const title = displayRecipe?.title || recipe?.title || '';
      const imageUrl = displayRecipe?.imageUrl || recipe?.image;
      addFavorite(id, title, imageUrl, currentAdjustment);
    }
  };

  const handleSaveAdjustment = (adjustment: RecipeAdjustment) => {
    setCurrentAdjustment(adjustment);
    if (id && isFavorite(id)) {
      const title = displayRecipe?.title || recipe?.title || '';
      const imageUrl = displayRecipe?.imageUrl || recipe?.image;
      addFavorite(id, title, imageUrl, adjustment);
    }
  };

  const handleStartCooking = () => {
    setIsCookingMode(true);
  };

  const multiplier = currentAdjustment
    ? currentAdjustment.servings / (displayRecipe?.servings || 2)
    : 1;

  if (displayRecipe) {
    const hasSteps = displayRecipe.steps && displayRecipe.steps.length > 0;
    const hasIngredients = displayRecipe.ingredients && displayRecipe.ingredients.length > 0;

    if (isCookingMode && hasSteps && hasIngredients) {
      return (
        <CookingMode
          steps={displayRecipe.steps!}
          ingredients={displayRecipe.ingredients!}
          adjustment={currentAdjustment}
          servings={displayRecipe.servings}
          onExit={() => setIsCookingMode(false)}
        />
      );
    }

    return (
      <div className="min-h-full flex flex-col pb-20">
        <div className="relative">
          {displayRecipe.imageUrl && (
            <img
              src={displayRecipe.imageUrl}
              alt={displayRecipe.title}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
          )}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-soft"
          >
            <ArrowLeft className="w-5 h-5 text-green-800" />
          </button>
          <button
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-soft transition-transform hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                id && isFavorite(id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-green-800'
              }`}
            />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 -mt-6 bg-cream-100 rounded-t-3xl relative">
          <div className="flex items-center justify-center gap-6 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-green-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{displayRecipe.time} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-600">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">{displayRecipe.kcal} kcal</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentAdjustment ? currentAdjustment.servings : displayRecipe.servings} portions
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-serif font-bold text-green-800 text-center mb-4">
            {displayRecipe.title}
          </h1>

          {generatedRecipe && generatedRecipe.description && (
            <p className="text-green-600 text-center mb-4 leading-relaxed">
              {generatedRecipe.description}
            </p>
          )}

          {displayRecipe.difficulty && (
            <p className="text-green-600 text-center mb-4">
              Difficulte : <span className="font-semibold capitalize">{displayRecipe.difficulty}</span>
            </p>
          )}

          <div className="flex justify-center gap-2 mb-6">
            {displayRecipe.tags.map((tag) => (
              <Chip key={tag} variant="outline" icon={<span className="text-gold-500">●</span>}>
                {tag}
              </Chip>
            ))}
          </div>

          {hasIngredients && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-serif font-bold text-green-800">
                  Ingredients
                </h2>
                {currentAdjustment && (
                  <span className="text-sm text-gold-600 font-medium">Ajuste</span>
                )}
              </div>
              <div className="space-y-2">
                {displayRecipe.ingredients!.map((ingredient) => {
                  const isExcluded = currentAdjustment?.excludedIngredients.includes(ingredient.name);
                  if (isExcluded) return null;

                  const adjustedQuantity = (ingredient.quantity * multiplier).toFixed(1);
                  return (
                    <div
                      key={ingredient.id}
                      className="flex items-center justify-between p-3 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-green-800">
                        {ingredient.name}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        {adjustedQuantity} {ingredient.unit}
                      </span>
                    </div>
                  );
                })}
                {currentAdjustment?.addedIngredients.map((ingredient, index) => (
                  <div
                    key={`added-${index}`}
                    className="flex items-center justify-between p-3 bg-gold-50 rounded-xl border border-gold-200"
                  >
                    <span className="text-sm font-medium text-green-800">
                      {ingredient}
                    </span>
                    <span className="text-xs text-gold-600 font-semibold">Ajoute</span>
                  </div>
                ))}
              </div>
              {currentAdjustment && currentAdjustment.excludedIngredients.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-semibold text-red-700">
                      Ingredients exclus : {currentAdjustment.excludedIngredients.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {hasSteps && (
            <div className="mb-6">
              <h2 className="text-lg font-serif font-bold text-green-800 mb-3">
                Etapes de preparation
              </h2>
              <div className="space-y-3">
                {displayRecipe.steps!.map((step) => {
                  return (
                    <div
                      key={step.id}
                      className="p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-green-300 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-white bg-green-600 px-3 py-1 rounded-full">
                              Etape {step.order}
                            </span>
                            {step.duration && (
                              <div className="flex items-center gap-1 text-green-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">{step.duration} min</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed text-green-800 font-medium">
                            {step.instruction}
                          </p>
                          {step.tip && (
                            <div className="mt-3 p-3 bg-gold-50 rounded-lg border border-gold-200">
                              <p className="text-xs text-gold-700">
                                <span className="font-semibold">💡 Conseil : </span>
                                {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {hasSteps && (
              <Button fullWidth onClick={handleStartCooking}>
                <ChefHat className="w-5 h-5 mr-2" />
                En cuisine !
              </Button>
            )}
            <Button
              fullWidth
              variant="ghost"
              onClick={() => setShowAdjustmentModal(true)}
            >
              Ajuster cette recette
            </Button>
          </div>
        </div>

        {displayRecipe && (
          <AdjustmentModal
            isOpen={showAdjustmentModal}
            onClose={() => setShowAdjustmentModal(false)}
            recipe={displayRecipe}
            onSave={handleSaveAdjustment}
            initialAdjustment={currentAdjustment}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="relative">
        <img
          src={recipe!.image}
          alt={recipe!.title}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-green-800" />
        </button>
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-soft transition-transform hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              id && isFavorite(id)
                ? 'fill-red-500 text-red-500'
                : 'text-green-800'
            }`}
          />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 -mt-6 bg-cream-100 rounded-t-3xl relative">
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-1.5 text-green-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{recipe!.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-green-600">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{recipe!.calories} kcal</span>
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-green-800 text-center mb-4">
          {recipe!.title}
        </h1>

        <p className="text-green-600 text-center mb-6 leading-relaxed">
          {recipe!.description}
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {recipe!.tags.map((tag) => (
            <Chip key={tag} variant="outline" icon={<span className="text-gold-500">●</span>}>
              {tag}
            </Chip>
          ))}
        </div>

        <div className="space-y-3">
          <Button fullWidth>
            En cuisine !
          </Button>
          <Button fullWidth variant="ghost">
            Ajuster cette recette
          </Button>
        </div>
      </div>
    </div>
  );
}
