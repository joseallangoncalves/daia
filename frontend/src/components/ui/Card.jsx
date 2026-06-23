import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}
