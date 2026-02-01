import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue-500',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="flex flex-col items-center space-y-3">
        <div
          className={`${sizeClasses[size]} border-${color} border-t-transparent border-solid rounded-full animate-spin`}
        />
        {text && <p className="text-white text-sm font-medium">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
