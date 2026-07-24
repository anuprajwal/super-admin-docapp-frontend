import React, { useState } from 'react';
import { superAdminEndpoints } from '../../services/api';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';

export default function SuperAdminAuth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ type: 'error', message: 'Please enter both your email address and security token password.' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const response = await superAdminEndpoints.login({ email, password });
      const { token } = response.data; 

      // Inject authorization parameters into the document cookie stack 
      const cookieExpiry = rememberMe ? "; max-age=2592000" : ""; // 30 days
      document.cookie = `auth_token=${encodeURIComponent(token)}${cookieExpiry}; path=/; domain=.docapp.co.in; secure; samesite=lax`;

      onAuthSuccess();
    } catch (err) {
      setAlert({ 
        type: 'error', 
        message: err.response?.data?.message || 'Authentication rejected. Verify matching core configuration params.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisabledForgot = (e) => {
    e.preventDefault();
    setAlert({
      type: 'error',
      message: 'For security reasons, this self-service operation is disabled. Please contact the infrastructure engineering core technical team to roll override parameters.'
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-blue-700 via-blue-500 to-sky-300 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto text-2xl font-bold shadow-sm mb-4">
          🏥
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hospital Management System</h1>
        <p className="text-xs uppercase font-semibold text-slate-400 tracking-widest mt-1 mb-6">Super Admin Panel</p>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospital.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-500 font-medium">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <button type="button" onClick={handleDisabledForgot} className="text-blue-600 font-semibold hover:underline">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.99] flex justify-center items-center"
          >
            {loading ? <Loader size="small" /> : "Login as Admin"}
          </button>
        </form>

        <div className="mt-8 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-center justify-center space-x-2">
          <span className="text-emerald-600 text-sm">🔒</span>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Secure Admin Access</p>
            <p className="text-[9px] text-emerald-600 font-medium leading-none mt-0.5">Restricted portal. Access maps are audited.</p>
          </div>
        </div>
      </div>
    </div>
  );
}