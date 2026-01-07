import { HTMLAttributes, forwardRef } from 'react';

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', label, className = '', ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={`w-px bg-cream-300 self-stretch ${className}`}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div ref={ref} className={`flex items-center gap-4 ${className}`} {...props}>
          <div className="flex-1 h-px bg-cream-300" />
          <span className="text-sm text-green-500 font-medium">{label}</span>
          <div className="flex-1 h-px bg-cream-300" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`h-px bg-cream-300 w-full ${className}`}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
