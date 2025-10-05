'use client'

import { useState } from 'react'
import { SignIn } from './SignIn'
import { SignUp } from './SignUp'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)

  if (!isOpen) return null

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <>
      {mode === 'signin' ? (
        <SignIn onToggleMode={toggleMode} onClose={onClose} />
      ) : (
        <SignUp onToggleMode={toggleMode} onClose={onClose} />
      )}
    </>
  )
}
