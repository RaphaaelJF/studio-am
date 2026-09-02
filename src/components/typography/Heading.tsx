import React from 'react';

export type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
export type HeadingVariant = 'display-xl' | 'display-lg' | 'heading-1' | 'heading-2' | 'heading-3';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingElement;
  variant?: HeadingVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<HeadingVariant, string> = {
  'display-xl': 'text-display-xl',
  'display-lg': 'text-display-lg',
  'heading-1': 'text-heading-1',
  'heading-2': 'text-heading-2',
  'heading-3': 'text-heading-3',
};

export function Heading({
  as: Component = 'h2',
  variant = 'heading-2',
  children,
  className = '',
  ...props
}: HeadingProps) {
  return (
    <Component
      className={`${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
