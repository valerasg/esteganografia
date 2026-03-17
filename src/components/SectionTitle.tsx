import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold border-b dark:border-gray-800 pb-2">
      {children}
    </h2>
  );
}
