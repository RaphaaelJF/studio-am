import React from 'react';

export type TechnicalLabelElement = 'span' | 'div' | 'p';

export interface TechnicalLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: TechnicalLabelElement;
  children: React.ReactNode;
  className?: string;
}

export function TechnicalLabel({
  as: Component = 'span',
  children,
  className = '',
  ...props
}: TechnicalLabelProps) {
  return (
    <Component
      className={`text-label ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
