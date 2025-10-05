'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBookmarkedRemedies, toggleBookmark } from '@/lib/data';
import type { Remedy } from '@/lib/data';

export default function FavoritesPage() {
  const [bookmarkedRemedies, setBookmarkedRemedies] = useState<Remedy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const bookmarked = getBookmarkedRemedies();
    setBookmarkedRemedies(bookmarked);
  }, []);

  const handleRemoveBookmark = (remedyId: string) => {
    toggleBookmark(remedyId);
    setBookmarkedRemedies(prev => prev.filter(remedy => remedy.id !== remedyId));
  };

  const filteredRemedies = bookmarkedRemedies.filter(remedy =>
    remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    remedy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="p-2 text-slate-600 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-800">Saved Remedies</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/search"
                className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Your Saved Remedies
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Quick access to your favorite natural remedies and treatments
          </p>
        </div>

        {/* Search Bar */}
        {bookmarkedRemedies.length > 0 && (
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search your saved remedies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Results Count */}
        {bookmarkedRemedies.length > 0 && (
          <div className="mb-6">
            <p className="text-slate-600">
              {searchQuery ? `Found ${filteredRemedies.length} of ${bookmarkedRemedies.length} saved remedies` : 
               `You have ${bookmarkedRemedies.length} saved remed${bookmarkedRemedies.length !== 1 ? 'ies' : 'y'}`}
            </p>
          </div>
        )}

        {/* Remedies Grid */}
        {filteredRemedies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRemedies.map((remedy, index) => (
              <div
                key={remedy.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{remedy.name}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{remedy.description}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(remedy.id)}
                    className="ml-4 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5 text-red-500 fill-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {remedy.preparationTime}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {remedy.reliefTime}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    remedy.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    remedy.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {remedy.difficulty}
                  </span>
                </div>

                {/* Effectiveness Stars */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < remedy.effectiveness ? 'text-yellow-400' : 'text-slate-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-slate-500">({remedy.effectiveness}/5)</span>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {remedy.category}
                  </span>
                </div>

                {/* Ingredients Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-1">
                    {remedy.ingredients.slice(0, 2).map((ingredient, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        {ingredient.split('(')[0].trim()}
                      </span>
                    ))}
                    {remedy.ingredients.length > 2 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                        +{remedy.ingredients.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/remedy/${remedy.id}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <span>View Remedy</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {bookmarkedRemedies.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">No saved remedies yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Start exploring remedies and save your favorites for quick access later
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                Browse Categories
              </Link>
              <Link
                href="/search"
                className="bg-white border-2 border-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
              >
                Search Remedies
              </Link>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {searchQuery && filteredRemedies.length === 0 && bookmarkedRemedies.length > 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No matching remedies</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search terms</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

