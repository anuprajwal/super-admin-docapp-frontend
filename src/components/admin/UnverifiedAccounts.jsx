import React, { useState, useEffect } from 'react';
import { superAdminEndpoints } from '../../services/api';
import { logAdminActivity } from '../../utils/auditLogger';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';

export default function UnverifiedAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchAccounts = async (query = '') => {
    setLoading(true);
    try {
      let response;
      if (query.trim()) {
        response = await superAdminEndpoints.searchAccounts(query);
      } else {
        response = await superAdminEndpoints.getUnverifiedAccounts();
      }

      // Filter local state array to only present unverified datasets dynamically
      const rawData = response.data?.accounts || response.data || [];
      const unverifiedData = rawData.filter(acc => 
        String(acc.status).toLowerCase() === 'unverified' || 
        String(acc.verified).toLowerCase() === 'false' ||
        acc.status === undefined
      );
      setAccounts(unverifiedData);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to synchronize incoming registry parameters from network data nodes.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAccounts(searchQuery);
  };

  const handleApprove = async (id, name, type) => {
    setActioningId(id);
    setAlert({ type: '', message: '' });
    try {
      if (type.toLowerCase() === 'doctor') {
        await superAdminEndpoints.approveDoctor(id);
      } else {
        await superAdminEndpoints.approveHospital(id);
      }
      logAdminActivity('Account Approved', name, type, 'Approved');
      setAlert({ type: 'success', message: `Successfully authorized credential records for ${name}.` });
      setAccounts(prev => prev.filter(acc => (acc.id !== id && acc.doctor_id !== id && acc.org_id !== id)));
    } catch (err) {
      setAlert({ type: 'error', message: 'Target update request structural execution failure.' });
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (id, name, type) => {
    if (!window.confirm(`Permanently wipe structural system parameters for ${name}?`)) return;
    setActioningId(id);
    setAlert({ type: '', message: '' });
    try {
      await superAdminEndpoints.deleteAccount(id);
      logAdminActivity('Account Removed Permanently', name, type, 'Deleted');
      setAlert({ type: 'success', message: `Flushed dataset node configurations matching ${name} from core registry.` });
      setAccounts(prev => prev.filter(acc => (acc.id !== id && acc.doctor_id !== id && acc.org_id !== id)));
    } catch (err) {
      setAlert({ type: 'error', message: 'Purge request rejected by secondary core server validation logic.' });
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Unverified Accounts</h1>
          <p className="text-sm text-slate-500">Review pending regulatory compliance records for authorization hooks.</p>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search pending applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
          <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            Search
          </button>
        </form>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <Loader />
        ) : accounts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium text-sm">
            🛡️ Configuration matrices clear. No unverified nodes awaiting system synchronization hooks.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Account Name</th>
                  <th className="px-6 py-3.5">Email Context</th>
                  <th className="px-6 py-3.5">Classification Type</th>
                  <th className="px-6 py-3.5">Status Check</th>
                  <th className="px-6 py-3.5 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {accounts.map((acc) => {
                  const targetId = acc.id || acc.doctor_id || acc.org_id;
                  const targetName = acc.name || acc.username || acc.account_name || 'Unknown Entity';
                  const targetEmail = acc.email || 'N/A';
                  const targetType = acc.type || (acc.doctor_id ? 'Doctor' : 'Hospital');

                  return (
                    <tr key={targetId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-bold">{targetName}</td>
                      <td className="px-6 py-4 text-slate-500">{targetEmail}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                          targetType.toLowerCase() === 'doctor' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>{targetType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-700 uppercase tracking-wide">
                          Unverified
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          disabled={actioningId !== null}
                          onClick={() => handleApprove(targetId, targetName, targetType)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={actioningId !== null}
                          onClick={() => handleDelete(targetId, targetName, targetType)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}