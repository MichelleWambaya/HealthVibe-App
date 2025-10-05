export interface Remedy {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: string;
  reliefTime: string;
  precautions: string[];
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  effectiveness: number; // 1-5 stars
  isBookmarked?: boolean;
}

// Herb images for consistent herb representation across the app
export const herbImages = {
  ginger: "https://images.unsplash.com/photo-1599638392208-bc7a96d8d396?w=400&q=80",
  turmeric: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400&q=80",
  chamomile: "https://images.unsplash.com/photo-1595435742656-5272d0bc9b72?w=400&q=80",
  peppermint: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&q=80",
  lavender: "https://images.unsplash.com/photo-1611251135414-9c8e9ee8d4c5?w=400&q=80",
  aloeVera: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
  basil: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&q=80",
  rosemary: "https://images.unsplash.com/photo-1584278898630-7cfaa1ff7b66?w=400&q=80",
  thyme: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80",
  sage: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80",
  mint: "https://images.unsplash.com/photo-1628038187566-f0d24f38e64d?w=400&q=80",
  cinnamon: "https://images.unsplash.com/photo-1599940824399-7d0fa1c6e2bb?w=400&q=80"
};

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  remedyCount: number;
}

export interface User {
  name: string;
  preferences: {
    favoriteCategories: string[];
    bookmarkedRemedies: string[];
  };
}

// Sample user data
export const getCurrentUser = (): User => {
  if (typeof window === 'undefined') {
    // Server-side rendering - return default user
    return {
      name: 'User',
      preferences: {
        favoriteCategories: [],
        bookmarkedRemedies: []
      }
    }
  }
  
  const stored = localStorage.getItem('currentUser')
  if (stored) {
    return JSON.parse(stored)
  }
  
  const defaultUser: User = {
    name: 'User',
    preferences: {
      favoriteCategories: [],
      bookmarkedRemedies: []
    }
  }
  
  localStorage.setItem('currentUser', JSON.stringify(defaultUser))
  return defaultUser
}

export const updateUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}

// Helper functions for bookmarks
export const getBookmarkedRemedies = (): Remedy[] => {
  if (typeof window === 'undefined') return []
  
  const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedRemedies') || '[]')
  // Return empty array for now - will be replaced with Supabase data
  return []
}

export const toggleBookmark = (remedyId: string): void => {
  if (typeof window === 'undefined') return
  
  const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedRemedies') || '[]')
  const index = bookmarkedIds.indexOf(remedyId)
  
  if (index > -1) {
    bookmarkedIds.splice(index, 1)
  } else {
    bookmarkedIds.push(remedyId)
  }
  
  localStorage.setItem('bookmarkedRemedies', JSON.stringify(bookmarkedIds))
}

export const isBookmarked = (remedyId: string): boolean => {
  if (typeof window === 'undefined') return false
  
  const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedRemedies') || '[]')
  return bookmarkedIds.includes(remedyId)
}

// Categories data
export const categories: Category[] = [
  {
    id: 'respiratory',
    name: 'Respiratory',
    description: 'Natural remedies for breathing and lung health',
    icon: '🫁',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    remedyCount: 8
  },
  {
    id: 'digestive',
    name: 'Digestive',
    description: 'Stomach and digestive system remedies',
    icon: '🫀',
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    remedyCount: 6
  },
  {
    id: 'skin',
    name: 'Skin Conditions',
    description: 'Natural treatments for skin issues',
    icon: '✨',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    remedyCount: 7
  },
  {
    id: 'reproductive',
    name: 'Reproductive Health',
    description: 'Women\'s and men\'s reproductive wellness',
    icon: '🌸',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400',
    remedyCount: 5
  },
  {
    id: 'headaches',
    name: 'Headaches & Pain',
    description: 'Natural pain relief and headache remedies',
    icon: '🧠',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
    remedyCount: 9
  },
  {
    id: 'cold-flu',
    name: 'Cold & Flu',
    description: 'Immune system support and cold remedies',
    icon: '🌡️',
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400',
    remedyCount: 10
  },
  {
    id: 'sleep',
    name: 'Sleep Issues',
    description: 'Natural sleep aids and relaxation',
    icon: '🌙',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400',
    remedyCount: 6
  },
  {
    id: 'stress',
    name: 'Stress & Anxiety',
    description: 'Mental wellness and stress management',
    icon: '💚',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400',
    remedyCount: 8
  }
]

// Sample remedies data
export const remedies: Remedy[] = [
  {
    id: 'ginger-tea-cold',
    name: 'Ginger Honey Tea',
    description: 'A warming tea to soothe sore throat and reduce inflammation. Perfect for cold weather and respiratory issues.',
    ingredients: ['Fresh ginger root (1 inch)', 'Honey (2 tbsp)', 'Lemon juice (1 tbsp)', 'Hot water (1 cup)'],
    instructions: [
      'Peel and slice fresh ginger into thin pieces',
      'Boil water and add ginger slices',
      'Let it steep for 5-7 minutes',
      'Strain the tea and add honey and lemon',
      'Drink while warm, 2-3 times daily'
    ],
    preparationTime: '10 minutes',
    reliefTime: '15-30 minutes',
    precautions: ['Avoid if allergic to ginger', 'Not recommended for children under 2'],
    category: 'respiratory',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'peppermint-tea',
    name: 'Peppermint Tea for Digestion',
    description: 'Natural digestive aid to relieve stomach discomfort and bloating. Works great after heavy meals.',
    ingredients: ['Fresh peppermint leaves (1 handful)', 'Hot water (1 cup)', 'Honey (optional)'],
    instructions: [
      'Wash fresh peppermint leaves',
      'Boil water and pour over leaves',
      'Let steep for 5-7 minutes',
      'Strain and add honey if desired',
      'Drink after meals for best results'
    ],
    preparationTime: '8 minutes',
    reliefTime: '10-20 minutes',
    precautions: ['Avoid if you have GERD', 'May cause heartburn in some people'],
    category: 'digestive',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'honey-oatmeal-mask',
    name: 'Honey & Oatmeal Face Mask',
    description: 'Natural face mask for acne and skin irritation. Soothes and nourishes sensitive skin.',
    ingredients: ['Oatmeal (2 tbsp)', 'Raw honey (1 tbsp)', 'Water (1 tbsp)'],
    instructions: [
      'Mix oatmeal and honey in a bowl',
      'Add water gradually to form a paste',
      'Apply to clean face avoiding eye area',
      'Leave on for 15-20 minutes',
      'Rinse with warm water and pat dry'
    ],
    preparationTime: '5 minutes',
    reliefTime: 'Immediate soothing',
    precautions: ['Test on small area first', 'Avoid if allergic to honey'],
    category: 'skin',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'lavender-headache',
    name: 'Lavender Oil Headache Relief',
    description: 'Aromatherapy treatment for tension headaches. Apply to temples for quick relief.',
    ingredients: ['Lavender essential oil (2 drops)', 'Carrier oil (1 tsp)'],
    instructions: [
      'Mix lavender oil with carrier oil',
      'Apply to temples and forehead',
      'Gently massage in circular motions',
      'Breathe deeply and relax',
      'Repeat every 2-3 hours as needed'
    ],
    preparationTime: '5 minutes',
    reliefTime: '15-30 minutes',
    precautions: ['Dilute properly', 'Avoid contact with eyes'],
    category: 'headaches',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'chicken-soup',
    name: 'Immune-Boosting Chicken Soup',
    description: 'Nutritious soup to support immune system during illness. A classic comfort food.',
    ingredients: ['Chicken broth (4 cups)', 'Chicken breast (1 cup)', 'Vegetables (carrots, celery, onion)', 'Herbs (thyme, parsley)'],
    instructions: [
      'Simmer chicken broth in large pot',
      'Add diced vegetables and herbs',
      'Cook chicken breast and shred',
      'Add shredded chicken to soup',
      'Simmer for 20-30 minutes'
    ],
    preparationTime: '45 minutes',
    reliefTime: 'Gradual improvement',
    precautions: ['Ensure chicken is fully cooked', 'Store leftovers properly'],
    category: 'cold-flu',
    difficulty: 'Medium',
    effectiveness: 5
  },
  {
    id: 'chamomile-sleep',
    name: 'Chamomile Sleep Tea',
    description: 'Calming tea to promote relaxation and better sleep. Enjoy before bedtime.',
    ingredients: ['Chamomile flowers (1 tbsp)', 'Hot water (1 cup)', 'Honey (optional)'],
    instructions: [
      'Place chamomile flowers in tea strainer',
      'Pour hot water over flowers',
      'Let steep for 10-15 minutes',
      'Add honey if desired',
      'Drink 30 minutes before bed'
    ],
    preparationTime: '10 minutes',
    reliefTime: '20-30 minutes',
    precautions: ['May cause drowsiness', 'Avoid if allergic to ragweed'],
    category: 'sleep',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'breathing-technique',
    name: '4-7-8 Breathing Technique',
    description: 'A simple breathing exercise to reduce stress and promote relaxation. Can be done anywhere.',
    ingredients: [],
    instructions: [
      'Sit or lie in comfortable position',
      'Inhale through nose for 4 counts',
      'Hold breath for 7 counts',
      'Exhale through mouth for 8 counts',
      'Repeat 4-8 cycles'
    ],
    preparationTime: '5 minutes',
    reliefTime: 'Immediate',
    precautions: ['Start slowly', 'Stop if feeling dizzy'],
    category: 'stress',
    difficulty: 'Easy',
    effectiveness: 5
  },
  {
    id: 'ginger-turmeric-tea',
    name: 'Ginger Turmeric Anti-Inflammatory Tea',
    description: 'Powerful anti-inflammatory tea combining ginger and turmeric for joint pain relief.',
    ingredients: ['Fresh ginger (1 inch)', 'Turmeric powder (1 tsp)', 'Black pepper (pinch)', 'Honey (1 tbsp)', 'Hot water (1 cup)'],
    instructions: [
      'Slice ginger and add to hot water',
      'Add turmeric and black pepper',
      'Let steep for 10 minutes',
      'Strain and add honey',
      'Drink 2-3 times daily'
    ],
    preparationTime: '12 minutes',
    reliefTime: '30-60 minutes',
    precautions: ['May interact with blood thinners', 'Avoid on empty stomach'],
    category: 'headaches',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'eucalyptus-steam',
    name: 'Eucalyptus Steam Inhalation',
    description: 'Natural decongestant for stuffy nose and sinus relief. Great for cold and flu symptoms.',
    ingredients: ['Eucalyptus essential oil (3-5 drops)', 'Hot water (1 bowl)', 'Towel'],
    instructions: [
      'Boil water and let cool slightly',
      'Add eucalyptus oil to water',
      'Place face over bowl with towel covering head',
      'Breathe deeply for 5-10 minutes',
      'Repeat 2-3 times daily'
    ],
    preparationTime: '8 minutes',
    reliefTime: '10-15 minutes',
    precautions: ['Keep eyes closed', 'Use caution with hot water'],
    category: 'respiratory',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'aloe-sunburn',
    name: 'Aloe Vera Sunburn Relief',
    description: 'Cooling gel for sunburn relief and skin healing. Soothes inflammation and promotes healing.',
    ingredients: ['Fresh aloe vera gel (2 tbsp)', 'Coconut oil (1 tsp)', 'Lavender oil (2 drops)'],
    instructions: [
      'Extract fresh aloe gel from plant',
      'Mix with coconut oil and lavender',
      'Apply generously to affected areas',
      'Reapply every 2-3 hours',
      'Store unused gel in refrigerator'
    ],
    preparationTime: '10 minutes',
    reliefTime: 'Immediate cooling',
    precautions: ['Test for allergies first', 'Use fresh aloe when possible'],
    category: 'skin',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'magnesium-bath',
    name: 'Magnesium Epsom Salt Bath',
    description: 'Relaxing bath to relieve muscle tension and promote better sleep. Perfect for stress relief.',
    ingredients: ['Epsom salts (2 cups)', 'Lavender essential oil (5 drops)', 'Warm bath water'],
    instructions: [
      'Fill bathtub with warm water',
      'Add Epsom salts and lavender oil',
      'Soak for 20-30 minutes',
      'Relax and breathe deeply',
      'Pat dry and moisturize after'
    ],
    preparationTime: '5 minutes',
    reliefTime: 'During and after bath',
    precautions: ['Not recommended for open wounds', 'Stay hydrated'],
    category: 'stress',
    difficulty: 'Easy',
    effectiveness: 4
  },
  {
    id: 'probiotic-smoothie',
    name: 'Digestive Probiotic Smoothie',
    description: 'Gut-healthy smoothie with probiotics and fiber to support digestive wellness.',
    ingredients: ['Greek yogurt (1 cup)', 'Banana (1 medium)', 'Berries (1/2 cup)', 'Chia seeds (1 tbsp)', 'Honey (1 tsp)'],
    instructions: [
      'Add all ingredients to blender',
      'Blend until smooth and creamy',
      'Add water if too thick',
      'Drink immediately',
      'Enjoy daily for best results'
    ],
    preparationTime: '5 minutes',
    reliefTime: 'Gradual improvement',
    precautions: ['Start with small amounts', 'Monitor for digestive changes'],
    category: 'digestive',
    difficulty: 'Easy',
    effectiveness: 4
  }
]

// Helper functions
export const getRemediesByCategory = (categoryId: string): Remedy[] => {
  return remedies.filter(remedy => remedy.category === categoryId)
}

export const getRemedyById = (id: string): Remedy | undefined => {
  return remedies.find(remedy => remedy.id === id)
}

export const searchRemedies = (query: string): Remedy[] => {
  const lowercaseQuery = query.toLowerCase()
  return remedies.filter(remedy => 
    remedy.name.toLowerCase().includes(lowercaseQuery) ||
    remedy.description.toLowerCase().includes(lowercaseQuery) ||
    remedy.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
  )
}