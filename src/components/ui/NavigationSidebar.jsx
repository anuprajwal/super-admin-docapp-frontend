import React from 'react';

export default function NavigationSidebar({ activeView, onViewChange, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'unverified', label: 'Unverified Accounts', icon: '🛡️' },
    { id: 'global-search', label: 'Global Account Search', icon: '🔍' }
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col min-h-screen border-r border-slate-800 shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-adminBlue-600 p-2 rounded-lg text-white font-bold text-xl">HMS</div>
        <div>
          <h2 className="font-semibold text-sm tracking-wide leading-tight">Hospital MS</h2>
          <span className="text-xs text-slate-400">Super Admin Console</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === item.id 
                ? 'bg-adminBlue-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}