import React from 'react';

export function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primaryHover hover:shadow-md focus:ring-primary',
    outline: 'border border-primary text-primary hover:bg-green-50 focus:ring-primary',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
