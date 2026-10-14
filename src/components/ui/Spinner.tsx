import React from 'react'

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return (
    <div className="flex items-center justify-center py-6" role="status" aria-label="Cargando">
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-muted border-t-primary`} />
    </div>
  )
}
