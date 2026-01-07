import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

export function Loader({ size = 'md', className = '' }: LoaderProps) {
  return (
    <Loader2 className={`animate-spin text-green-600 ${sizeStyles[size]} ${className}`} />
  );
}

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({ message }: FullPageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader size="lg" />
      {message && <p className="text-green-600 font-medium">{message}</p>}
    </div>
  );
}
