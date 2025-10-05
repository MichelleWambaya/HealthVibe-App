'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BottomNavigation } from '@/components/BottomNavigation'
import { useAuth } from '@/components/AuthProvider'
import { getRemedyById, toggleBookmark, isBookmarked as checkBookmarked } from '@/lib/data'
import { 
  ArrowLeftIcon,
  ClockIcon,
  HeartIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  BookmarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'

interface RemedyDetailProps {
  params: Promise<{
    id: string
  }>
}

export default function RemedyDetailPage({ params }: RemedyDetailProps) {
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [userRating, setUserRating] = useState<number>(0)
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params)
  const remedy = getRemedyById(id)

  useEffect(() => {
    if (remedy) {
      setIsBookmarked(checkBookmarked(remedy.id))
      
      // Load user's existing rating for this remedy
      if (typeof window !== 'undefined' && user) {
        const remedyRatings = JSON.parse(localStorage.getItem('remedyRatings') || '{}')
        setUserRating(remedyRatings[remedy.id] || 0)
      }
    }
  }, [remedy, user])

  if (!remedy) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Remedy Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The remedy you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/remedies"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Browse All Remedies
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  const handleBookmark = () => {
    if (!user) {
      // Show auth modal or redirect to sign in
      return
    }
    
    const wasBookmarked = isBookmarked;
    toggleBookmark(remedy.id)
    setIsBookmarked(!isBookmarked)
    
    // Track bookmark activity
    if (typeof window !== 'undefined' && !wasBookmarked) {
      const activity = JSON.parse(localStorage.getItem('userActivity') || '[]');
      const newActivity = {
        type: 'bookmark',
        description: `Bookmarked "${remedy.name}"`,
        timestamp: new Date().toLocaleString(),
        remedyId: remedy.id
      };
      activity.unshift(newActivity);
      localStorage.setItem('userActivity', JSON.stringify(activity.slice(0, 20)));
    }
  }

  const handleRating = (rating: number) => {
    if (!user) {
      return
    }
    
    setUserRating(rating)
    
    // Track rating activity
    if (typeof window !== 'undefined') {
      // Store user ratings for this specific remedy
      const remedyRatings = JSON.parse(localStorage.getItem('remedyRatings') || '{}')
      remedyRatings[remedy.id] = rating
      localStorage.setItem('remedyRatings', JSON.stringify(remedyRatings))
      
      // Store general user ratings
      const userRatings = JSON.parse(localStorage.getItem('userRatings') || '[]')
      userRatings.push(rating)
      localStorage.setItem('userRatings', JSON.stringify(userRatings))
      
      // Add to activity log
      const activity = JSON.parse(localStorage.getItem('userActivity') || '[]')
      const newActivity = {
        type: 'rating',
        description: `Rated "${remedy.name}" ${rating} stars`,
        timestamp: new Date().toLocaleString(),
        remedyId: remedy.id,
        rating: rating
      };
      activity.unshift(newActivity);
      localStorage.setItem('userActivity', JSON.stringify(activity.slice(0, 20)));
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: remedy.name,
        text: remedy.description,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/remedies"
                className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </Link>
              <Logo />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmark}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                {isBookmarked ? (
                  <BookmarkIconSolid className="h-6 w-6 text-blue-600" />
                ) : (
                  <BookmarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <ShareIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Remedy Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mr-4">
              {remedy.name}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(remedy.difficulty)}`}>
              {remedy.difficulty}
            </span>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {remedy.description}
          </p>

          <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>Prep: {remedy.preparationTime}</span>
            </div>
            <div className="flex items-center">
              <HeartIcon className="h-5 w-5 mr-2" />
              <span>Relief: {remedy.reliefTime}</span>
            </div>
            <div className="flex items-center">
              {renderStars(remedy.effectiveness)}
              <span className="ml-2">({remedy.effectiveness}/5)</span>
            </div>
          </div>
          
          {/* User Rating Section */}
          {user && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                {userRating > 0 ? `Your rating: ${userRating} stars` : 'Rate this remedy:'}
              </h3>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`transition-colors ${
                      star <= userRating 
                        ? 'text-yellow-400 hover:text-yellow-500' 
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <StarIcon className="h-6 w-6" />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Thank you for rating this remedy!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ingredients
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <ul className="space-y-3">
              {remedy.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Instructions
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <ol className="space-y-4">
              {remedy.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-semibold mr-4 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Category Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Category
          </h2>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-green-800 dark:text-green-200 capitalize">
                {remedy.category.replace('-', ' ')} Health
              </span>
            </div>
          </div>
        </div>

        {/* Precautions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Precautions
          </h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                Important Safety Information
              </h3>
            </div>
            <ul className="space-y-2">
              {remedy.precautions.map((precaution, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-600 mr-3 mt-1">•</span>
                  <span className="text-yellow-800 dark:text-yellow-200">{precaution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. 
            Always consult with a healthcare provider before trying new remedies, especially if you have existing health conditions or are taking medications.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}