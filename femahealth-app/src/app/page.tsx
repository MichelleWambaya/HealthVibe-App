'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { BottomNavigation } from '@/components/BottomNavigation'
import { useAuth } from '@/components/AuthProvider'
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  MapPinIcon,
  SunIcon,
  CloudIcon,
  FireIcon,
  MoonIcon
} from '@heroicons/react/24/outline'

const mainActions = [
  {
    name: 'Find Relief',
    description: 'Search for natural remedies',
    href: '/search',
    icon: MagnifyingGlassIcon,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-800/50',
  },
  {
    name: 'Browse Remedies',
    description: 'Explore healing solutions',
    href: '/remedies',
    icon: HeartIcon,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-800/50',
  },
  {
    name: 'Find Care',
    description: 'Locate medical centers',
    href: '/medical-centers',
    icon: MapPinIcon,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-800/50',
  },
]

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20 pb-20">
      {/* Header with Profile */}
      <Header title="HealthVibe" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-green-800 dark:text-green-200 mb-4">
            Welcome back
          </h1>
          
          <p className="text-base sm:text-lg text-green-600 dark:text-green-400 font-body font-light leading-relaxed max-w-2xl mx-auto">
            Your journey to natural healing begins here
          </p>
          
          {user && (
            <div className="mt-6 inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
              <span className="text-sm text-green-700 dark:text-green-300 font-body">
                {user.email?.split('@')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Main Actions - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {mainActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 shadow-sm group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <action.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-1">
                    {action.name}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-body">
                    {action.description}
                  </p>
                </div>
                <div className="text-green-400 dark:text-green-500 mt-2 sm:mt-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Herb Cards Carousel */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-display text-green-800 dark:text-green-200 mb-6 text-center">
            Featured Herbs
          </h2>
          <div className="carousel-container flex gap-4 sm:gap-6 overflow-x-auto pb-4">
            {[
              { 
                name: 'Peppermint', 
                icon: SunIcon,
                bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                benefits: 'Headache Relief',
                color: 'text-green-600'
              },
              { 
                name: 'Lavender', 
                icon: MoonIcon,
                bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                benefits: 'Sleep & Relaxation',
                color: 'text-purple-600'
              },
              { 
                name: 'Ginger', 
                icon: FireIcon,
                bgImage: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                benefits: 'Digestive Health',
                color: 'text-orange-600'
              },
              { 
                name: 'Eucalyptus', 
                icon: CloudIcon,
                bgImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                benefits: 'Respiratory Support',
                color: 'text-blue-600'
              },
              { 
                name: 'Chamomile', 
                icon: HeartIcon,
                bgImage: 'https://images.unsplash.com/photo-1576092762791-fda094e6a07e?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                benefits: 'Calming & Anti-inflammatory',
                color: 'text-yellow-600'
              }
            ].map((herb) => (
              <div
                key={herb.name}
                className="carousel-item herb-card relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${herb.bgImage})` }}
                ></div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <herb.icon className={`h-6 w-6 ${herb.color}`} />
                  </div>
                  <h3 className="text-lg font-display text-white mb-2">
                    {herb.name}
                  </h3>
                  <p className="text-sm text-white/90 font-body">
                    {herb.benefits}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl font-display text-green-800 dark:text-green-200 mb-6 text-center">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { 
                name: 'Headache', 
                icon: SunIcon,
                bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                herb: 'Peppermint'
              },
              { 
                name: 'Cold', 
                icon: CloudIcon,
                bgImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                herb: 'Eucalyptus'
              },
              { 
                name: 'Stomach', 
                icon: FireIcon,
                bgImage: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                herb: 'Ginger'
              },
              { 
                name: 'Sleep', 
                icon: MoonIcon,
                bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
                herb: 'Lavender'
              }
            ].map((item) => (
              <Link
                key={item.name}
                href="/remedies"
                className="relative overflow-hidden rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 hover:scale-105 group"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${item.bgImage})` }}
                ></div>
                
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <item.icon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div className="text-sm font-display text-slate-800 dark:text-slate-200 mb-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-body">
                    {item.herb}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Daily Tip */}
        <div className="story-section bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6 sm:p-8 text-center border border-green-200 dark:border-green-800">
          <h3 className="text-lg sm:text-xl font-display text-green-800 dark:text-green-200 mb-3">
            Daily Wellness Tip
          </h3>
          <p className="text-green-700 dark:text-green-300 leading-relaxed font-body">
            &ldquo;Take a moment to breathe deeply. Three deep breaths can instantly calm your nervous system and reduce stress.&rdquo;
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}