import { useNavigate } from 'react-router-dom';
import { Leaf, Carrot, Clock } from 'lucide-react';
import { Button, Card, CardImage, Chip, EmptyState } from '../components/ui';
import { mockCategories } from '../data/mockData';
import { TRENDING_RECIPES } from '../data/trendingRecipes';

const categoryIcons: Record<string, typeof Leaf> = {
  leaf: Leaf,
  carrot: Carrot,
  clock: Clock,
};

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl font-serif font-bold text-green-600">Smart</span>
          <span className="text-2xl">🥕</span>
          <span className="text-2xl font-serif font-bold text-green-600">Meal</span>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {mockCategories.map((category) => {
            const Icon = categoryIcons[category.icon];
            return (
              <Chip key={category.id} variant="outline" size="sm" icon={Icon && <Icon className="w-3.5 h-3.5" />}>
                {category.label}
              </Chip>
            );
          })}
        </div>
      </div>

      <Card className="mb-6 overflow-hidden" padding="none">
        <div className="relative h-40">
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Cuisine"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="text-lg font-serif font-bold mb-1">C'est l'heure de cuisiner !</h2>
            <p className="text-sm opacity-90 mb-3">Voici des recettes inspirees de ton frigo</p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/generate')}
            >
              Generer mes recettes
            </Button>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <h3 className="text-xl font-serif font-bold text-green-800 mb-4">
          Recettes du moment
        </h3>

        {TRENDING_RECIPES.length === 0 ? (
          <EmptyState
            title="Aucune recette"
            description="Aucune recette tendance pour le moment"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {TRENDING_RECIPES.map((recipe) => (
              <Card
                key={recipe.id}
                padding="none"
                className="cursor-pointer hover:shadow-soft-md transition-shadow"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                {recipe.imageUrl && (
                  <CardImage
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    aspectRatio="square"
                  />
                )}
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-green-800 line-clamp-2 mb-2">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-green-600 mb-2">
                    <span>{recipe.time} min</span>
                    <span>•</span>
                    <span>{recipe.kcal} kcal</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {recipe.tags.slice(0, 2).map((tag) => (
                      <Chip key={tag} size="sm" variant="default">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
