import React from 'react'

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
    <div>
      <span className="font-semibold">Error: </span>
      {message}
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="ml-4 text-xs font-semibold underline hover:opacity-80 cursor-pointer"
      >
        Reintentar
      </button>
    )}
  </div>
)
