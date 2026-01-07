import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <img
        src="/fond_intro_appli.png"
        alt="Legumes frais"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 flex flex-col h-full px-6 py-8">
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-8 h-1.5 rounded-full bg-white" />
          <div className="w-8 h-1.5 rounded-full bg-white/50" />
          <div className="w-8 h-1.5 rounded-full bg-white/50" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-serif font-bold text-white drop-shadow-lg">Smart</span>
              <span className="text-2xl">🥕</span>
              <span className="text-2xl font-serif font-bold text-white drop-shadow-lg">Meal</span>
            </div>
            <p className="text-sm text-white/90 mb-1 drop-shadow">Bienvenue chez Smart Meal</p>
            <h1 className="text-3xl font-serif font-bold text-white drop-shadow-lg">En cuisine !</h1>
          </div>
        </div>

        <div className="mt-auto">
          <Button fullWidth onClick={() => navigate('/login')}>
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
