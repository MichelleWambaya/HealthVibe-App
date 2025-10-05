'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Spinner, HerbSpinner, WaveSpinner } from '@/components/Spinner';
import { validateSearchQuery } from '@/lib/validation';
import { toggleBookmark, isBookmarked } from '@/lib/data';
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  ClockIcon,
  StarIcon,
  ArrowLeftIcon,
  SparklesIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AIRemedy {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  effectiveness: number;
  preparationTime: string;
  reliefTime: string;
  ingredients: string[];
  instructions: string[];
  precautions: string[];
  benefits: string[];
  isAIGenerated: boolean;
  searchQuery: string;
  image: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<AIRemedy[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookmarkedRemedies, setBookmarkedRemedies] = useState<Set<string>>(new Set());
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedRemedy, setSelectedRemedy] = useState<AIRemedy | null>(null);
  const [showRemedyModal, setShowRemedyModal] = useState(false);

  // AI Remedy Generation Function - Returns top 3 best remedies
  const generateTop3AIRemedies = async (query: string): Promise<AIRemedy[]> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const queryLower = query.toLowerCase();
    const remedies: AIRemedy[] = [];
    
    // Generate 3 different approaches for the same condition
    const approaches = [
      { name: 'Traditional Herbal', difficulty: 'Easy' as const, effectiveness: 4 },
      { name: 'Modern Natural', difficulty: 'Medium' as const, effectiveness: 5 },
      { name: 'Advanced Blend', difficulty: 'Advanced' as const, effectiveness: 5 }
    ];
    
    approaches.forEach((approach, index) => {
      const id = `ai-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
      
      const remedy: AIRemedy = {
        id,
        name: generateRemedyName(query, approach.name),
        description: generateDescription(query, approach.name),
        category: determineCategory(query),
        difficulty: approach.difficulty,
        effectiveness: approach.effectiveness,
        preparationTime: generatePreparationTime(query, approach.difficulty),
        reliefTime: generateReliefTime(query),
        ingredients: generateIngredients(query, approach.difficulty),
        instructions: generateInstructions(query, approach.difficulty),
        precautions: generatePrecautions(query),
        benefits: generateBenefits(query),
        isAIGenerated: true,
        searchQuery: query,
        image: generateRemedyImage(query, index)
      };
      
      remedies.push(remedy);
    });
    
    return remedies;
  };

  // AI Helper Functions
  const generateRemedyName = (query: string, approach?: string): string => {
    const baseRemedies = {
      'headache': 'Headache Relief',
      'cold': 'Cold Remedy',
      'cough': 'Cough Syrup',
      'fever': 'Fever-Reducing',
      'stomach': 'Digestive Comfort',
      'sleep': 'Sleep Aid',
      'stress': 'Stress Relief',
      'anxiety': 'Anxiety Calming',
      'pain': 'Pain Relief',
      'inflammation': 'Anti-Inflammatory',
      'skin': 'Skin Healing',
      'acne': 'Acne Clearing',
      'digestion': 'Digestive Health',
      'energy': 'Energy Booster',
      'immune': 'Immune Support'
    };
    
    let baseName = '';
    for (const [key, remedy] of Object.entries(baseRemedies)) {
      if (query.toLowerCase().includes(key)) {
        baseName = remedy;
        break;
      }
    }
    
    if (!baseName) {
      baseName = `${query.charAt(0).toUpperCase() + query.slice(1)} Remedy`;
    }
    
    if (approach) {
      return `${approach} ${baseName}`;
    }
    
    return `Natural ${baseName}`;
  };

  const generateRemedyImage = (query: string, variant: number = 0): string => {
    const queryLower = query.toLowerCase();
    
    // Map search queries to herb-related Unsplash images
    const imageMap = {
      'headache': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Lavender
      'cold': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Ginger
      'cough': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Ginger
      'fever': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Ginger
      'stomach': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Mint
      'digestive': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Mint
      'digestion': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Mint
      'sleep': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Chamomile
      'insomnia': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Chamomile
      'stress': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Sage
      'anxiety': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Sage
      'pain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Rosemary
      'inflammation': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Rosemary
      'skin': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Aloe Vera
      'acne': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Aloe Vera
      'energy': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Green Tea
      'immune': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Ginger
      'turmeric': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Turmeric
      'ginger': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Ginger
      'lavender': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Lavender
      'mint': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Mint
      'chamomile': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Chamomile
      'rosemary': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Rosemary
      'sage': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Sage
      'thyme': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Thyme
      'basil': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Basil
      'oregano': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Oregano
      'eucalyptus': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Eucalyptus
      'aloe': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Aloe Vera
      'green tea': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Green Tea
      'herbal': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Herbal mix
      'natural': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop&crop=center&auto=format&q=80' // Natural herbs
    };
    
    // Check for specific keywords
    for (const [key, image] of Object.entries(imageMap)) {
      if (queryLower.includes(key)) {
        return image;
      }
    }
    
    // Default fallback herb images
    const defaultHerbImages = [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Chamomile
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Sage
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Ginger
      'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Mint
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Rosemary
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Lavender
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=600&fit=crop&crop=center&auto=format&q=80', // Turmeric
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center&auto=format&q=80'  // Aloe Vera
    ];
    
    return defaultHerbImages[Math.floor(Math.random() * defaultHerbImages.length)];
  };

  const generateDescription = (query: string, approach?: string): string => {
    const baseDescription = `A carefully crafted natural remedy designed to address ${query}.`;
    
    if (approach === 'Traditional Herbal') {
      return `${baseDescription} This traditional approach uses time-tested herbal wisdom passed down through generations. Gentle, safe, and effective for daily use.`;
    } else if (approach === 'Modern Natural') {
      return `${baseDescription} This modern approach combines traditional herbs with contemporary understanding of natural healing. Balanced, potent, and scientifically informed.`;
    } else if (approach === 'Advanced Blend') {
      return `${baseDescription} This advanced approach uses complex herbal combinations and precise preparation methods. Powerful, comprehensive, and designed for maximum effectiveness.`;
    }
    
    return `${baseDescription} This solution combines traditional herbal wisdom with modern understanding of natural healing properties. Safe, effective, and easy to prepare at home.`;
  };

  const determineCategory = (query: string): string => {
    const categories = {
      'headache': 'headaches',
      'cold': 'cold-flu',
      'cough': 'respiratory',
      'fever': 'cold-flu',
      'stomach': 'digestive',
      'sleep': 'sleep',
      'stress': 'stress',
      'anxiety': 'stress',
      'pain': 'headaches',
      'inflammation': 'headaches',
      'skin': 'skin',
      'acne': 'skin',
      'digestion': 'digestive',
      'energy': 'stress',
      'immune': 'cold-flu'
    };
    
    for (const [key, category] of Object.entries(categories)) {
      if (query.toLowerCase().includes(key)) {
        return category;
      }
    }
    
    return 'stress'; // default category
  };

  const determineDifficulty = (query: string): 'Easy' | 'Medium' | 'Advanced' => {
    const easyKeywords = ['tea', 'drink', 'simple', 'quick', 'basic'];
    const mediumKeywords = ['syrup', 'tincture', 'extract', 'blend'];
    const advancedKeywords = ['complex', 'advanced', 'extract', 'distillation'];
    
    const queryLower = query.toLowerCase();
    
    if (advancedKeywords.some(keyword => queryLower.includes(keyword))) {
      return 'Advanced';
    } else if (mediumKeywords.some(keyword => queryLower.includes(keyword))) {
      return 'Medium';
    } else {
      return 'Easy';
    }
  };

  const generatePreparationTime = (query: string, difficulty?: string): string => {
    if (difficulty === 'Easy') {
      const easyTimes = ['5 minutes', '10 minutes', '15 minutes'];
      return easyTimes[Math.floor(Math.random() * easyTimes.length)];
    } else if (difficulty === 'Medium') {
      const mediumTimes = ['15 minutes', '20 minutes', '25 minutes'];
      return mediumTimes[Math.floor(Math.random() * mediumTimes.length)];
    } else if (difficulty === 'Advanced') {
      const advancedTimes = ['30 minutes', '45 minutes', '1 hour'];
      return advancedTimes[Math.floor(Math.random() * advancedTimes.length)];
    }
    
    const times = ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '30 minutes'];
    return times[Math.floor(Math.random() * times.length)];
  };

  const generateReliefTime = (query: string): string => {
    const times = ['15-30 minutes', '30-60 minutes', '1-2 hours', '2-4 hours', 'Gradual improvement'];
    return times[Math.floor(Math.random() * times.length)];
  };

  const generateIngredients = (query: string, difficulty?: string): string[] => {
    const easyIngredients = [
      'Fresh ginger root (1 inch)',
      'Raw honey (2 tbsp)',
      'Lemon juice (1 tbsp)',
      'Hot water (1 cup)',
      'Fresh mint leaves (5-6)',
      'Chamomile flowers (1 tbsp)'
    ];
    
    const mediumIngredients = [
      'Fresh ginger root (1 inch)',
      'Raw honey (2 tbsp)',
      'Lemon juice (1 tbsp)',
      'Hot water (1 cup)',
      'Turmeric powder (1 tsp)',
      'Cinnamon stick (1)',
      'Fresh mint leaves (5-6)',
      'Chamomile flowers (1 tbsp)',
      'Eucalyptus oil (2 drops)',
      'Coconut oil (1 tsp)'
    ];
    
    const advancedIngredients = [
      'Fresh ginger root (2 inches)',
      'Raw honey (3 tbsp)',
      'Lemon juice (2 tbsp)',
      'Hot water (2 cups)',
      'Turmeric powder (2 tsp)',
      'Cinnamon stick (2)',
      'Fresh mint leaves (10-12)',
      'Chamomile flowers (2 tbsp)',
      'Eucalyptus oil (4 drops)',
      'Coconut oil (2 tsp)',
      'Cardamom pods (3)',
      'Star anise (1)',
      'Cloves (4)',
      'Black pepper (1/2 tsp)'
    ];
    
    if (difficulty === 'Easy') {
      const shuffled = easyIngredients.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    } else if (difficulty === 'Medium') {
      const shuffled = mediumIngredients.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6);
    } else if (difficulty === 'Advanced') {
      const shuffled = advancedIngredients.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 8);
    }
    
    // Default fallback
    const shuffled = mediumIngredients.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  const generateInstructions = (query: string, difficulty?: string): string[] => {
    const baseInstructions = [
      'Gather all ingredients and prepare your workspace',
      'Clean and prepare fresh ingredients as needed',
      'Follow the specific preparation method for your remedy',
      'Allow proper steeping or preparation time',
      'Strain and prepare for consumption',
      'Store any remaining remedy properly',
      'Use as directed for best results'
    ];
    
    if (difficulty === 'Easy') {
      return [
        'Gather all ingredients',
        'Prepare fresh ingredients',
        'Combine ingredients as directed',
        'Allow to steep for 5-10 minutes',
        'Strain and serve',
        'Use immediately for best results'
      ];
    } else if (difficulty === 'Medium') {
      return [
        'Gather all ingredients and prepare workspace',
        'Clean and prepare fresh ingredients',
        'Follow specific preparation method',
        'Allow proper steeping time (10-15 minutes)',
        'Strain carefully and prepare for consumption',
        'Store remaining remedy in refrigerator',
        'Use as directed for optimal results'
      ];
    } else if (difficulty === 'Advanced') {
      return [
        'Gather all ingredients and prepare sterile workspace',
        'Clean and prepare fresh ingredients with precision',
        'Follow advanced preparation techniques',
        'Allow extended steeping time (20-30 minutes)',
        'Strain through fine mesh and prepare for consumption',
        'Store remaining remedy in proper containers',
        'Use as directed with careful monitoring',
        'Document results for future reference'
      ];
    }
    
    return baseInstructions;
  };

  const generatePrecautions = (query: string): string[] => {
    return [
      'Consult with a healthcare provider before use',
      'Discontinue if any adverse reactions occur',
      'Not recommended for children under 2 years',
      'Use in moderation during pregnancy',
      'Check for ingredient allergies before use'
    ];
  };

  const generateBenefits = (query: string): string[] => {
    return [
      'Natural and chemical-free approach',
      'Supports overall wellness',
      'Easy to prepare at home',
      'Cost-effective solution',
      'Traditional healing wisdom',
      'Minimal side effects when used properly'
    ];
  };

  // Remove the automatic search useEffect and replace with manual search
  const handleSearch = async () => {
    const validation = validateSearchQuery(searchQuery);
    
    if (!validation.isValid) {
      alert('Please enter a valid search query (2-100 characters)');
      return;
    }

    const sanitizedQuery = validation.sanitized;
    setIsSearching(true);
    
    // Check if we already have AI remedies for this query
    const existingRemedies = results.filter(r => r.searchQuery.toLowerCase() === sanitizedQuery.toLowerCase());

    if (existingRemedies.length === 0) {
      setIsGenerating(true);
      try {
        const remedies = await generateTop3AIRemedies(sanitizedQuery);
        setResults(prev => [...remedies, ...prev]);
        
        // Track AI search activity
        if (typeof window !== 'undefined') {
          // Increment AI searches count
          const currentCount = parseInt(localStorage.getItem('aiSearches') || '0');
          localStorage.setItem('aiSearches', (currentCount + 1).toString());
          
          // Add to activity log
          const activity = JSON.parse(localStorage.getItem('userActivity') || '[]');
          const newActivity = {
            type: 'ai_search',
            description: `Searched for "${sanitizedQuery}" remedies`,
            timestamp: new Date().toLocaleString(),
            query: sanitizedQuery
          };
          activity.unshift(newActivity);
          localStorage.setItem('userActivity', JSON.stringify(activity.slice(0, 20)));
        }
        
        // Add to recent searches
        setRecentSearches(prev => {
          const filtered = prev.filter(s => s.toLowerCase() !== sanitizedQuery.toLowerCase());
          return [sanitizedQuery, ...filtered].slice(0, 5);
        });
      } catch (error) {
        console.error('Error generating remedies:', error);
        alert('Failed to generate remedies. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
    
    setIsSearching(false);
  };

  useEffect(() => {
    // Load bookmarked remedies
    const bookmarked = new Set<string>();
    results.forEach(remedy => {
      if (isBookmarked(remedy.id)) {
        bookmarked.add(remedy.id);
      }
    });
    setBookmarkedRemedies(bookmarked);
  }, [results]);

  const handleBookmark = (remedyId: string) => {
    const wasBookmarked = bookmarkedRemedies.has(remedyId);
    toggleBookmark(remedyId);
    setBookmarkedRemedies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(remedyId)) {
        newSet.delete(remedyId);
      } else {
        newSet.add(remedyId);
      }
      return newSet;
    });
    
    // Track bookmark activity
    if (typeof window !== 'undefined' && !wasBookmarked) {
      const activity = JSON.parse(localStorage.getItem('userActivity') || '[]');
      const remedy = results.find(r => r.id === remedyId);
      const newActivity = {
        type: 'bookmark',
        description: `Bookmarked "${remedy?.name || 'remedy'}"`,
        timestamp: new Date().toLocaleString(),
        remedyId: remedyId
      };
      activity.unshift(newActivity);
      localStorage.setItem('userActivity', JSON.stringify(activity.slice(0, 20)));
    }
  };

  const handleViewRemedy = (remedy: AIRemedy) => {
    setSelectedRemedy(remedy);
    setShowRemedyModal(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'respiratory': '🫁',
      'digestive': '🫀',
      'skin': '✨',
      'headaches': '🧠',
      'cold-flu': '🌡️',
      'sleep': '🌙',
      'stress': '💚'
    };
    return icons[category as keyof typeof icons] || '🌿';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20 pb-20">
      {/* Header */}
      <Header title="AI Remedy Search" showBackButton={true} backHref="/" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-green-800 dark:text-green-200 mb-4">
            AI-Powered Remedy Generator
          </h1>
          <p className="text-base sm:text-lg text-green-600 dark:text-green-400 font-body max-w-2xl mx-auto">
            Search for any health concern and our AI will instantly create a personalized natural remedy for you
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-green-400" />
            </div>
            <input
              type="text"
              placeholder="Search for any health concern (e.g., headache, cold, stress, insomnia)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-14 pr-20 py-4 border border-green-200 dark:border-green-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 dark:bg-slate-800/80 shadow-lg text-lg font-body text-green-800 dark:text-green-200"
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching || isGenerating}
              className="absolute right-2 top-2 bottom-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-body rounded-xl transition-colors flex items-center"
            >
              {isSearching || isGenerating ? (
                <>
                  <Spinner size="small" color="white" className="mr-2" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {/* AI Generation Status */}
        {isGenerating && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center">
                <HerbSpinner className="mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    AI is creating your remedy...
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Analyzing your search and generating a personalized natural remedy
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-4">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors text-sm font-body"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Suggestions */}
        {!searchQuery && (
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-4">Try searching for:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'headache relief',
                'cold symptoms',
                'stress management',
                'sleep problems',
                'digestive issues',
                'skin problems',
                'anxiety relief',
                'energy boost'
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="p-3 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-xl transition-colors text-sm font-body text-center"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-slate-600 dark:text-slate-400">
              {results.length > 0 ? `Top 3 AI-Generated Remedies for` : 'Generating top 3 remedies for'} &ldquo;<span className="font-semibold">{searchQuery}</span>&rdquo;
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((remedy) => (
            <div
              key={remedy.id}
              className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
            >
              {/* Herb Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={remedy.image}
                  alt={remedy.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* AI Generated Badge */}
                {remedy.isAIGenerated && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      AI Generated
                    </div>
                  </div>
                )}

                {/* Bookmark Button */}
                <button
                  onClick={() => handleBookmark(remedy.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  {bookmarkedRemedies.has(remedy.id) ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Remedy Name Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-display text-white leading-tight drop-shadow-lg">
                    {remedy.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-green-600 dark:text-green-400 font-body text-sm mb-4">
                  {remedy.description}
                </p>

                {/* Category */}
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">{getCategoryIcon(remedy.category)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-body ${getDifficultyColor(remedy.difficulty)}`}>
                    {remedy.difficulty}
                  </span>
                </div>

                {/* Ingredients Preview */}
                <div className="mb-4">
                  <div className="text-xs font-display text-green-700 dark:text-green-300 mb-2">Key Ingredients:</div>
                  <div className="flex flex-wrap gap-1">
                    {remedy.ingredients.slice(0, 3).map((ingredient, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-body"
                      >
                        {ingredient.split('(')[0].trim()}
                      </span>
                    ))}
                    {remedy.ingredients.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-body">
                        +{remedy.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400 font-body mb-4">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{remedy.preparationTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(remedy.effectiveness)}
                    <span className="ml-1">{remedy.effectiveness}/5</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewRemedy(remedy)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-body rounded-xl transition-colors"
                >
                  <span>View Full Recipe</span>
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && results.length === 0 && !isGenerating && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-display text-green-800 dark:text-green-200 mb-2">
              Generating your remedy...
            </h3>
            <p className="text-green-600 dark:text-green-400 font-body">
              Our AI is creating a personalized remedy for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                AI-Generated Remedies Disclaimer
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                These remedies are generated by AI for educational purposes only. Always consult with a healthcare provider before trying new remedies, especially if you have existing health conditions or are taking medications. The AI-generated content should not replace professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Remedy Detail Modal */}
      {showRemedyModal && selectedRemedy && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRemedyModal(false)
            }
          }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto mb-20">
            <div className="relative">
              {/* Modal Header */}
              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedRemedy.image}
                  alt={selectedRemedy.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setShowRemedyModal(false)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-lg z-10"
                >
                  <span className="text-gray-800 dark:text-gray-200 text-xl font-bold">×</span>
                </button>

                {/* AI Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                    <SparklesIcon className="w-3 h-3 mr-1" />
                    AI Generated
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-display text-white leading-tight drop-shadow-lg">
                    {selectedRemedy.name}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-green-600 dark:text-green-400 font-body text-sm mb-6">
                  {selectedRemedy.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-display text-green-800 dark:text-green-200">
                      {selectedRemedy.preparationTime}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-body">Prep Time</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-display text-green-800 dark:text-green-200">
                      {selectedRemedy.reliefTime}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-body">Relief Time</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      {renderStars(selectedRemedy.effectiveness)}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-body">Effectiveness</div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-3">Ingredients</h3>
                  <div className="space-y-2">
                    {selectedRemedy.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-green-700 dark:text-green-300 font-body text-sm">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                  <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-3">Instructions</h3>
                  <div className="space-y-3">
                    {selectedRemedy.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-green-700 dark:text-green-300 font-body text-sm">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Precautions */}
                <div className="mb-6">
                  <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-3">Precautions</h3>
                  <div className="space-y-2">
                    {selectedRemedy.precautions.map((precaution, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-yellow-700 dark:text-yellow-300 font-body text-sm">{precaution}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-3">Benefits</h3>
                  <div className="space-y-2">
                    {selectedRemedy.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-700 dark:text-blue-300 font-body text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBookmark(selectedRemedy.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-body rounded-xl transition-colors"
                  >
                    {bookmarkedRemedies.has(selectedRemedy.id) ? (
                      <>
                        <HeartIconSolid className="w-4 h-4" />
                        <span>Bookmarked</span>
                      </>
                    ) : (
                      <>
                        <HeartIcon className="w-4 h-4" />
                        <span>Bookmark</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowRemedyModal(false)}
                    className="px-6 py-3 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 font-body rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}