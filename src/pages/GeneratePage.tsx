import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, X, Plus } from 'lucide-react';
import { Button, Card, Input, Chip, Loader, EmptyState } from '../components/ui';
import { useRecipesStore } from '../stores/recipesStore';

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInterface;
    webkitSpeechRecognition?: new () => SpeechRecognitionInterface;
  }
}

export function GeneratePage() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);

  const {
    ingredients,
    generatedRecipes,
    isGenerating,
    addIngredient,
    removeIngredient,
    clearIngredients,
    generateFromIngredients,
  } = useRecipesStore();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechAvailable(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'fr-FR';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          const words = transcript.split(/[,\s]+/).filter(w => w.trim());
          words.forEach(word => addIngredient(word));
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setVoiceError(`Erreur vocale: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [addIngredient]);

  const handleAddIngredient = () => {
    if (inputValue.trim()) {
      addIngredient(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      setVoiceError('Reconnaissance vocale non disponible sur ce navigateur');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setVoiceError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        setVoiceError('Impossible de demarrer la reconnaissance vocale');
        setIsListening(false);
      }
    }
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) return;
    generateFromIngredients();
  };

  const handleClear = () => {
    clearIngredients();
  };

  return (
    <div className="px-4 py-6 min-h-full flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-green-800 mb-2">
          Parle a Smart Meal
        </h1>
        <p className="text-gold-500 text-sm">
          Transforme tes ingredients<br />en une delicieuse recette
        </p>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Ajouter un ingredient..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            variant="primary"
            onClick={handleAddIngredient}
            disabled={!inputValue.trim()}
            className="w-12 h-12 flex items-center justify-center p-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={toggleVoiceRecognition}
            disabled={!isSpeechAvailable}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 animate-pulse'
                : isSpeechAvailable
                ? 'bg-gold-400 hover:bg-gold-500'
                : 'bg-cream-300 cursor-not-allowed'
            }`}
            title={!isSpeechAvailable ? 'Reconnaissance vocale non disponible' : isListening ? 'Arreter' : 'Commencer'}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
          <div className="text-center">
            <p className="text-xs text-green-600">
              {isListening ? 'Ecoute en cours...' : isSpeechAvailable ? 'Appuie pour parler' : 'Saisie manuelle uniquement'}
            </p>
            {voiceError && (
              <p className="text-xs text-red-500 mt-1">{voiceError}</p>
            )}
          </div>
        </div>

        {ingredients.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-800">
                Ingredients ({ingredients.length})
              </span>
              <button
                onClick={handleClear}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Tout effacer
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Chip
                  key={ingredient}
                  variant="default"
                  className="flex items-center gap-2"
                  icon={
                    <button
                      onClick={() => removeIngredient(ingredient)}
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
          </div>
        )}

        {ingredients.length === 0 && (
          <EmptyState
            title="Aucun ingredient"
            description="Ajoute des ingredients pour commencer"
          />
        )}
      </div>

      {isGenerating && (
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" />
        </div>
      )}

      {!isGenerating && generatedRecipes.length > 0 && (
        <div className="flex-1 mb-4">
          <h3 className="text-lg font-serif font-bold text-green-800 mb-3">
            Recettes suggerees ({generatedRecipes.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {generatedRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                padding="none"
                className="cursor-pointer hover:shadow-soft-md transition-shadow"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full aspect-square object-cover rounded-t-2xl"
                  loading="lazy"
                />
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-green-800 line-clamp-2 mb-1">
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
        </div>
      )}

      <div className="mt-auto pt-4">
        <Button
          fullWidth
          onClick={handleGenerate}
          disabled={ingredients.length === 0 || isGenerating}
        >
          {isGenerating ? 'Generation...' : 'Continuer'}
        </Button>
      </div>
    </div>
  );
}
