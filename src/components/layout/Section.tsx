import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'article' | 'div';
  children: React.ReactNode;
  className?: string;
}

export function Section({
  as: Component = 'section',
  children,
  className = '',
  ...props
}: SectionProps) {
  return (
    <Component
      className={`py-[var(--section-py)] ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
