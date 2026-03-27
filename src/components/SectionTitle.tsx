import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="relative mb-6 pb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {children}
      </h2>
      <div className="absolute bottom-0 left-0 w-8 h-1 bg-black dark:bg-white rounded-full"></div>
    </div>
  );
}
