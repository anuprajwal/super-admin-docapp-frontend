import React from 'react';

export default function Alert({ type = 'error', message, onClose }) {
  const baseStyles = "p-4 rounded-lg mb-4 text-sm font-medium flex justify-between items-center transition-all duration-200 ";
  const typeStyles = type === 'success' 
    ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
    : "bg-rose-50 text-rose-800 border border-rose-200";

  if (!message) return null;

  return (
    <div className={baseStyles + typeStyles}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-3 font-bold hover:opacity-70 text-lg line-height-none">
          &times;
        </button>
      )}
    </div>
  );
}