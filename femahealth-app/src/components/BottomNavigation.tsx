'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { 
  MagnifyingGlassIcon as MagnifyingGlassIconSolid, 
  HeartIcon as HeartIconSolid, 
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid
} from '@heroicons/react/24/solid'
import { useAuth } from './AuthProvider'
import { AuthModal } from './AuthModal'
import { useState } from 'react'

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: 'Search',
    href: '/search',
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
  },
  {
    name: 'Remedies',
    href: '/remedies',
    icon: HeartIcon,
    iconSolid: HeartIconSolid,
  },
  {
    name: 'Assistant',
    href: '/assistant',
    icon: ChatBubbleLeftRightIcon,
    iconSolid: ChatBubbleLeftRightIconSolid,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50 z-50">
        <div className="flex justify-around items-center py-4 px-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = isActive ? item.iconSolid : item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
          
          {/* Auth Button */}
          {user ? (
            <Link
              href="/profile"
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                pathname === '/profile'
                  ? 'text-slate-800 dark:text-slate-200'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="h-6 w-6 mb-1 flex items-center justify-center">
                <UserIcon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 text-slate-500 dark:text-slate-400"
            >
              <div className="h-6 w-6 mb-1 flex items-center justify-center">
                <UserIcon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium">Sign In</span>
            </button>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </>
  )
}
