import React from 'react'
import { DiagramStatus } from '@/store/interfaces/diagram.interface'

interface BadgeProps {
  status: DiagramStatus | string
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const styles: Record<string, { bg: string; label: string }> = {
    approved: {
      bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      label: 'Aprobado',
    },
    review: {
      bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      label: 'En Revisión',
    },
    draft: {
      bg: 'bg-secondary text-secondary-foreground border-border',
      label: 'Borrador',
    },
    deprecated: {
      bg: 'bg-destructive/15 text-destructive border-destructive/30',
      label: 'Obsoleto',
    },
  }

  const current = styles[status] ?? {
    bg: 'bg-muted text-muted-foreground border-border',
    label: status,
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${current.bg} ${className}`}
    >
      {current.label}
    </span>
  )
}
