import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      className={`whitespace-nowrap py-4 px-6 text-sm font-medium flex items-center border-b-2 transition-colors ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}