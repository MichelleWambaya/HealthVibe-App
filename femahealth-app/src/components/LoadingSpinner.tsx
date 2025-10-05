'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <div className={`${sizeClasses[size]} border-2 border-green-200 border-t-green-600 rounded-full animate-spin`} />
        {text && (
          <p className="text-sm text-green-600 dark:text-green-400 font-body">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="herb-card p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-green-200 dark:bg-green-800 rounded w-3/4"></div>
        <div className="h-3 bg-green-200 dark:bg-green-800 rounded w-1/2"></div>
        <div className="h-3 bg-green-200 dark:bg-green-800 rounded w-2/3"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-green-200 dark:bg-green-800 rounded w-16"></div>
          <div className="h-6 bg-green-200 dark:bg-green-800 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}
