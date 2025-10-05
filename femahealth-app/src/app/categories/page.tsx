'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { BottomNavigation } from '@/components/BottomNavigation'
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  FireIcon,
  SparklesIcon,
  SunIcon,
  CloudIcon,
  MoonIcon
} from '@heroicons/react/24/outline'

const categories = [
  {
    id: 'stress',
    name: 'Stress & Anxiety',
    description: 'Calming remedies for mental wellness',
    icon: CloudIcon,
    bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Lavender',
    remedyCount: 12
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    description: 'Natural remedies for breathing and lung health',
    icon: CloudIcon,
    bgImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Eucalyptus',
    remedyCount: 8
  },
  {
    id: 'digestive',
    name: 'Digestive',
    description: 'Stomach and digestive system remedies',
    icon: FireIcon,
    bgImage: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Ginger',
    remedyCount: 6
  },
  {
    id: 'skin',
    name: 'Skin Conditions',
    description: 'Natural treatments for skin issues',
    icon: SparklesIcon,
    bgImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Aloe Vera',
    remedyCount: 7
  },
  {
    id: 'reproductive',
    name: 'Reproductive Health',
    description: 'Women\'s and men\'s reproductive wellness',
    icon: HeartIcon,
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Chamomile',
    remedyCount: 5
  },
  {
    id: 'headaches',
    name: 'Headaches & Pain',
    description: 'Natural pain relief and headache remedies',
    icon: SunIcon,
    bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Peppermint',
    remedyCount: 9
  },
  {
    id: 'cold-flu',
    name: 'Cold & Flu',
    description: 'Immune system support and cold remedies',
    icon: CloudIcon,
    bgImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Elderberry',
    remedyCount: 10
  },
  {
    id: 'sleep',
    name: 'Sleep & Insomnia',
    description: 'Natural sleep aids and relaxation',
    icon: MoonIcon,
    bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Valerian',
    remedyCount: 8
  },
  {
    id: 'optical',
    name: 'Eye Health',
    description: 'Natural remedies for vision and eye care',
    icon: SunIcon,
    bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Bilberry',
    remedyCount: 4
  },
  {
    id: 'cardiovascular',
    name: 'Heart Health',
    description: 'Cardiovascular wellness and circulation',
    icon: HeartIcon,
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Hawthorn',
    remedyCount: 6
  },
  {
    id: 'musculoskeletal',
    name: 'Bone & Joint',
    description: 'Muscle, bone, and joint health',
    icon: FireIcon,
    bgImage: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Turmeric',
    remedyCount: 7
  },
  {
    id: 'neurological',
    name: 'Brain Health',
    description: 'Cognitive function and neurological wellness',
    icon: CloudIcon,
    bgImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Ginkgo',
    remedyCount: 5
  },
  {
    id: 'endocrine',
    name: 'Hormone Balance',
    description: 'Endocrine system and hormone regulation',
    icon: SunIcon,
    bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Ashwagandha',
    remedyCount: 6
  },
  {
    id: 'immune',
    name: 'Immune System',
    description: 'Natural immune support and defense',
    icon: CloudIcon,
    bgImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'Astragalus',
    remedyCount: 8
  },
  {
    id: 'mental-health',
    name: 'Mental Wellness',
    description: 'Depression, anxiety, and mental health support',
    icon: CloudIcon,
    bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    herb: 'St. John\'s Wort',
    remedyCount: 9
  }
]

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.herb.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20 pb-20">
      {/* Header */}
      <Header title="Health Categories" showBackButton={true} backHref="/" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-green-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 border border-green-200 dark:border-green-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 dark:bg-slate-800/80 shadow-lg text-lg font-body text-green-800 dark:text-green-200"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.bgImage}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Icon */}
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Herb Name */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-display text-white leading-tight drop-shadow-lg">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/90 font-body mt-1">
                    {category.herb} • {category.remedyCount} remedies
                  </p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-green-600 dark:text-green-400 font-body text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-display text-green-800 dark:text-green-200 mb-2">
              No categories found
            </h3>
            <p className="text-green-600 dark:text-green-400 font-body">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}