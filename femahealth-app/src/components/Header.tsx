'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AuthModal } from '@/components/AuthModal'
import { ProfileImageService } from '@/lib/profile-image-service'
import { 
  UserIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  backHref?: string
}

export function Header({ title, showBackButton = false, backHref = '/' }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-green-200/50 dark:border-green-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button or Title */}
            <div className="flex items-center space-x-3">
              {showBackButton && (
                <Link 
                  href={backHref} 
                  className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}
              
              {title && (
                <span className="text-lg font-display text-green-800 dark:text-green-200">
                  {title}
                </span>
              )}
            </div>

            {/* Right side - Profile and Theme toggle */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              
              <div className="relative">
                <button
                  onClick={() => user ? setShowUserMenu(!showUserMenu) : setShowAuthModal(true)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={ProfileImageService.getProfileImageUrl(user.id, user.user_metadata.avatar_url) || ''}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback to default icon if image fails to load
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <UserIcon className={`w-5 h-5 text-white ${user?.user_metadata?.avatar_url ? 'hidden' : ''}`} />
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && user && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-green-200 dark:border-green-800 overflow-hidden z-50">
                    <div className="p-4 border-b border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center overflow-hidden">
                          {user?.user_metadata?.avatar_url ? (
                            <img
                              src={ProfileImageService.getProfileImageUrl(user.id, user.user_metadata.avatar_url) || ''}
                              alt="Profile"
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <UserIcon className={`w-8 h-8 text-white ${user?.user_metadata?.avatar_url ? 'hidden' : ''}`} />
                        </div>
                        <div>
                          <p className="font-display text-green-800 dark:text-green-200">
                            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400 font-body">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <UserIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-body text-green-800 dark:text-green-200">Profile</span>
                      </Link>
                      
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <Cog6ToothIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-body text-green-800 dark:text-green-200">Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span className="font-body text-red-600 dark:text-red-400">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </>
  )
}
