import { useState, useEffect } from 'react';
import { Check, Clock, ChefHat, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui';
import { RecipeStep, RecipeAdjustment, RecipeIngredient } from '../models/recipe';

interface CookingModeProps {
  steps: RecipeStep[];
  ingredients: RecipeIngredient[];
  adjustment?: RecipeAdjustment;
  servings: number;
  onExit: () => void;
}

export function CookingMode({ steps, ingredients, adjustment, servings, onExit }: CookingModeProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [timer, setTimer] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const currentStep = steps[currentStepIndex];
  const multiplier = adjustment ? adjustment.servings / servings : 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const handleStartTimer = () => {
    if (currentStep.duration) {
      setTimer(currentStep.duration * 60);
      setTimerActive(true);
    }
  };

  const handleStopTimer = () => {
    setTimerActive(false);
  };

  const handleNextStep = () => {
    if (!completedSteps.has(currentStep.id)) {
      setCompletedSteps((prev) => new Set([...prev, currentStep.id]));
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setTimer(null);
      setTimerActive(false);
    }
  };

  const handleFinish = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep.id]));
    onExit();
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setTimer(null);
      setTimerActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCompleted = completedSteps.has(currentStep.id);
  const progress = ((completedSteps.size / steps.length) * 100).toFixed(0);

  const relevantIngredients = ingredients.filter((ing) => {
    if (adjustment?.excludedIngredients.includes(ing.name)) return false;
    const instruction = currentStep.instruction.toLowerCase();
    return instruction.includes(ing.name.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-cream-50 z-50 flex flex-col">
      <div className="bg-gradient-to-br from-green-700 to-green-800 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onExit}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            <span className="font-semibold">Mode Cuisine</span>
          </div>
          <div className="w-10" />
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-white/80">
          Etape {currentStep.order} sur {steps.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className={`p-6 rounded-2xl border-2 transition-all ${
            isCompleted
              ? 'bg-green-50 border-green-300'
              : 'bg-white border-gold-300 shadow-soft'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isCompleted
                  ? 'bg-green-600 border-green-600'
                  : 'border-green-300'
              }`}>
                {isCompleted && <Check className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-green-800 bg-cream-200 px-3 py-1 rounded-full">
                    Etape {currentStep.order}
                  </span>
                  {currentStep.duration && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">{currentStep.duration} min</span>
                    </div>
                  )}
                </div>
                <p className={`text-base leading-relaxed ${isCompleted ? 'text-green-600 line-through' : 'text-green-800 font-medium'}`}>
                  {currentStep.instruction}
                </p>
                {currentStep.tip && (
                  <div className="mt-3 p-3 bg-gold-50 rounded-lg border border-gold-200">
                    <p className="text-sm text-gold-700">
                      <span className="font-semibold">💡 Conseil : </span>
                      {currentStep.tip}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {currentStep.duration && (
              <div className="mt-4 p-4 bg-cream-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-green-800">Minuteur</span>
                  {timer !== null && (
                    <span className={`text-2xl font-bold ${timer < 60 ? 'text-red-600' : 'text-green-800'}`}>
                      {formatTime(timer)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!timerActive && timer === null && (
                    <Button fullWidth onClick={handleStartTimer} variant="primary">
                      Demarrer le minuteur
                    </Button>
                  )}
                  {timerActive && (
                    <Button fullWidth onClick={handleStopTimer} variant="ghost">
                      Arreter
                    </Button>
                  )}
                  {timer !== null && timer === 0 && (
                    <div className="w-full p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-red-600">Temps ecoule !</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {relevantIngredients.length > 0 && (
            <div className="p-4 bg-white rounded-xl border border-cream-200">
              <h3 className="text-sm font-semibold text-green-800 mb-3">Ingredients pour cette etape</h3>
              <div className="space-y-2">
                {relevantIngredients.map((ingredient) => {
                  const adjustedQuantity = (ingredient.quantity * multiplier).toFixed(1);
                  return (
                    <div
                      key={ingredient.id}
                      className="flex items-center justify-between p-2 bg-cream-50 rounded-lg"
                    >
                      <span className="text-sm text-green-800">{ingredient.name}</span>
                      <span className="text-sm text-green-600 font-medium">
                        {adjustedQuantity} {ingredient.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {adjustment && (adjustment.addedIngredients.length > 0 || adjustment.excludedIngredients.length > 0) && (
            <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
              <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gold-600" />
                Ajustements appliques
              </h3>
              {adjustment.excludedIngredients.length > 0 && (
                <p className="text-xs text-green-700 mb-1">
                  <span className="font-semibold">Exclus : </span>
                  {adjustment.excludedIngredients.join(', ')}
                </p>
              )}
              {adjustment.addedIngredients.length > 0 && (
                <p className="text-xs text-green-700">
                  <span className="font-semibold">Ajoutes : </span>
                  {adjustment.addedIngredients.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-cream-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="ghost"
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
            className="flex-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Precedent
          </Button>
          {currentStepIndex === steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleFinish}
              className="flex-1"
            >
              Terminer
              <Check className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNextStep}
              className="flex-1"
            >
              Suivant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
