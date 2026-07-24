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
      setResults(response.data?.accounts || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to populate core platform directories search map.' });
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

  // Perform client-side filtration using exact database enum configurations
  const filteredResults = results.filter(acc => {
    const itemRole = acc.role ? String(acc.role).toLowerCase() : '';
    const rawStatus = acc.account_status ? String(acc.account_status).toLowerCase() : '';

    // Step 1: Clean status mapping based on role differences
    let computedStatus = 'unverified'; 
    
    if (rawStatus === 'active') {
      computedStatus = 'active';
    } else if (rawStatus === 'holded' || rawStatus === 'hold') {
      computedStatus = 'hold';
    } else if (rawStatus === 'deleted') {
      computedStatus = 'deleted';
    } else {
      // If it has no explicit enum status field, check role context
      if (itemRole === 'general_user') {
        computedStatus = 'active'; // Normal users don't have onboarding verification stages
      } else {
        computedStatus = 'unverified'; // Doctors/Hospitals default to unverified if blank
      }
    }

    // Step 2: Evaluate matching drop-down filters
    const typeMatch = selectedType === 'All' || 
      itemRole === selectedType.toLowerCase() || 
      (selectedType === 'Patient' && itemRole === 'general_user');

    const statusMatch = selectedStatus === 'All' || computedStatus === selectedStatus.toLowerCase();
    
    return typeMatch && statusMatch;
  });

  const handleStateMutation = async (actionType, id, name, role) => {
    setActioningId(id);
    setAlert({ type: '', message: '' });
    try {
      if (actionType === 'approve') {
        if (String(role).toLowerCase() === 'doctor') {
          await superAdminEndpoints.approveDoctor(id);
        } else {
          await superAdminEndpoints.approveHospital(id);
        }
        logAdminActivity('Account Approved', name, role, 'Active');
      } else if (actionType === 'hold') {
        await superAdminEndpoints.holdAccount(id);
        logAdminActivity('Account Placed on Hold', name, role, 'Hold');
      } else if (actionType === 'resume') {
        await superAdminEndpoints.resumeAccount(id);
        logAdminActivity('Account Hold Resumed', name, role, 'Active');
      } else if (actionType === 'delete') {
        if (!window.confirm(`Permanently drop database access flags for ${name}?`)) return;
        await superAdminEndpoints.deleteAccount(id);
        logAdminActivity('Account Deleted Permanently', name, role, 'Deleted');
      }

      setAlert({ type: 'success', message: `Successfully updated workspace state parameter for: ${name}.` });
      executeSearch(); 
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Target state override execution failure.' });
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Global Account Search</h1>
        <p className="text-sm text-slate-500">Manage and monitor all hospital user accounts across the global system.</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Accounts</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">🔍</span>
            <input 
              type="text"
              placeholder="Search by name, email, or account ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50/50 outline-none"
            />
          </div>
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
            <option value="Patient">Patients</option>
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
            <option value="Unverified">Unverified (Staff Only)</option>
            <option value="Hold">Hold</option>
            <option value="Deleted">Deleted</option> {/* Added functional filter dropdown option */}
          </select>
        </div>

        <div className="md:col-span-4 flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-md transition-colors">
            Search
          </button>
        </div>
      </form>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <Loader />
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium text-sm">
            🔍 No configuration rows match active query boundaries.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email context</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredResults.map((acc) => {
                  const itemRole = acc.role ? String(acc.role).toLowerCase() : '';
                  const rawStatus = acc.account_status ? String(acc.account_status).toLowerCase() : '';
                  
                  // Compute dynamic display parameters matching rules
                  let displayStatus = 'unverified';
                  if (rawStatus === 'active') displayStatus = 'active';
                  else if (rawStatus === 'holded' || rawStatus === 'hold') displayStatus = 'hold';
                  else if (rawStatus === 'deleted') displayStatus = 'deleted';
                  else if (itemRole === 'general_user') displayStatus = 'active';

                  const labelName = acc.username || 'System Node';
                  const labelRole = acc.role === 'general_user' ? 'PATIENT' : String(acc.role).toUpperCase();

                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-bold">{labelName}</td>
                      <td className="px-6 py-4 text-slate-500">{acc.email || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600 tracking-wider">
                          {labelRole}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          displayStatus === 'active' ? 'bg-emerald-50 text-emerald-700' :
                          displayStatus === 'hold' ? 'bg-amber-50 text-amber-700' : 
                          displayStatus === 'deleted' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            displayStatus === 'active' ? 'bg-emerald-500' :
                            displayStatus === 'hold' ? 'bg-amber-500' : 
                            displayStatus === 'deleted' ? 'bg-rose-500' : 'bg-slate-400'
                          }`}></span>
                          {displayStatus === 'active' ? 'Active' : displayStatus === 'hold' ? 'Held' : displayStatus === 'deleted' ? 'Deleted' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 h-[53px]">
                        {/* Render live actionable elements depending entirely on active status flags */}
                        {displayStatus === 'active' && (
                          <>
                            <button disabled={actioningId !== null} onClick={() => handleStateMutation('hold', acc.id, labelName, acc.role)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded font-bold transition-colors">Hold</button>
                            <button disabled={actioningId !== null} onClick={() => handleStateMutation('delete', acc.id, labelName, acc.role)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs px-3 py-1.5 rounded font-bold transition-colors">Delete</button>
                          </>
                        )}
                        {displayStatus === 'unverified' && (
                          <>
                            <button disabled={actioningId !== null} onClick={() => handleStateMutation('approve', acc.id, labelName, acc.role)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors">Approve</button>
                            <button disabled={actioningId !== null} onClick={() => handleStateMutation('hold', acc.id, labelName, acc.role)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded font-bold transition-colors">Hold</button>
                          </>
                        )}
                        {displayStatus === 'hold' && (
                          <>
                            <button disabled={actioningId !== null} onClick={() => handleStateMutation('resume', acc.id, labelName, acc.role)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors">Resume</button>
                            <button disabled={actioningId !== null} onClick={() => handleStateMutation('delete', acc.id, labelName, acc.role)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs px-3 py-1.5 rounded font-bold transition-colors">Delete</button>
                          </>
                        )}
                        {displayStatus === 'deleted' && (
                          // Rule 1 mandate: Hidden layout configuration for deleted rows.
                          <span className="text-xs text-slate-400 italic font-medium pr-2">No actions available</span>
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