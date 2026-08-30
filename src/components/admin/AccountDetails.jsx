import React from 'react';

export default function AccountDetails({ account, onBack, onApprove, onDelete, isActioning }) {
  if (!account) return null;

  const isDoctor = account.computedType === 'Doctor';
  const user = account.user || {};
  const name = user.username || account.organisation_name || 'N/A';
  const email = user.email || 'N/A';
  const phone = user.phone_number || 'N/A';
  const documents = user.documents || [];
  const addresses = user.address || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            ← Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{name}</h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                isDoctor ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {account.computedType}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Created: {new Date(account.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={isActioning}
            onClick={() => onApprove(account.targetId, name, account.computedType)}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Approve Account
          </button>
          <button
            disabled={isActioning}
            onClick={() => onDelete(account.targetId, name, account.computedType)}
            className="bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* General Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Email Address</p>
            <p className="text-sm font-medium text-slate-800 mt-1">{email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Phone Number</p>
            <p className="text-sm font-medium text-slate-800 mt-1">{phone}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Profile Image</p>
            {account.profile_picture ? (
              <a href={account.profile_picture} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                View Profile Picture ↗
              </a>
            ) : (
              <p className="text-sm text-slate-400">None Provided</p>
            )}
          </div>
          {isDoctor ? (
            <>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Specialization</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{account.specialization || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">License Number</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{account.license_number || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Practice Start Date</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{account.practice_start_date || 'Not specified'}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Organisation Type</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{account.organisation_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Registration Number</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{account.regestration_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Website</p>
                {account.website_url ? (
                  <a href={account.website_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    {account.website_url} ↗
                  </a>
                ) : (
                  <p className="text-sm text-slate-400">N/A</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Address Details</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No address records provided.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{addr.street || 'Street not specified'}</p>
                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No verification documents uploaded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {doc.document_type.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
                <a
                  href={doc.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs py-2 rounded-lg transition-colors"
                >
                  View Attachment ↗
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}