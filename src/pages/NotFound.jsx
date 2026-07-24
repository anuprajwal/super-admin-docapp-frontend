import React from 'react';

export default function NotFound({ onReturn }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center text-center p-6">
      <div className="text-6xl mb-4">🛑</div>
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">404 - Resource Mismatch Exception</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
        The system routing framework failed to capture structural parameters matching the specific URL node requested.
      </p>
      {onReturn && (
        <button 
          onClick={onReturn}
          className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow transition-all"
        >
          Return to Platform System Overview
        </button>
      )}
    </div>
  );
}