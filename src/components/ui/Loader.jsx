import React from 'react';

export default function Loader({ size = 'medium' }) {
  const dimensions = size === 'small' ? 'w-5 h-5 border-2' : 'w-10 h-10 border-4';
  return (
    <div className="flex justify-center items-center py-4">
      <div className={`${dimensions} border-adminBlue-100 border-t-adminBlue-600 rounded-full animate-spin`}></div>
    </div>
  );
}