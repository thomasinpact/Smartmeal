export type PlanId = 'free' | 'weekly' | 'monthly' | 'annual';

export interface Plan {
  id: PlanId;
  name: string;
  displayName: string;
  price: number;
  priceDisplay: string;
  period: string;
  badge?: string;
  discount?: string;
  features: string[];
  popular?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    displayName: 'Gratuit',
    price: 0,
    priceDisplay: '0',
    period: 'toujours',
    features: [
      '3 recettes par jour',
      'Recettes de base',
      'Garde-manger limite',
    ],
  },
  weekly: {
    id: 'weekly',
    name: 'Weekly',
    displayName: 'Hebdo',
    price: 3.99,
    priceDisplay: '3,99',
    period: '/ semaine',
    features: [
      'Recettes illimitees',
      'Sauve tes favoris',
      'Affiner resultat',
      'Regime perso',
      'Cuisine du monde',
      'Garde manger',
    ],
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    displayName: 'Mensuel',
    price: 6.99,
    priceDisplay: '6,99',
    period: '/ mois',
    features: [
      'Recettes illimitees',
      'Sauve tes favoris',
      'Affiner resultat',
      'Regime perso',
      'Cuisine du monde',
      'Garde manger',
    ],
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    displayName: 'Annuel',
    price: 39.99,
    priceDisplay: '39,99',
    period: '/ an',
    badge: 'Meilleur',
    discount: '-80%',
    popular: true,
    features: [
      'Recettes illimitees',
      'Sauve tes favoris',
      'Affiner resultat',
      'Regime perso',
      'Cuisine du monde',
      'Garde manger',
      'Support prioritaire',
    ],
  },
};

export const PREMIUM_PLANS: Plan[] = [
  PLANS.weekly,
  PLANS.annual,
  PLANS.monthly,
];

export const PAYWALL_FEATURES = [
  { id: 'recipes', label: 'Recettes illimitees' },
  { id: 'favorites', label: 'Sauve tes favoris' },
  { id: 'refine', label: 'Affiner resultat' },
  { id: 'diet', label: 'Regime perso' },
  { id: 'world', label: 'Cuisine du monde' },
  { id: 'pantry', label: 'Garde manger' },
];
