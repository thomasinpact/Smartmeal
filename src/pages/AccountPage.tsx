import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronRight, Crown, Heart, Edit2, Save, XCircle } from 'lucide-react';
import { Button, Input, Chip } from '../components/ui';
import { useAppStore } from '../stores/useAppStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { PLANS } from '../config/plans';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAppStore();
  const { favorites, loadFavorites } = useFavoritesStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartEdit = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setIsEditingProfile(true);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
    setIsEditingProfile(false);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editEmail.trim()) {
      updateUser({
        name: editName.trim(),
        email: editEmail.trim(),
      });
      setIsEditingProfile(false);
    }
  };

  if (!user) return null;

  const currentPlan = user.plan ? PLANS[user.plan] : null;
  const isPremium = currentPlan && currentPlan.id !== 'free';

  return (
    <div className="min-h-full flex flex-col bg-cream-100">
      <div className="flex items-center justify-between px-4 py-4 border-b border-cream-200 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 text-green-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-green-800">Compte</h1>
        <button
          onClick={() => navigate('/home')}
          className="p-2 -m-2 text-green-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6">
        <div>
          <h2 className="text-sm font-medium text-green-600 mb-3">Plan</h2>
          <button
            onClick={() => navigate('/paywall')}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-cream-200 hover:border-green-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-800 font-medium">Forfait actuel</span>
              {isPremium && (
                <Crown className="w-4 h-4 text-gold-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentPlan ? (
                <Chip
                  size="sm"
                  variant={isPremium ? 'success' : 'default'}
                >
                  {currentPlan.displayName}
                </Chip>
              ) : (
                <span className="text-sm text-green-500">Aucun</span>
              )}
              <ChevronRight className="w-4 h-4 text-green-600" />
            </div>
          </button>

          {currentPlan && currentPlan.id !== 'free' && (
            <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <p className="text-xs text-green-700">
                <span className="font-semibold">{currentPlan.priceDisplay} EUR</span> {currentPlan.period}
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-green-600">Profil</h2>
            {!isEditingProfile ? (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-600 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Modifier
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Annuler
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-600 transition-colors font-medium"
                >
                  <Save className="w-3.5 h-3.5" />
                  Sauver
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="Nom"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-white"
              disabled={!isEditingProfile}
            />
            <Input
              label="Email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="bg-white"
              disabled={!isEditingProfile}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-green-600">Favoris</h2>
            {favorites.length > 0 && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {favorites.length}
              </span>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-cream-200 text-center">
              <Heart className="w-8 h-8 text-green-300 mx-auto mb-2" />
              <p className="text-sm text-green-600">Aucun favori pour l'instant</p>
              <p className="text-xs text-green-500 mt-1">
                Ajoutez vos recettes preferees pour les retrouver ici
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((favorite) => (
                <button
                  key={favorite.recipeId}
                  onClick={() => navigate(`/recipe/${favorite.recipeId}`)}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-cream-200 hover:border-gold-300 hover:shadow-sm transition-all"
                >
                  {favorite.recipeImageUrl ? (
                    <img
                      src={favorite.recipeImageUrl}
                      alt={favorite.recipeTitle}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-cream-100 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-green-800">
                      {favorite.recipeTitle}
                    </p>
                    {favorite.adjustment && (
                      <p className="text-xs text-green-600 mt-0.5">
                        {favorite.adjustment.servings} portions
                        {favorite.adjustment.addedIngredients.length > 0 && (
                          <span className="text-gold-600 ml-1">
                            · +{favorite.adjustment.addedIngredients.length} ingredients
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-green-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="text-gold-500 text-sm font-medium">
          Plus d'options...
        </button>
      </div>

      <div className="p-4 border-t border-cream-200 bg-white">
        <Button
          variant="outline"
          fullWidth
          onClick={handleLogout}
        >
          Deconnexion
        </Button>
      </div>
    </div>
  );
}
