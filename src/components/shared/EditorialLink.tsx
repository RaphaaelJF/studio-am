import React from 'react';
import Link from 'next/link';

export interface EditorialLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function EditorialLink({
  href,
  children,
  className = '',
  external = false,
}: EditorialLinkProps) {
  const isExternal = external || href.startsWith('http');
  const baseClasses =
    'group inline-flex items-center gap-2 text-body-sm font-medium text-foreground hover:text-muted transition-colors duration-fast focus-visible:outline-foreground';

  const content = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-fast group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${className}`.trim()}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${baseClasses} ${className}`.trim()}>
      {content}
    </Link>
  );
}
