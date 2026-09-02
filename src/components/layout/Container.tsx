import React from 'react';

export type ContainerSize = 'narrow' | 'content' | 'wide' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ContainerSize, string> = {
  narrow: 'max-w-narrow',
  content: 'max-w-content',
  wide: 'max-w-wide',
  full: 'w-full',
};

export function Container({
  size = 'content',
  children,
  className = '',
  ...props
}: ContainerProps) {
  const isFull = size === 'full';
  const paddingClass = isFull ? '' : 'px-4 sm:px-6 lg:px-8';
  const marginClass = isFull ? '' : 'mx-auto';

  return (
    <div
      className={`w-full ${sizeClasses[size]} ${paddingClass} ${marginClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
