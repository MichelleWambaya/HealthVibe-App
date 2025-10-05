'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { BottomNavigation } from '@/components/BottomNavigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { remedies, toggleBookmark, isBookmarked } from '@/lib/data'
import type { Remedy } from '@/lib/data'
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  StarIcon,
  ChevronRightIcon,
  SparklesIcon,
  SunIcon,
  CloudIcon,
  FireIcon,
  MoonIcon,
  EyeIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

const categoryIcons = [
  { id: 'all', name: 'All Categories', icon: SparklesIcon },
  { id: 'respiratory', name: 'Respiratory', icon: CloudIcon },
  { id: 'digestive', name: 'Digestive', icon: FireIcon },
  { id: 'skin', name: 'Skin Conditions', icon: SparklesIcon },
  { id: 'headaches', name: 'Headaches & Pain', icon: SunIcon },
  { id: 'cold-flu', name: 'Cold & Flu', icon: CloudIcon },
  { id: 'sleep', name: 'Sleep Issues', icon: MoonIcon },
  { id: 'stress', name: 'Stress & Anxiety', icon: FaceSmileIcon },
]

// Theme-related images for each remedy - Updated with proper herb/nature images
const remedyImages: Record<string, string> = {
  'ginger-tea-cold': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
  'peppermint-tea': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
  'honey-oatmeal-mask': 'https://images.unsplash.com/photo-1590595900300-08711d11188d?w=400&h=550&fit=crop&crop=center&auto=format&q=80',
  'lavender-headache': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=650&fit=crop&crop=center&auto=format&q=80',
  'chicken-soup': 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&h=580&fit=crop&crop=center&auto=format&q=80',
  'chamomile-sleep': 'https://images.unsplash.com/photo-1576092762791-fda094e6a07e?w=400&h=520&fit=crop&crop=center&auto=format&q=80',
  'breathing-technique': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=480&fit=crop&crop=center&auto=format&q=80',
  'ginger-turmeric-tea': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
  'eucalyptus-steam': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=550&fit=crop&crop=center&auto=format&q=80',
  'aloe-sunburn': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
  'magnesium-bath': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
  'probiotic-smoothie': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop&crop=center&auto=format&q=80',
}

// Mock creator data
const getCreatorData = () => {
  const creators = [
    { name: 'Dr. Sarah Chen', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face', isUserGenerated: false },
    { name: 'Maria Rodriguez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', isUserGenerated: true },
    { name: 'Dr. Michael Park', avatar: 'https://images.unsplash.com/photo-1560250097-0b73528c311a?w=100&h=100&fit=crop&crop=face', isUserGenerated: false },
    { name: 'Lisa Wang', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', isUserGenerated: true },
    { name: 'Dr. Emily Johnson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', isUserGenerated: false },
    { name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', isUserGenerated: true },
    { name: 'Dr. Priya Patel', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734b584?w=100&h=100&fit=crop&crop=face', isUserGenerated: false },
  ]
  return creators[Math.floor(Math.random() * creators.length)]
}

// Mock stats
const getMockStats = () => {
  return {
    views: Math.floor(Math.random() * 2000) + 500,
    likes: Math.floor(Math.random() * 200) + 20,
  }
}

export default function RemediesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredRemedies, setFilteredRemedies] = useState<Remedy[]>(remedies)
  const [likedRemedies, setLikedRemedies] = useState<Set<string>>(new Set())
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})

  useEffect(() => {
    let filtered = remedies

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(remedy => remedy.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(remedy =>
        remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remedy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remedy.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    setFilteredRemedies(filtered)
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    // Load bookmarked remedies
    const bookmarked = new Set()
    remedies.forEach(remedy => {
      if (isBookmarked(remedy.id)) {
        bookmarked.add(remedy.id)
      }
    })
    setLikedRemedies(bookmarked)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  const toggleLike = (remedyId: string) => {
    const wasLiked = likedRemedies.has(remedyId)
    toggleBookmark(remedyId)
    setLikedRemedies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(remedyId)) {
        newSet.delete(remedyId)
      } else {
        newSet.add(remedyId)
      }
      return newSet
    })
    
    // Track bookmark activity
    if (typeof window !== 'undefined' && !wasLiked) {
      const activity = JSON.parse(localStorage.getItem('userActivity') || '[]');
      const remedy = remedies.find(r => r.id === remedyId);
      const newActivity = {
        type: 'bookmark',
        description: `Bookmarked "${remedy?.name || 'remedy'}"`,
        timestamp: new Date().toLocaleString(),
        remedyId: remedyId
      };
      activity.unshift(newActivity);
      localStorage.setItem('userActivity', JSON.stringify(activity.slice(0, 20)));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20 pb-20">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-green-200/50 dark:border-green-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-display text-green-800 dark:text-green-200">Remedies</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-green-800 dark:text-green-200 mb-4">
            Natural Remedies
          </h1>
          <p className="text-base sm:text-lg text-green-600 dark:text-green-400 font-body max-w-2xl mx-auto">
            Discover healing solutions from our community and verified experts
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
              placeholder="Search remedies, ingredients, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 border border-green-200 dark:border-green-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 dark:bg-slate-800/80 shadow-lg text-lg font-body text-green-800 dark:text-green-200"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          {categoryIcons.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-body ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-slate-800/80 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
          {filteredRemedies.map((remedy) => {
            const creator = getCreatorData()
            const stats = getMockStats()
            const image = remedyImages[remedy.id] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center&auto=format&q=80'
            
            return (
              <div
                key={remedy.id}
                className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden mb-4 sm:mb-6 break-inside-avoid hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={image}
                    alt={remedy.name}
                    className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleLike(remedy.id)}
                      className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                      {likedRemedies.has(remedy.id) ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Creator Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-800/90 rounded-full px-3 py-2 shadow-lg">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-body text-green-800 dark:text-green-200">
                        {creator.name}
                      </span>
                      {creator.isUserGenerated && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Community Contributor"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-display text-green-800 dark:text-green-200 leading-tight">
                      {remedy.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-body ${getDifficultyColor(remedy.difficulty)}`}>
                      {remedy.difficulty}
                    </span>
                  </div>

                  <p className="text-green-600 dark:text-green-400 font-body text-sm sm:text-base mb-4 leading-relaxed">
                    {remedy.description}
                  </p>

                  {/* Ingredients */}
                  <div className="mb-4">
                    <div className="text-xs font-display text-green-700 dark:text-green-300 mb-2">Ingredients:</div>
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
                      <EyeIcon className="w-4 h-4" />
                      <span>{stats.views}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(remedy.effectiveness)}
                      <span className="text-sm text-green-600 dark:text-green-400 font-body ml-1">
                        {remedy.effectiveness}/5
                      </span>
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-body">
                      {stats.likes} likes
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/remedy/${remedy.id}`}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-body rounded-xl transition-colors"
                  >
                    <span>View Recipe</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredRemedies.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-display text-green-800 dark:text-green-200 mb-2">
              No remedies found
            </h3>
            <p className="text-green-600 dark:text-green-400 font-body">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}