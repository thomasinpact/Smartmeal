export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  calories: number;
  tags: string[];
}

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Ratatouille provencale',
    description: 'Un classique de la cuisine francaise, riche en legumes du soleil et en saveurs mediterraneennes.',
    image: 'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '25 min',
    calories: 180,
    tags: ['Frais', 'Herbace', 'Leger'],
  },
  {
    id: '2',
    title: 'Buddha bowl au poulet',
    description: 'Un repas equilibre et colore avec du poulet grille, des legumes croquants et une sauce onctueuse.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '20 min',
    calories: 350,
    tags: ['Proteine', 'Equilibre', 'Healthy'],
  },
  {
    id: '3',
    title: 'Salade de Tomates Fraiche et Savoureuse',
    description: 'Une salade simple et rafraichissante mettant en valeur la douceur naturelle des tomates, parfaites pour un accompagnement rapide.',
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '15 min',
    calories: 200,
    tags: ['Frais', 'Herbace', 'Leger'],
  },
  {
    id: '4',
    title: 'Pates au pesto maison',
    description: 'Des pates al dente nappes dun pesto basilic frais, parmesan et pignons de pin.',
    image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '15 min',
    calories: 420,
    tags: ['Italien', 'Rapide', 'Savoureux'],
  },
];

export const mockIngredients = [
  'Poulet',
  'Pates',
  'Epinards',
  'Mascarpone',
  'Tomates cerise',
];

export const mockCategories = [
  { id: 'healthy', label: 'Healthy', icon: 'leaf' },
  { id: 'vegetarien', label: 'Vegetarien', icon: 'carrot' },
  { id: 'rapidite', label: 'Rapidite', icon: 'clock' },
];

export const mockUser = {
  name: 'Rosa',
  email: 'rosarosa@gmail.com',
  plan: 'Free',
};
