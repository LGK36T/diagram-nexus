import React from 'react'

export interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const InputText: React.FC<InputTextProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-50 ${
          error ? 'border-destructive focus:ring-destructive' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
