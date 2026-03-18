import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="relative mb-6 pb-4">
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
        {children}
      </h2>
      <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
    </div>
  );
}
