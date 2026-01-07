import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      <div className="flex justify-center gap-2 mb-8">
        <div className="w-8 h-1.5 rounded-full bg-green-600" />
        <div className="w-8 h-1.5 rounded-full bg-cream-300" />
        <div className="w-8 h-1.5 rounded-full bg-cream-300" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 mb-8">
          <img
            src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Legumes frais"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-serif font-bold text-green-600">Smart</span>
            <span className="text-2xl">🥕</span>
            <span className="text-2xl font-serif font-bold text-green-600">Meal</span>
          </div>
          <p className="text-sm text-gold-500 mb-1">Bienvenue chez Smart Meal</p>
          <h1 className="text-3xl font-serif font-bold text-green-800">En cuisine !</h1>
        </div>
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate('/login')}>
          Continuer
        </Button>
      </div>
    </div>
  );
}
