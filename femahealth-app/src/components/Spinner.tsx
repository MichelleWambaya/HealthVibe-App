'use client'

import React from 'react'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'white'
  className?: string
}

export function Spinner({ size = 'medium', color = 'primary', className = '' }: SpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-green-200 border-t-green-600',
    secondary: 'border-blue-200 border-t-blue-600',
    white: 'border-white/30 border-t-white'
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        border-2 rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Herb-themed spinner with floating animation
export function HerbSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main spinner */}
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        
        {/* Floating herb leaves */}
        <div className="absolute -top-2 -left-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute -top-1 -right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-2 -left-1 w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-1 -right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* Herb icon */}
      <div className="mt-4 text-2xl animate-bounce">🌿</div>
    </div>
  )
}

// Pulse spinner for loading states
export function PulseSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  )
}

// Wave spinner for search loading
export function WaveSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 h-8 bg-green-600 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s'
          }}
        ></div>
      ))}
    </div>
  )
}

// Loading overlay with herb theme
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-green-200 dark:border-green-800">
        <HerbSpinner />
        <p className="mt-4 text-center text-green-600 dark:text-green-400 font-medium">
          {message}
        </p>
      </div>
    </div>
  )
}
