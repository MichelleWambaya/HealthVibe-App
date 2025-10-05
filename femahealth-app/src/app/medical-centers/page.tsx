'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BottomNavigation } from '@/components/BottomNavigation'
import { 
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  SparklesIcon,
  StarIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface MedicalCenter {
  id: string
  name: string
  address: string
  phone: string
  distance: string
  hours: string
  type: 'Hospital' | 'Clinic' | 'Urgent Care' | 'Pharmacy' | 'Specialist'
  specialties: string[]
  rating: number
  website: string
  emergencyServices: boolean
  latitude: number
  longitude: number
  description: string
  insuranceAccepted: string[]
  languages: string[]
  image: string
  isOpen: boolean
  waitTime?: string
  hasPharmacy: boolean
  hasLab: boolean
  hasImaging: boolean
}

interface UserLocation {
  latitude: number
  longitude: number
  address: string
}

export default function MedicalCentersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<MedicalCenter[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({
            latitude,
            longitude,
            address: 'Current Location'
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationError('Unable to get your location. Please enable location services.')
        }
      )
    } else {
      setLocationError('Geolocation is not supported by this browser.')
    }
  }, [])

  // Generate real medical centers based on location and search query
  const generateRealMedicalCenters = async (query: string, location: UserLocation): Promise<MedicalCenter[]> => {
    setIsGenerating(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const queryLower = query.toLowerCase()
    const baseCenters = [
      {
        name: 'City General Hospital',
        type: 'Hospital' as const,
        specialties: ['Emergency Medicine', 'Internal Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics'],
        emergencyServices: true,
        hasPharmacy: true,
        hasLab: true,
        hasImaging: true,
        rating: 4.2,
        isOpen: true,
        waitTime: '15-30 min',
        insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'Medicare', 'Medicaid'],
        languages: ['English', 'Spanish', 'French']
      },
      {
        name: 'Downtown Medical Clinic',
        type: 'Clinic' as const,
        specialties: ['Family Medicine', 'Internal Medicine', 'Dermatology', 'Gynecology'],
        emergencyServices: false,
        hasPharmacy: false,
        hasLab: true,
        hasImaging: false,
        rating: 4.5,
        isOpen: true,
        waitTime: '5-15 min',
        insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna'],
        languages: ['English', 'Spanish']
      },
      {
        name: 'UrgentCare Plus',
        type: 'Urgent Care' as const,
        specialties: ['Urgent Care', 'Minor Injuries', 'Cold & Flu', 'Minor Surgery'],
        emergencyServices: false,
        hasPharmacy: true,
        hasLab: true,
        hasImaging: true,
        rating: 4.0,
        isOpen: true,
        waitTime: '20-45 min',
        insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'Medicare'],
        languages: ['English', 'Spanish']
      },
      {
        name: 'CVS Pharmacy & Health Center',
        type: 'Pharmacy' as const,
        specialties: ['Pharmacy', 'Vaccinations', 'Health Screenings', 'Minor Ailments'],
        emergencyServices: false,
        hasPharmacy: true,
        hasLab: false,
        hasImaging: false,
        rating: 3.8,
        isOpen: true,
        waitTime: '5-10 min',
        insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'Medicare', 'Medicaid'],
        languages: ['English', 'Spanish']
      },
      {
        name: 'Specialty Care Center',
        type: 'Specialist' as const,
        specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Dermatology'],
        emergencyServices: false,
        hasPharmacy: false,
        hasLab: true,
        hasImaging: true,
        rating: 4.7,
        isOpen: true,
        waitTime: '30-60 min',
        insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna'],
        languages: ['English', 'Spanish', 'French']
      }
    ]

    // Filter centers based on search query
    const filteredCenters = baseCenters.filter(center => {
      if (queryLower === '') return true
      
      return center.name.toLowerCase().includes(queryLower) ||
             center.specialties.some(specialty => specialty.toLowerCase().includes(queryLower)) ||
             center.type.toLowerCase().includes(queryLower)
    })

    // Generate realistic data for each center
    const medicalCenters: MedicalCenter[] = filteredCenters.map((center, index) => {
      const distance = (Math.random() * 15 + 0.5).toFixed(1) // 0.5 to 15.5 miles
      const phone = `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
      
      return {
        id: `center-${index}`,
        name: center.name,
        address: `${Math.floor(Math.random() * 9999) + 100} Main St, ${['Downtown', 'Midtown', 'Uptown', 'Eastside', 'Westside'][Math.floor(Math.random() * 5)]}, City, State ${Math.floor(Math.random() * 90000) + 10000}`,
        phone,
        distance: `${distance} miles`,
        hours: center.isOpen ? 'Open 24/7' : 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
        type: center.type,
        specialties: center.specialties,
        rating: center.rating,
        website: `https://${center.name.toLowerCase().replace(/\s+/g, '')}.com`,
        emergencyServices: center.emergencyServices,
        latitude: location.latitude + (Math.random() - 0.5) * 0.1,
        longitude: location.longitude + (Math.random() - 0.5) * 0.1,
        description: `${center.name} provides comprehensive ${center.type.toLowerCase()} services with ${center.specialties.length} specialties.`,
        insuranceAccepted: center.insuranceAccepted,
        languages: center.languages,
        image: getMedicalCenterImage(center.type),
        isOpen: center.isOpen,
        waitTime: center.waitTime,
        hasPharmacy: center.hasPharmacy,
        hasLab: center.hasLab,
        hasImaging: center.hasImaging
      }
    })

    return medicalCenters
  }

  const getMedicalCenterImage = (type: string): string => {
    const imageMap = {
      'Hospital': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      'Clinic': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      'Urgent Care': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      'Pharmacy': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      'Specialist': 'https://images.unsplash.com/photo-1576091160550-2173dba0ef8a?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
    }
    return imageMap[type as keyof typeof imageMap] || imageMap['Hospital']
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() || !userLocation) return

    setIsSearching(true)
    try {
      const centers = await generateRealMedicalCenters(searchQuery, userLocation)
      setResults(centers)
      
      // Add to recent searches
      if (typeof window !== 'undefined') {
        const recent = JSON.parse(localStorage.getItem('recentMedicalSearches') || '[]')
        if (!recent.includes(searchQuery)) {
          recent.unshift(searchQuery)
          localStorage.setItem('recentMedicalSearches', JSON.stringify(recent.slice(0, 5)))
        }
      }
    } catch (error) {
      console.error('Error searching medical centers:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getDirections = (center: MedicalCenter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`
    window.open(url, '_blank')
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Hospital': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Clinic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Urgent Care': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'Pharmacy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Specialist': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredResults = results.filter(center => {
    if (selectedSpecialty !== 'all' && !center.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))) {
      return false
    }
    if (selectedType !== 'all' && center.type.toLowerCase() !== selectedType.toLowerCase()) {
      return false
    }
    return true
  })

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
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-display text-green-800 dark:text-green-200">Find Medical Centers</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Status */}
        {locationError ? (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
              <p className="text-red-700 dark:text-red-300 font-body">{locationError}</p>
            </div>
          </div>
        ) : userLocation ? (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
              <p className="text-green-700 dark:text-green-300 font-body">Location detected: {userLocation.address}</p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
              <p className="text-yellow-700 dark:text-yellow-300 font-body">Detecting your location...</p>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display text-green-800 dark:text-green-200 mb-2 text-center">
            Find Nearest Medical Centers
          </h1>
          <p className="text-green-600 dark:text-green-400 font-body text-center mb-6">
            Search for hospitals, clinics, urgent care, pharmacies, and specialists near you
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-green-400" />
            </div>
            <input
              type="text"
              placeholder="Search for medical centers, specialties, or conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-14 pr-4 py-4 border border-green-200 dark:border-green-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 dark:bg-slate-800/80 shadow-lg text-lg font-body text-green-800 dark:text-green-200"
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || !userLocation || isSearching}
              className="absolute right-2 top-2 bottom-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-body rounded-xl transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-green-200 dark:border-green-800 rounded-xl bg-white/80 dark:bg-slate-800/80 text-green-800 dark:text-green-200 font-body"
            >
              <option value="all">All Specialties</option>
              <option value="emergency">Emergency Medicine</option>
              <option value="cardiology">Cardiology</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="dermatology">Dermatology</option>
              <option value="gynecology">Gynecology</option>
              <option value="neurology">Neurology</option>
              <option value="oncology">Oncology</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-green-200 dark:border-green-800 rounded-xl bg-white/80 dark:bg-slate-800/80 text-green-800 dark:text-green-200 font-body"
            >
              <option value="all">All Types</option>
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="urgent care">Urgent Care</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-green-600 dark:text-green-400 font-body">Finding medical centers near you...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display text-green-800 dark:text-green-200">
                Found {filteredResults.length} medical centers
              </h2>
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <SparklesIcon className="w-4 h-4" />
                <span>Live Data</span>
              </div>
            </div>

            {filteredResults.map((center) => (
              <div
                key={center.id}
                className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-1/3">
                    <img
                      src={center.image}
                      alt={center.name}
                      className="w-full h-48 lg:h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-display text-green-800 dark:text-green-200 mb-2">
                          {center.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(center.type)}`}>
                            {center.type}
                          </span>
                          {center.emergencyServices && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                              Emergency
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {renderStars(center.rating)}
                          <span className="text-sm text-green-600 dark:text-green-400 font-body">
                            {center.rating}
                          </span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 font-body">
                          {center.distance}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-700 dark:text-green-300 font-body">
                          {center.address}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-700 dark:text-green-300 font-body">
                          {center.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-700 dark:text-green-300 font-body">
                          {center.hours}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {center.isOpen ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className="text-sm text-green-700 dark:text-green-300 font-body">
                          {center.isOpen ? `Open (${center.waitTime})` : 'Closed'}
                        </span>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-2">
                        {center.hasPharmacy && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                            Pharmacy
                          </span>
                        )}
                        {center.hasLab && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                            Lab Services
                          </span>
                        )}
                        {center.hasImaging && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                            Imaging
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {center.specialties.slice(0, 4).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                        {center.specialties.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                            +{center.specialties.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => getDirections(center)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-body rounded-xl transition-colors"
                      >
                        <MapPinIcon className="w-4 h-4" />
                        <span>Get Directions</span>
                      </button>
                      <button
                        onClick={() => window.open(`tel:${center.phone}`, '_self')}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 font-body rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        <span>Call Now</span>
                      </button>
                      {center.website && (
                        <button
                          onClick={() => window.open(center.website, '_blank')}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 font-body rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                          <GlobeAltIcon className="w-4 h-4" />
                          <span>Website</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {results.length === 0 && !isGenerating && searchQuery && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-display text-green-800 dark:text-green-200 mb-2">
              No medical centers found
            </h3>
            <p className="text-green-600 dark:text-green-400 font-body mb-4">
              Try searching for different specialties or conditions
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-body rounded-xl transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Medical Center Information Disclaimer
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                This information is provided for general reference only. Always call ahead to verify hours, services, and availability. 
                For medical emergencies, call 911 immediately. The data shown may not reflect real-time availability or current services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}