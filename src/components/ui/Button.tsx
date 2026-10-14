'use client'

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  label,
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  icon,
  className = '',
  ...props
}) => {
  const variants = {
    primary:     'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
    secondary:   'bg-secondary text-secondary-foreground hover:bg-muted border border-border',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm',
    ghost:       'text-foreground hover:bg-secondary',
    outline:     'border border-border text-foreground hover:bg-secondary bg-transparent',
  }

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label || children}
    </button>
  )
}
