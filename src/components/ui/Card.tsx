import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-white shadow-card',
  elevated: 'bg-white shadow-soft-md',
  outlined: 'bg-white border border-cream-300',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl overflow-hidden
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

const aspectStyles = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[16/9]',
};

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ src, alt, aspectRatio = 'video', className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`relative ${aspectStyles[aspectRatio]} ${className}`} {...props}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';
