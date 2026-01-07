import { HTMLAttributes, forwardRef } from 'react';

type ChipVariant = 'default' | 'success' | 'warning' | 'outline';
type ChipSize = 'sm' | 'md';

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<ChipVariant, string> = {
  default: 'bg-cream-200 text-green-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-gold-100 text-gold-700',
  outline: 'bg-transparent border border-green-300 text-green-600',
};

const sizeStyles: Record<ChipSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ variant = 'default', size = 'md', icon, className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5
          font-medium rounded-full
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Chip.displayName = 'Chip';
