import React, { useState, useEffect } from 'react';
import { superAdminEndpoints } from '../../services/api';
import { logAdminActivity } from '../../utils/auditLogger';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';

export default function GlobalAccountSearch() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const executeSearch = async () => {
    setLoading(true);
    setAlert({ type: '', message: '' });
    try {
      const response = await superAdminEndpoints.searchAccounts(query);
      setResults(response.data?.accounts || response.data || []);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to complete unified node system directory lookup sequence.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  // Client-side filtration matrix block covering explicit drop variables
  const filteredResults = results.filter(acc => {
    const type = acc.type || (acc.doctor_id ? 'Doctor' : 'Hospital');
    const status = acc.status ? String(acc.status).toLowerCase() : 'unverified';
    
    const typeMatch = selectedType === 'All' || type.toLowerCase() === selectedType.toLowerCase();
    const statusMatch = selectedStatus === 'All' || status === selectedStatus.toLowerCase();
    
    return typeMatch && statusMatch;
  });

  const triggerAction = async (actionType, id, name, classification) => {
    setActioningId(id);
    setAlert({ type: '', message: '' });
    try {
      if (actionType === 'approve') {
        if (classification.toLowerCase() === 'doctor') await superAdminEndpoints.approveDoctor(id);
        else await superAdminEndpoints.approveHospital(id);
        logAdminActivity('Account Approved via Directory', name, classification, 'Active');
      } else if (actionType === 'hold') {
        await superAdminEndpoints.holdAccount(id);
        logAdminActivity('Account Swapped to Hold State', name, classification, 'Hold');
      } else if (actionType === 'reactivate') {
        // Reactivating leverages validation approve hooks underneath logic architecture parameters
        if (classification.toLowerCase() === 'doctor') await superAdminEndpoints.approveDoctor(id);
        else await superAdminEndpoints.approveHospital(id);
        logAdminActivity('Account Reactivated from Hold', name, classification, 'Active');
      } else if (actionType === 'delete') {
        if (!window.confirm(`Confirm terminal clearance parameters for ${name}?`)) return;
        await superAdminEndpoints.deleteAccount(id);
        logAdminActivity('Account Destroyed from Directory', name, classification, 'Purged');
      }
      
      setAlert({ type: 'success', message: `Execution pipeline completed successfully for operational node: ${name}.` });
      executeSearch(); // Synchronize parameters downstream instantly 
    } catch (err) {
      setAlert({ type: 'error', message: 'Endpoint validation workflow modification mismatch.' });
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Global Account Search</h1>
        <p className="text-sm text-slate-500">Manage and monitor all hospital user accounts across the global system.</p>
      </div>

      {/* Interface Filter Bar Layout */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Accounts</label>
          <input 
            type="text"
            placeholder="Search by name, email, or account ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Account Type</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white outline-none"
          >
            <option value="All">All Types</option>
            <option value="Doctor">Doctors</option>
            <option value="Hospital">Hospitals</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Unverified">Unverified</option>
            <option value="Hold">Hold</option>
          </select>
        </div>

        <div className="md:col-span-4 flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-md transition-colors">
            Search Matrix
          </button>
        </div>
      </form>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {/* Directory Table Grid Layout Output */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <Loader />
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium text-sm">
            🔍 Zero directory configurations located matching filtered boundary sets.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email Context</th>
                  <th className="px-6 py-3.5">Role Matrix</th>
                  <th className="px-6 py-3.5">Status Flag</th>
                  <th className="px-6 py-3.5 text-right">Actions Panel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredResults.map((acc) => {
                  const targetId = acc.id || acc.doctor_id || acc.org_id;
                  const targetName = acc.name || acc.username || acc.account_name || 'N/A';
                  const targetEmail = acc.email || 'N/A';
                  const classification = acc.type || (acc.doctor_id ? 'Doctor' : 'Hospital');
                  const currentStatus = acc.status ? String(acc.status).toLowerCase() : 'unverified';

                  return (
                    <tr key={targetId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-bold">{targetName}</td>
                      <td className="px-6 py-4 text-slate-500">{targetEmail}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-slate-100 text-slate-600 tracking-wider">
                          {classification}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          currentStatus === 'active' ? 'bg-emerald-50 text-emerald-700' :
                          currentStatus === 'hold' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                        } uppercase tracking-wide`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5">
                        {/* Dynamic Button Matrix Rendering Logic based on context status rules */}
                        {currentStatus === 'active' && (
                          <>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('hold', targetId, targetName, classification)}
                              className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Hold
                            </button>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('delete', targetId, targetName, classification)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {currentStatus === 'unverified' && (
                          <>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('approve', targetId, targetName, classification)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('hold', targetId, targetName, classification)}
                              className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Hold
                            </button>
                          </>
                        )}
                        {currentStatus === 'hold' && (
                          <>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('reactivate', targetId, targetName, classification)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Reactivate
                            </button>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('delete', targetId, targetName, classification)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </>
                        )}
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