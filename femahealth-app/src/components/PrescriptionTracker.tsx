'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

interface Prescription {
  id: string
  name: string
  dosage: string
  frequency: string // "3 times daily", "twice daily", etc.
  duration: number // days
  startDate: string
  endDate: string
  times: string[] // ["08:00", "14:00", "20:00"]
  status: 'active' | 'completed' | 'paused'
  progress: number // percentage
}

interface PrescriptionTrackerProps {
  className?: string
}

export function PrescriptionTracker({ className = '' }: PrescriptionTrackerProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [takenPrescriptions, setTakenPrescriptions] = useState<Record<string, Record<string, string[]>>>({})

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Sample data - in real app, this would come from API/database
  useEffect(() => {
    const samplePrescriptions: Prescription[] = [
      {
        id: '1',
        name: 'Ginger Tea',
        dosage: '1 cup',
        frequency: '3 times daily',
        duration: 7,
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        times: ['08:00', '14:00', '20:00'],
        status: 'active',
        progress: 60
      },
      {
        id: '2',
        name: 'Turmeric Capsules',
        dosage: '500mg',
        frequency: 'twice daily',
        duration: 14,
        startDate: '2024-01-10',
        endDate: '2024-01-24',
        times: ['09:00', '21:00'],
        status: 'active',
        progress: 80
      }
    ]
    setPrescriptions(samplePrescriptions)
  }, [])

  const getTimeStatus = (time: string, prescriptionId: string) => {
    const now = currentTime
    const [hours, minutes] = time.split(':').map(Number)
    const prescriptionTime = new Date()
    prescriptionTime.setHours(hours, minutes, 0, 0)
    
    const diffMinutes = (now.getTime() - prescriptionTime.getTime()) / (1000 * 60)
    
    // Check if this time was already taken today
    const today = now.toDateString()
    const takenTimes = takenPrescriptions[prescriptionId]?.[today] || []
    if (takenTimes.includes(time)) return 'taken'
    
    if (diffMinutes < -30) return 'upcoming'
    if (diffMinutes >= -30 && diffMinutes <= 30) return 'due'
    if (diffMinutes > 30 && diffMinutes <= 120) return 'overdue'
    return 'missed'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-green-600 dark:text-green-400'
      case 'due': return 'text-yellow-600 dark:text-yellow-400'
      case 'overdue': return 'text-orange-600 dark:text-orange-400'
      case 'missed': return 'text-red-600 dark:text-red-400'
      default: return 'text-green-600 dark:text-green-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <ClockIcon className="w-5 h-5" />
      case 'due': return <ExclamationTriangleIcon className="w-5 h-5" />
      case 'overdue': return <ExclamationTriangleIcon className="w-5 h-5" />
      case 'missed': return <ExclamationTriangleIcon className="w-5 h-5" />
      default: return <ClockIcon className="w-5 h-5" />
    }
  }

  const markAsTaken = (prescriptionId: string, time: string) => {
    const today = currentTime.toDateString()
    setTakenPrescriptions(prev => ({
      ...prev,
      [prescriptionId]: {
        ...prev[prescriptionId],
        [today]: [...(prev[prescriptionId]?.[today] || []), time]
      }
    }))
    console.log(`Marked ${prescriptionId} at ${time} as taken`)
  }

  const togglePrescriptionStatus = (prescriptionId: string) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === prescriptionId 
        ? { ...p, status: p.status === 'active' ? 'paused' : 'active' }
        : p
    ))
  }

  return (
    <div className={`herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-green-800 dark:text-green-200">Prescription Tracker</h2>
        <div className="text-sm text-green-600 dark:text-green-400 font-body">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Prescription List */}
      <div className="space-y-4 mb-6">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selectedPrescription?.id === prescription.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700'
            }`}
            onClick={() => setSelectedPrescription(prescription)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-green-800 dark:text-green-200">{prescription.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  prescription.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {prescription.status}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePrescriptionStatus(prescription.id)
                  }}
                  className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                  {prescription.status === 'active' ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="text-sm text-green-600 dark:text-green-400 font-body mb-2">
              {prescription.dosage} • {prescription.frequency}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-green-500 dark:text-green-500 font-body">
                Day {Math.ceil(prescription.progress / 100 * prescription.duration)} of {prescription.duration}
              </div>
              <div className="w-20 h-2 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${prescription.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      {selectedPrescription && (
        <div className="border-t border-green-200 dark:border-green-800 pt-6">
          <h3 className="font-display text-green-800 dark:text-green-200 mb-4">
            Today's Schedule - {selectedPrescription.name}
          </h3>
          
          <div className="space-y-3">
            {selectedPrescription.times.map((time, index) => {
              const status = getTimeStatus(time, selectedPrescription.id)
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    status === 'due' 
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700'
                      : status === 'overdue'
                      ? 'bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700'
                      : status === 'missed'
                      ? 'bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700'
                      : 'bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={getStatusColor(status)}>
                      {getStatusIcon(status)}
                    </div>
                    <div>
                      <div className="font-display text-green-800 dark:text-green-200">{time}</div>
                      <div className="text-sm text-green-600 dark:text-green-400 font-body">
                        {selectedPrescription.dosage}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => markAsTaken(selectedPrescription.id, time)}
                    className={`p-2 rounded-lg transition-colors ${
                      status === 'taken'
                        ? 'bg-green-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    {status === 'taken' ? (
                      <CheckCircleIconSolid className="w-5 h-5" />
                    ) : (
                      <CheckCircleIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-display text-green-800 dark:text-green-200">Progress</span>
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 font-body">
              Started: {new Date(selectedPrescription.startDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 font-body">
              Ends: {new Date(selectedPrescription.endDate).toLocaleDateString()}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-body mb-1">
                <span>Completion</span>
                <span>{selectedPrescription.progress}%</span>
              </div>
              <div className="w-full h-3 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 transition-all duration-500"
                  style={{ width: `${selectedPrescription.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
