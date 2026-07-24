// import React, { useState, useEffect } from 'react';
// import { superAdminEndpoints } from '../../services/api';
// import { getAuditLogs } from '../../utils/auditLogger';
// import Alert from '../ui/Alert';
// import Loader from '../ui/Loader';

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({ totalUsers: 0, totalDoctors: 0, totalHospitals: 0, pendingVerifications: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     async function loadDashboardData() {
//       try {
//         const response = await superAdminEndpoints.getStats();
//         // Assume keys based on operational requirements parsing
//         setStats({
//           totalUsers: response.data?.totalUsers || response.data?.users_count || 0,
//           totalDoctors: response.data?.totalDoctors || response.data?.doctors_count || 0,
//           totalHospitals: response.data?.totalHospitals || response.data?.organisations_count || 0,
//           pendingVerifications: response.data?.pendingVerifications || response.data?.pending_count || 0,
//         });
//         setLogs(getAuditLogs());
//       } catch (err) {
//         setError('Failed to refresh central metrics system telemetry parameters.');
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadDashboardData();
//   }, []);

//   if (loading) return <Loader />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
//           <p className="text-sm text-slate-500">Global health system status metrics index indicators.</p>
//         </div>
//       </div>

//       <Alert type="error" message={error} />

//       {/* Cards Matrix Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//         {[
//           { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'text-blue-600 bg-blue-50' },
//           { title: 'Total Doctors', value: stats.totalDoctors, icon: '🩺', color: 'text-purple-600 bg-purple-50' },
//           { title: 'Total Hospitals', value: stats.totalHospitals, icon: '🏢', color: 'text-emerald-600 bg-emerald-50' },
//           { title: 'Pending Verifications', value: stats.pendingVerifications, icon: '⏳', color: 'text-amber-600 bg-amber-50' }
//         ].map((card, i) => (
//           <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
//             <div>
//               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
//               <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value.toLocaleString()}</h3>
//             </div>
//             <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${card.color}`}>
//               {card.icon}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Static Visual Metric Section */}
//       <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h3 className="text-base font-bold text-slate-800">System Activity Overview</h3>
//             <p className="text-xs text-slate-400">Global registrations and logins trend for the last 30 days</p>
//           </div>
//           <span className="text-xs font-medium border border-slate-200 px-2.5 py-1 rounded-md text-slate-500 bg-slate-50">Last 30 Days</span>
//         </div>
//         <div className="h-48 flex items-end gap-3 px-2 pt-4 border-b border-l border-slate-100">
//           {[40, 55, 48, 75, 60, 90, 68].map((height, i) => (
//             <div key={i} className="flex-1 flex flex-col items-center group">
//               <div 
//                 className="w-full bg-slate-300 rounded-t group-hover:bg-adminBlue-500 transition-all duration-200 cursor-pointer" 
//                 style={{ height: `${height}%` }}
//               ></div>
//               <span className="text-[10px] text-slate-400 font-medium mt-2">Wk {i + 1}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Client-Side Audit Engine Output Block */}
//       <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
//         <div className="p-5 border-b border-slate-100 flex justify-between items-center">
//           <h3 className="text-base font-bold text-slate-800">Recent System Activity</h3>
//           <span className="text-xs text-slate-400 font-medium">Real-time local tracking enabled</span>
//         </div>
//         <div className="overflow-x-auto">
//           {logs.length === 0 ? (
//             <div className="p-8 text-center text-slate-400 text-sm">
//               ✨ No administrative mutations executed inside this local workstation terminal sequence yet.
//             </div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
//                 <tr>
//                   <th className="px-6 py-3.5">Action</th>
//                   <th className="px-6 py-3.5">Account Name</th>
//                   <th className="px-6 py-3.5">Role</th>
//                   <th className="px-6 py-3.5">Timestamp</th>
//                   <th className="px-6 py-3.5">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
//                 {logs.map((log) => (
//                   <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
//                     <td className="px-6 py-4 flex items-center space-x-2 text-slate-900">
//                       <span>⚡</span>
//                       <span>{log.action}</span>
//                     </td>
//                     <td className="px-6 py-4">{log.accountName}</td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
//                         log.role.toLowerCase() === 'doctor' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
//                       }`}>{log.role}</span>
//                     </td>
//                     <td className="px-6 py-4 text-xs text-slate-400">{log.date}</td>
//                     <td className="px-6 py-4">
//                       <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
//                         {log.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { superAdminEndpoints } from '../../services/api';
import { getAuditLogs } from '../../utils/auditLogger';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalHospitals: 0, totalAppointments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await superAdminEndpoints.getStats();
        if (response.data && response.data.stats) {
          setStats({
            totalDoctors: response.data.stats.totalDoctors || 0,
            totalPatients: response.data.stats.totalPatients || 0,
            totalHospitals: response.data.stats.totalHospitals || 0,
            totalAppointments: response.data.stats.totalAppointments || 0
          });
        }
        setLogs(getAuditLogs());
      } catch (err) {
        setError(err.message || 'Failed to refresh central metrics system telemetry.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Global health platform telemetry monitor terminal.</p>
      </div>

      <Alert type="error" message={error} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { title: 'Total Patients', value: stats.totalPatients, icon: '👥', color: 'text-blue-600 bg-blue-50' },
          { title: 'Total Doctors', value: stats.totalDoctors, icon: '🩺', color: 'text-purple-600 bg-purple-50' },
          { title: 'Total Hospitals', value: stats.totalHospitals, icon: '🏢', color: 'text-emerald-600 bg-emerald-50' },
          { title: 'Total Appointments', value: stats.totalAppointments, icon: '📅', color: 'text-amber-600 bg-amber-50' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value.toLocaleString()}</h3>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">System Activity Overview</h3>
            <p className="text-xs text-slate-400">Global traffic logs tracking trend index</p>
          </div>
          <span className="text-xs font-medium border border-slate-200 px-2.5 py-1 rounded-md text-slate-500 bg-slate-50">Static (30 Days)</span>
        </div>
        <div className="h-48 flex items-end gap-3 px-2 pt-4 border-b border-l border-slate-100">
          {[35, 60, 45, 80, 55, 95, 70].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group">
              <div className="w-full bg-slate-200 rounded-t group-hover:bg-blue-600 transition-all duration-200 cursor-pointer" style={{ height: `${height}%` }}></div>
              <span className="text-[10px] text-slate-400 font-medium mt-2">Wk {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Recent System Activity</h3>
        </div>
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              ✨ Workstation sequence clean. No admin mutations recorded in this browser window.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Action</th>
                  <th className="px-6 py-3.5">Account Name</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-2 text-slate-900">
                      <span>⚡</span>
                      <span>{log.action}</span>
                    </td>
                    <td className="px-6 py-4">{log.accountName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        log.role.toLowerCase() === 'doctor' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>{log.role}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{log.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}