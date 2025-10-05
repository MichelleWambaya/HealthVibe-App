'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AuthModal } from '@/components/AuthModal'
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigationItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Remedies', href: '/remedies', icon: HeartIcon },
  { name: 'Assistant', href: '/assistant', icon: ChatBubbleLeftRightIcon },
]

interface SideNavigationProps {
  children: React.ReactNode
}

export function SideNavigation({ children }: SideNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-green-200 dark:border-green-800">
            <div className="text-xl font-display text-green-800 dark:text-green-200">
              HealthVibe
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-green-200 dark:border-green-800">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-6 h-6 text-white" />
                  )}
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
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <UserIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span className="font-body text-green-800 dark:text-green-200">Sign In</span>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' 
                          : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-body">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-green-200 dark:border-green-800">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-green-200 dark:border-green-800">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="text-lg font-display text-green-800 dark:text-green-200">
            HealthVibe
          </div>
          <div className="w-8 h-8" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  )
}
