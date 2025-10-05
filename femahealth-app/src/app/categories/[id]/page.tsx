'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getRemediesByCategory, toggleBookmark, isBookmarked } from '@/lib/data';
import type { Remedy } from '@/lib/data';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  StarIcon,
  FaceSmileIcon,
  SunIcon,
  CloudIcon,
  FireIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryPage({ params }: PageProps) {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [bookmarkedRemedies, setBookmarkedRemedies] = useState<Set<string>>(new Set());

  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  const category = categories.find(cat => cat.id === id);

  useEffect(() => {
    if (!category) {
      notFound();
    }
    
    const categoryRemedies = getRemediesByCategory(id);
    setRemedies(categoryRemedies);
    
    // Load bookmarked remedies
    const bookmarked = new Set<string>();
    categoryRemedies.forEach(remedy => {
      if (isBookmarked(remedy.id)) {
        bookmarked.add(remedy.id);
      }
    });
    setBookmarkedRemedies(bookmarked);
  }, [id, category]);

  const filteredRemedies = remedies.filter(remedy => {
    const matchesSearch = remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         remedy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || remedy.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleBookmark = (remedyId: string) => {
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
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <Header title="Category Not Found" showBackButton={true} backHref="/categories" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/categories"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header title={category.name} showBackButton={true} backHref="/categories" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {category.description}
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search remedies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Remedies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRemedies.map((remedy) => (
            <div key={remedy.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {remedy.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {remedy.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookmark(remedy.id)}
                    className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  >
                    {bookmarkedRemedies.has(remedy.id) ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(remedy.difficulty)}`}>
                    {remedy.difficulty}
                  </span>
                  <div className="flex items-center">
                    {renderStars(remedy.effectiveness)}
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      ({remedy.effectiveness}/5)
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{remedy.preparationTime}</span>
                </div>

                <Link
                  href={`/remedy/${remedy.id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredRemedies.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No remedies found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}