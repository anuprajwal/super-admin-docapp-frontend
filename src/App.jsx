import React, { useState, useEffect } from 'react';
import SuperAdminAuth from './components/admin/SuperAdminAuth';
import NavigationSidebar from './components/ui/NavigationSidebar';
import AdminDashboard from './components/admin/AdminDashboard';
import UnverifiedAccounts from './components/admin/UnverifiedAccounts';
import GlobalAccountSearch from './components/admin/GlobalAccountSearch';
import NotFound from './pages/NotFound';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Validate session cookie presence at point of app engine initialization
    const sessionTokenExists = document.cookie.split('; ').some(row => row.startsWith('auth_token='));
    if (sessionTokenExists) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    // Destructure cookie targeting wildcard domain mappings configuration 
    document.cookie = "auth_token=; path=/; domain=.docapp.co.in; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return <SuperAdminAuth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'unverified':
        return <UnverifiedAccounts />;
      case 'global-search':
        return <GlobalAccountSearch />;
      default:
        return <NotFound onReturn={() => setCurrentView('dashboard')} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full overflow-hidden">
      {/* Dynamic Single Shared Navigation Unit */}
      <NavigationSidebar 
        activeView={currentView} 
        onViewChange={(viewId) => setCurrentView(viewId)} 
        onLogout={handleLogout}
      />
      
      {/* Central Viewport Container Box */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {renderActiveView()}
      </main>
    </div>
  );
}