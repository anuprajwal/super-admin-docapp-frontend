// import React, { useState, useEffect } from 'react';
// import { superAdminEndpoints } from '../../services/api';
// import { logAdminActivity } from '../../utils/auditLogger';
// import Alert from '../ui/Alert';
// import Loader from '../ui/Loader';

// export default function GlobalAccountSearch() {
//   const [query, setQuery] = useState('');
//   const [selectedType, setSelectedType] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState('All');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [actioningId, setActioningId] = useState(null);
//   const [alert, setAlert] = useState({ type: '', message: '' });

//   const executeSearch = async () => {
//     setLoading(true);
//     setAlert({ type: '', message: '' });
//     try {
//       const response = await superAdminEndpoints.searchAccounts(query);
//       const data = response.data || {};
      
//       const doctors = data.unverified_doctors || data.doctors || [];
//       const orgs = data.unverified_organisations || data.organisations || [];
      
//       const mappedDocs = doctors.map(d => ({
//         id: d.user_id,
//         name: d.user?.username || d.username || 'Doctor Node',
//         email: d.user?.email || d.email,
//         type: 'Doctor',
//         status: d.status || 'Unverified'
//       }));

//       const mappedOrgs = orgs.map(o => ({
//         id: o.user_id || o.org_id,
//         name: o.user?.username || o.name || 'Hospital Node',
//         email: o.user?.email || o.email,
//         type: 'Hospital',
//         status: o.status || 'Unverified'
//       }));

//       setResults([...mappedDocs, ...mappedOrgs]);
//     } catch (err) {
//       setAlert({ type: 'error', message: 'Failed to complete comprehensive system query directory search.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     executeSearch();
//   }, []);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     executeSearch();
//   };

//   const filteredResults = results.filter(acc => {
//     const statusMatch = selectedStatus === 'All' || String(acc.status).toLowerCase() === selectedStatus.toLowerCase();
//     const typeMatch = selectedType === 'All' || String(acc.type).toLowerCase() === selectedType.toLowerCase();
//     return statusMatch && typeMatch;
//   });

//   const triggerAction = async (actionType, id, name, type) => {
//     setActioningId(id);
//     setAlert({ type: '', message: '' });
//     try {
//       if (actionType === 'approve') {
//         if (type === 'Doctor') await superAdminEndpoints.approveDoctor(id);
//         else await superAdminEndpoints.approveHospital(id);
//         logAdminActivity('Account Approved', name, type, 'Active');
//       } else if (actionType === 'hold') {
//         await superAdminEndpoints.holdAccount(id);
//         logAdminActivity('Account Suspended', name, type, 'Hold');
//       } else if (actionType === 'reactivate') {
//         if (type === 'Doctor') await superAdminEndpoints.approveDoctor(id);
//         else await superAdminEndpoints.approveHospital(id);
//         logAdminActivity('Account Reactivated', name, type, 'Active');
//       } else if (actionType === 'delete') {
//         if (!window.confirm(`Terminal deletion confirmation for ${name}?`)) return;
//         await superAdminEndpoints.deleteAccount(id);
//         logAdminActivity('Account Flushed Permanent', name, type, 'Purged');
//       }
//       setAlert({ type: 'success', message: `Execution framework completed state override successfully for ${name}.` });
//       executeSearch();
//     } catch (err) {
//       setAlert({ type: 'error', message: err.message || 'Operation mutation request rejected.' });
//     } finally {
//       setActioningId(null);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-slate-800">Global Account Search</h1>
//         <p className="text-sm text-slate-500">Query directory and deploy mutation vectors across the enterprise node layers.</p>
//       </div>

//       <form onSubmit={handleSearchSubmit} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//         <div className="md:col-span-2">
//           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Query</label>
//           <input 
//             type="text"
//             placeholder="Search matching profiles..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>
        
//         <div>
//           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Classification Type</label>
//           <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white outline-none">
//             <option value="All">All Classifications</option>
//             <option value="Doctor">Doctors Only</option>
//             <option value="Hospital">Hospitals Only</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Compliance Status</label>
//           <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white outline-none">
//             <option value="All">All Statuses</option>
//             <option value="Active">Active</option>
//             <option value="Unverified">Unverified</option>
//             <option value="Hold">Hold</option>
//           </select>
//         </div>

//         <div className="md:col-span-4 flex justify-end">
//           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-md transition-colors">
//             Query Node Matrices
//           </button>
//         </div>
//       </form>

//       <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

//       <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
//         {loading ? (
//           <Loader />
//         ) : filteredResults.length === 0 ? (
//           <div className="p-12 text-center text-slate-400 font-medium text-sm">
//             🔍 Zero directory assets located matching active filtration boundaries.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
//                 <tr>
//                   <th className="px-6 py-3.5">Name</th>
//                   <th className="px-6 py-3.5">Email Context</th>
//                   <th className="px-6 py-3.5">Role</th>
//                   <th className="px-6 py-3.5">Status Flag</th>
//                   <th className="px-6 py-3.5 text-right">Operational Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
//                 {filteredResults.map((acc) => {
//                   const currentStatus = String(acc.status).toLowerCase();
//                   return (
//                     <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
//                       <td className="px-6 py-4 text-slate-900 font-bold">{acc.name}</td>
//                       <td className="px-6 py-4 text-slate-500">{acc.email || 'N/A'}</td>
//                       <td className="px-6 py-4">
//                         <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600">{acc.type}</span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
//                           currentStatus === 'active' ? 'bg-emerald-50 text-emerald-700' :
//                           currentStatus === 'hold' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
//                         }`}>{acc.status}</span>
//                       </td>
//                       <td className="px-6 py-4 text-right space-x-1.5">
//                         {currentStatus === 'active' && (
//                           <>
//                             <button disabled={actioningId !== null} onClick={() => triggerAction('hold', acc.id, acc.name, acc.type)} className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors">Hold</button>
//                             <button disabled={actioningId !== null} onClick={() => triggerAction('delete', acc.id, acc.name, acc.type)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs px-2.5 py-1 rounded font-bold transition-colors">Delete</button>
//                           </>
//                         )}
//                         {(currentStatus === 'unverified' || currentStatus === 'false') && (
//                           <>
//                             <button disabled={actioningId !== null} onClick={() => triggerAction('approve', acc.id, acc.name, acc.type)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors">Approve</button>
//                             <button disabled={actioningId !== null} onClick={() => triggerAction('hold', acc.id, acc.name, acc.type)} className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors">Hold</button>
//                           </>
//                         )}
//                         {currentStatus === 'hold' && (
//                           <>
//                             <button disabled={actioningId !== null} onClick={() => triggerAction('reactivate', acc.id, acc.name, acc.type)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors">Reactivate</button>
//                             <button disabled={actioningId !== null} onClick={() => triggerAction('delete', acc.id, acc.name, acc.type)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs px-2.5 py-1 rounded font-bold transition-colors">Delete</button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



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
      // Consume the flat primary array layout directly from the response
      const accountsList = response.data?.accounts || [];
      setResults(accountsList);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to complete unified search query lookup.' });
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

  // Perform multi-variant client-side filtration using flat item properties
  const filteredResults = results.filter(acc => {
    const itemRole = acc.role ? String(acc.role).toLowerCase() : '';
    const itemStatus = acc.account_status ? String(acc.account_status).toLowerCase() : 'unverified';

    // Account type normalization rules matching general_user as general or user context
    const typeMatch = selectedType === 'All' || 
      itemRole === selectedType.toLowerCase() || 
      (selectedType === 'Patient' && itemRole === 'general_user');

    const statusMatch = selectedStatus === 'All' || itemStatus === selectedStatus.toLowerCase();
    
    return typeMatch && statusMatch;
  });

  const triggerAction = async (actionType, id, name, type) => {
    setActioningId(id);
    setAlert({ type: '', message: '' });
    try {
      if (actionType === 'approve') {
        if (String(type).toLowerCase() === 'doctor') {
          await superAdminEndpoints.approveDoctor(id);
        } else {
          await superAdminEndpoints.approveHospital(id);
        }
        logAdminActivity('Account Approved', name, type, 'Active');
      } else if (actionType === 'hold') {
        await superAdminEndpoints.holdAccount(id);
        logAdminActivity('Account Swapped to Hold State', name, type, 'Hold');
      } else if (actionType === 'reactivate') {
        if (String(type).toLowerCase() === 'doctor') {
          await superAdminEndpoints.approveDoctor(id);
        } else {
          await superAdminEndpoints.approveHospital(id);
        }
        logAdminActivity('Account Reactivated from Hold', name, type, 'Active');
      } else if (actionType === 'delete') {
        if (!window.confirm(`Permanently wipe structural system parameters for ${name}?`)) return;
        await superAdminEndpoints.deleteAccount(id);
        logAdminActivity('Account Destroyed from Directory', name, type, 'Purged');
      }
      
      setAlert({ type: 'success', message: `Execution framework updated status successfully for ${name}.` });
      executeSearch(); // Refresh list contents instantly
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Operation mutation request rejected by endpoint.' });
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Global Account Search</h1>
        <p className="text-sm text-slate-500">Query platform profiles and execute workflow status modifications.</p>
      </div>

      {/* Filter Matrix Workspace */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Accounts</label>
          <input 
            type="text"
            placeholder="Search by username, email, or account ID..."
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
            <option value="Unverified">Unverified</option>
            <option value="Hold">Hold</option>
          </select>
        </div>

        <div className="md:col-span-4 flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-md transition-colors">
            Execute Search
          </button>
        </div>
      </form>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {/* Directory Records Display Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <Loader />
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium text-sm">
            🔍 Zero system accounts located matching selected parameters.
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
                  const currentStatus = acc.account_status ? String(acc.account_status).toLowerCase() : 'unverified';
                  const labelName = acc.username || 'System Node';
                  
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-bold">{labelName}</td>
                      <td className="px-6 py-4 text-slate-500">{acc.email || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600 tracking-wider">
                          {acc.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
                          currentStatus === 'active' ? 'bg-emerald-50 text-emerald-700' :
                          currentStatus === 'hold' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5">
                        {/* Status Constraint Conditional Render Loop */}
                        {currentStatus === 'active' && (
                          <>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('hold', acc.id, labelName, acc.role)} 
                              className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Hold
                            </button>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('delete', acc.id, labelName, acc.role)} 
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
                              onClick={() => triggerAction('approve', acc.id, labelName, acc.role)} 
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('hold', acc.id, labelName, acc.role)} 
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
                              onClick={() => triggerAction('reactivate', acc.id, labelName, acc.role)} 
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded font-bold transition-colors disabled:opacity-50"
                            >
                              Reactivate
                            </button>
                            <button 
                              disabled={actioningId !== null} 
                              onClick={() => triggerAction('delete', acc.id, labelName, acc.role)} 
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