'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BottomNavigation } from '@/components/BottomNavigation'
import { useAuth } from '@/components/AuthProvider'
import { getBookmarkedRemedies } from '@/lib/data'
import { ProfileImageService } from '@/lib/profile-image-service'
import { 
  ArrowLeftIcon,
  UserIcon,
  Cog6ToothIcon,
  HeartIcon,
  ClockIcon,
  StarIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  CameraIcon,
  CheckIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'preferences'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || 'User',
    email: user?.email || '',
    bio: 'Health and wellness enthusiast',
    location: 'San Francisco, CA',
    joinDate: 'January 2024'
  })
  const [userStats, setUserStats] = useState({
    bookmarkedRemedies: 0,
    aiSearches: 0,
    daysActive: 0,
    averageRating: 0
  })
  const [recentActivity, setRecentActivity] = useState<Array<{
    type: string;
    description: string;
    timestamp: string;
    remedyId?: string;
    rating?: number;
    query?: string;
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Settings state management
  const [settings, setSettings] = useState({
    notifications: {
      remedyReminders: true,
      healthTips: true,
      newRemedies: false,
      communityUpdates: true
    },
    privacy: {
      profileVisibility: true,
      dataSharing: false,
      twoFactorAuth: false
    },
    appPreferences: {
      darkMode: true,
      autoSaveFavorites: true,
      offlineMode: false
    }
  })

  // Load real user data and statistics
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        // Get bookmarked remedies count
        const bookmarkedRemedies = getBookmarkedRemedies()
        const bookmarkedCount = bookmarkedRemedies.length

        // Get AI searches count from localStorage
        const aiSearches = localStorage.getItem('aiSearches') || '0'
        const aiSearchesCount = parseInt(aiSearches)

        // Calculate days active (since account creation)
        const accountCreated = user.created_at ? new Date(user.created_at) : new Date()
        const daysActive = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24))

        // Get user ratings from localStorage
        const userRatings = localStorage.getItem('userRatings') || '[]'
        const ratings = JSON.parse(userRatings)
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
          : 0

        // Get recent activity from localStorage
        const activity = localStorage.getItem('userActivity') || '[]'
        const recentActivityData = JSON.parse(activity).slice(0, 5) // Last 5 activities

        setUserStats({
          bookmarkedRemedies: bookmarkedCount,
          aiSearches: aiSearchesCount,
          daysActive: Math.max(daysActive, 1), // At least 1 day
          averageRating: Math.round(averageRating * 10) / 10
        })

        setRecentActivity(recentActivityData)

        // Update profile data with real user info
        setProfileData(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          joinDate: accountCreated.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        }))

        // Load profile image if it exists
        if (user.user_metadata?.avatar_url) {
          const imageUrl = ProfileImageService.getProfileImageUrl(user.id, user.user_metadata.avatar_url)
          setProfileImage(imageUrl)
        }

      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Image upload functions
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const result = await ProfileImageService.uploadProfileImage({
        file,
        userId: user.id
      })

      if (result.success && result.url) {
        setProfileImage(result.url)
        // Update user metadata in context
        if (user.user_metadata) {
          user.user_metadata.avatar_url = result.url
        }
      } else {
        setUploadError(result.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      setUploadError('An unexpected error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!user) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const result = await ProfileImageService.deleteProfileImage(user.id)
      if (result.success) {
        setProfileImage(null)
        // Update user metadata in context
        if (user.user_metadata) {
          user.user_metadata.avatar_url = null
        }
      } else {
        setUploadError(result.error || 'Failed to remove image')
      }
    } catch (error) {
      console.error('Image removal error:', error)
      setUploadError('An unexpected error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSaveProfile = () => {
    // Here you would typically save to Supabase
    setIsEditing(false)
  }

  // Toggle settings handler
  const toggleSetting = (category: string, setting: string) => {
    setSettings(prev => {
      const categorySettings = prev[category as keyof typeof prev] as Record<string, boolean>
      return {
        ...prev,
        [category]: {
          ...categorySettings,
          [setting]: !categorySettings[setting]
        }
      }
    })
  }

  const stats = [
    { label: 'Remedies Saved', value: userStats.bookmarkedRemedies.toString(), icon: HeartIcon },
    { label: 'AI Searches', value: userStats.aiSearches.toString(), icon: SparklesIcon },
    { label: 'Days Active', value: userStats.daysActive.toString(), icon: ClockIcon },
    { label: 'Avg Rating', value: userStats.averageRating.toString(), icon: StarIcon },
  ]

  const settingsOptions = [
    {
      title: 'Notifications',
      icon: BellIcon,
      description: 'Manage your notification preferences',
      category: 'notifications',
      items: [
        { label: 'Remedy reminders', key: 'remedyReminders' },
        { label: 'Health tips', key: 'healthTips' },
        { label: 'New remedies', key: 'newRemedies' },
        { label: 'Community updates', key: 'communityUpdates' },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      description: 'Control your privacy settings',
      category: 'privacy',
      items: [
        { label: 'Profile visibility', key: 'profileVisibility' },
        { label: 'Data sharing', key: 'dataSharing' },
        { label: 'Two-factor authentication', key: 'twoFactorAuth' },
      ]
    },
    {
      title: 'App Preferences',
      icon: Cog6ToothIcon,
      description: 'Customize your app experience',
      category: 'appPreferences',
      items: [
        { label: 'Dark mode', key: 'darkMode' },
        { label: 'Auto-save favorites', key: 'autoSaveFavorites' },
        { label: 'Offline mode', key: 'offlineMode' },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20 pb-20">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-green-200/50 dark:border-green-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors">
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-display text-green-800 dark:text-green-200">Profile</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
                )}
              </div>
              
              {/* Upload/Remove buttons */}
              <div className="absolute bottom-0 right-0 flex space-x-1">
                <button 
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50"
                  title="Upload profile image"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CameraIcon className="w-4 h-4 text-white" />
                  )}
                </button>
                
                {profileImage && (
                  <button 
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50"
                    title="Remove profile image"
                  >
                    <XMarkIcon className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Upload error message */}
            {uploadError && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
              </div>
            )}

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-green-200 dark:border-green-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 dark:bg-slate-800/80 text-green-800 dark:text-green-200 font-display text-xl"
                  />
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-2 border border-green-200 dark:border-green-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 dark:bg-slate-800/80 text-green-600 dark:text-green-400 font-body"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <CheckIcon className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-display text-green-800 dark:text-green-200 mb-2">
                    {profileData.name}
                  </h1>
                  <p className="text-green-600 dark:text-green-400 font-body mb-2">
                    {profileData.bio}
                  </p>
                  <p className="text-sm text-green-500 dark:text-green-500 font-body mb-4">
                    {profileData.email}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center space-x-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-green-600 dark:text-green-400 font-body">Loading statistics...</p>
            </div>
          ) : (
            stats.map((stat, index) => (
              <div key={index} className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-display text-green-800 dark:text-green-200 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-body">
                  {stat.label}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-green-100 dark:bg-green-900/30 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-2 rounded-lg font-body transition-colors ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-800 text-green-800 dark:text-green-200 shadow-sm'
                : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-2 rounded-lg font-body transition-colors ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-slate-800 text-green-800 dark:text-green-200 shadow-sm'
                : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 px-4 py-2 rounded-lg font-body transition-colors ${
              activeTab === 'preferences'
                ? 'bg-white dark:bg-slate-800 text-green-800 dark:text-green-200 shadow-sm'
                : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-green-600 dark:text-green-400 font-body">Loading activity...</p>
                  </div>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      {activity.type === 'bookmark' && <HeartIcon className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      {activity.type === 'rating' && <StarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      {activity.type === 'search' && <MagnifyingGlassIcon className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      {activity.type === 'ai_search' && <SparklesIcon className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      <div>
                        <p className="text-sm font-body text-green-800 dark:text-green-200">{activity.description}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ClockIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-green-600 dark:text-green-400 font-body">No recent activity yet</p>
                    <p className="text-sm text-green-500 dark:text-green-500 mt-1">Start exploring remedies to see your activity here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {settingsOptions.map((section, index) => (
              <div key={index} className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display text-green-800 dark:text-green-200">{section.title}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 font-body">{section.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => {
                    const isEnabled = (settings as any)[section.category][item.key]
                    return (
                      <div key={itemIndex} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm font-body text-green-800 dark:text-green-200">{item.label}</span>
                        <button
                          onClick={() => toggleSetting(section.category, item.key)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            isEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}></div>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-4">App Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-green-800 dark:text-green-200">Default theme</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Choose your preferred theme</p>
                  </div>
                  <select className="px-3 py-2 border border-green-200 dark:border-green-800 rounded-lg bg-white/80 dark:bg-slate-800/80 text-green-800 dark:text-green-200">
                    <option>System</option>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-green-800 dark:text-green-200">Language</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Select your preferred language</p>
                  </div>
                  <select className="px-3 py-2 border border-green-200 dark:border-green-800 rounded-lg bg-white/80 dark:bg-slate-800/80 text-green-800 dark:text-green-200">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-green-800 dark:text-green-200">Units</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Choose measurement units</p>
                  </div>
                  <select className="px-3 py-2 border border-green-200 dark:border-green-800 rounded-lg bg-white/80 dark:bg-slate-800/80 text-green-800 dark:text-green-200">
                    <option>Metric</option>
                    <option>Imperial</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="font-body">Sign Out</span>
                  </div>
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="font-body">Delete Account</span>
                  </div>
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}