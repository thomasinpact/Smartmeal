import { useState } from 'react';
import { Button, Input, Textarea } from '../components/ui';
import { useAppStore } from '../stores/useAppStore';
import { Youtube, Twitter, Instagram } from 'lucide-react';

export function ContactPage() {
  const { addToast } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Message envoye avec succes !', 'success');
    }, 1000);
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-serif font-bold text-green-800 mb-6">
        Contactez-nous
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input
          placeholder="Nom"
          required
        />
        <Input
          type="email"
          placeholder="Email"
          required
        />
        <Input
          type="tel"
          placeholder="Numero de telephone"
        />
        <Textarea
          placeholder="Message"
          rows={4}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Envoyer un Message
        </Button>
      </form>

      <div className="text-center mb-8">
        <p className="text-sm text-green-600 mb-4">
          Contact : SmartMeal@gmail.com
        </p>

        <div className="flex justify-center gap-8 text-sm text-green-700 mb-6">
          <button className="hover:text-green-800 transition-colors">
            Terme & conditions
          </button>
          <button className="hover:text-green-800 transition-colors">
            Qui sommes-nous ?
          </button>
          <button className="hover:text-green-800 transition-colors">
            Aide & support
          </button>
        </div>

        <p className="text-xs text-green-500 mb-4">
          Smart Meal 2026 - Tous droits reserves.
        </p>

        <div className="flex justify-center gap-4">
          <button className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors">
            <Youtube className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors">
            <Twitter className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors">
            <Instagram className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
