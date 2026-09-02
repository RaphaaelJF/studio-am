import React from 'react';

export type TextElement = 'p' | 'span' | 'div';
export type TextVariant = 'body-lg' | 'body' | 'body-sm' | 'caption';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: TextElement;
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<TextVariant, string> = {
  'body-lg': 'text-body-lg',
  body: 'text-body',
  'body-sm': 'text-body-sm',
  caption: 'text-caption',
};

export function Text({
  as: Component = 'p',
  variant = 'body',
  children,
  className = '',
  ...props
}: TextProps) {
  return (
    <Component
      className={`${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
