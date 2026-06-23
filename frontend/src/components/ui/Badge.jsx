import React from 'react';

export function Badge({ children, status, className = '' }) {
  const statusStyles = {
    success: 'bg-green-100 text-green-800', // Revisado / OK
    warning: 'bg-yellow-200 text-yellow-800', // Pendente
    danger: 'bg-red-100 text-red-800', // Alerta
    default: 'bg-gray-100 text-gray-800'
  };

  const style = statusStyles[status] || statusStyles.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}>
      {status === 'success' && <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>}
      {status === 'warning' && <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-1.5"></span>}
      {status === 'danger' && <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5"></span>}
      {children}
    </span>
  );
}
