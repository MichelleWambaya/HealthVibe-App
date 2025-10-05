'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { AuthModal } from '@/components/AuthModal'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline'

export default function SignInPage() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(true)

  // If user is already signed in, redirect to home
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-display text-green-800 dark:text-green-200 mb-4">
            Welcome back!
          </h1>
          <p className="text-green-600 dark:text-green-400 font-body mb-6">
            You're already signed in as {user.email}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-body rounded-xl transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-green-200/50 dark:border-green-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-body">Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <HeartIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-display text-green-800 dark:text-green-200 mb-4">
            Welcome to HealthVibe
          </h1>
          
          <p className="text-lg text-green-600 dark:text-green-400 font-body leading-relaxed">
            Sign in to personalize your health journey and save your favorite remedies
          </p>
        </div>

        {/* Benefits */}
        <div className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-display text-green-800 dark:text-green-200 mb-4 text-center">
            Why Sign In?
          </h2>
          <div className="space-y-4">
            {[
              { icon: '💾', title: 'Save Favorites', desc: 'Bookmark remedies you love' },
              { icon: '📊', title: 'Track Progress', desc: 'Monitor your health journey' },
              { icon: '🔔', title: 'Get Reminders', desc: 'Never miss taking your remedies' },
              { icon: '📱', title: 'Sync Across Devices', desc: 'Access your data anywhere' }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-2xl">{benefit.icon}</div>
                <div>
                  <h3 className="font-display text-green-800 dark:text-green-200">{benefit.title}</h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-body">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign In Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-body rounded-xl transition-colors text-lg font-medium"
          >
            Sign In / Sign Up
          </button>
          
          <p className="text-sm text-green-600 dark:text-green-400 font-body mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  )
}
