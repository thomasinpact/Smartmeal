import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, Heart, Sparkles, Leaf, Globe, Package } from 'lucide-react';
import { Button } from '../components/ui';
import { useAppStore } from '../stores/useAppStore';
import { PREMIUM_PLANS, PlanId } from '../config/plans';

const features = [
  { id: 'recipes', icon: BookOpen, label: 'Recettes illimitees' },
  { id: 'favorites', icon: Heart, label: 'Sauve tes favoris' },
  { id: 'refine', icon: Sparkles, label: 'Affiner resultat' },
  { id: 'diet', icon: Leaf, label: 'Regime perso' },
  { id: 'world', icon: Globe, label: 'Cuisine du monde' },
  { id: 'pantry', icon: Package, label: 'Garde manger' },
];

export function PaywallPage() {
  const navigate = useNavigate();
  const { setPlan, addToast } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('annual');

  const handleSubscribe = () => {
    setPlan(selectedPlan);
    addToast(`Plan ${PREMIUM_PLANS.find(p => p.id === selectedPlan)?.displayName} active !`, 'success');
    navigate('/home');
  };

  const handleSkipToPremium = () => {
    setPlan('free');
    addToast('Mode gratuit active. Passez a Premium pour plus de fonctionnalites !', 'info');
    navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex justify-center gap-2 flex-1">
          <div className="w-8 h-1.5 rounded-full bg-green-600" />
          <div className="w-8 h-1.5 rounded-full bg-green-600" />
          <div className="w-8 h-1.5 rounded-full bg-green-600" />
        </div>
        <button
          onClick={handleSkipToPremium}
          className="p-2 -m-2 text-gold-500 hover:text-gold-600 transition-colors"
          aria-label="Passer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-green-600 mb-1">
          Moins de gaspi,
        </h1>
        <h2 className="text-2xl font-serif font-bold text-green-800">
          Plus de gout !
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {features.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center mb-2">
              <Icon className="w-5 h-5 text-gold-500" />
            </div>
            <span className="text-xs text-green-700 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-center text-sm text-green-600 mb-3 font-medium">
          Choisissez votre formule
        </p>
        <div className="flex gap-2">
          {PREMIUM_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`flex-1 relative p-3 rounded-2xl border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-green-600 bg-green-50 shadow-soft'
                  : 'border-cream-300 bg-white hover:border-cream-400'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                  {plan.badge}
                </span>
              )}
              <p className="text-xs text-green-600 font-medium mb-1">{plan.displayName}</p>
              <p className="text-lg font-bold text-green-800">{plan.priceDisplay} EUR</p>
              <p className="text-xs text-green-500">{plan.period}</p>
              {plan.discount && (
                <span className="mt-2 inline-block px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                  {plan.discount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Button fullWidth onClick={handleSubscribe}>
          Essaie gratuitement
        </Button>
        <Button fullWidth variant="ghost" onClick={handleSkipToPremium}>
          Rester en version gratuite
        </Button>
      </div>

      <div className="flex justify-center gap-6 text-sm mt-4">
        <button className="text-green-600 hover:text-green-700 transition-colors">
          Restaurer
        </button>
        <button className="text-green-600 hover:text-green-700 transition-colors">
          Code Promo
        </button>
      </div>
    </div>
  );
}
