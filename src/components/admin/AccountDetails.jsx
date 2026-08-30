import React from 'react';

export default function AccountDetails({ 
  account, 
  onBack, 
  onApprove, 
  onHold, 
  onResume, 
  onDelete, 
  isActioning 
}) {
  if (!account) return null;

  // Normalize data across both unverified and all accounts shapes
  const user = account.user || account;
  const targetId = account.targetId || account.id;
  const username = user.username || account.organisation_name || 'N/A';
  const email = user.email || 'N/A';
  const phone = user.phone_number || 'N/A';
  
  // Normalize role
  const rawRole = (account.role || account.computedType || 'general_user').toLowerCase();
  const displayRole = rawRole === 'general_user' ? 'PATIENT' : rawRole.toUpperCase();

  // Normalize status
  const rawStatus = (account.account_status || account.computedStatus || (rawRole === 'general_user' ? 'active' : 'unverified')).toLowerCase();
  let status = 'unverified';
  if (rawStatus === 'active') status = 'active';
  else if (rawStatus === 'hold' || rawStatus === 'holded') status = 'hold';
  else if (rawStatus === 'deleted') status = 'deleted';

  // Normalize attachments and addresses
  const documents = user.documents || [];
  const addresses = user.address || [];
  const createdAt = account.createdAt || account.created_at || user.createdAt;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header Card */}
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
              <h1 className="text-2xl font-bold text-slate-800">{username}</h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600 tracking-wider">
                {displayRole}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                status === 'hold' ? 'bg-amber-50 text-amber-700' :
                status === 'deleted' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {status.toUpperCase()}
              </span>
            </div>
            {createdAt && (
              <p className="text-xs text-slate-400 mt-1">
                Joined: {new Date(createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {status === 'unverified' && onApprove && (
            <button
              disabled={isActioning}
              onClick={() => onApprove(targetId, username, rawRole)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Approve
            </button>
          )}

          {status === 'active' && onHold && (
            <button
              disabled={isActioning}
              onClick={() => onHold(targetId, username, rawRole)}
              className="border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Hold
            </button>
          )}

          {status === 'hold' && onResume && (
            <button
              disabled={isActioning}
              onClick={() => onResume(targetId, username, rawRole)}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Resume
            </button>
          )}

          {status !== 'deleted' && onDelete && (
            <button
              disabled={isActioning}
              onClick={() => onDelete(targetId, username, rawRole)}
              className="bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* General Credentials & Identity Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Account Profile Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Account ID</p>
            <p className="text-sm font-medium text-slate-800 mt-1">{targetId}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Email Address</p>
            <p className="text-sm font-medium text-slate-800 mt-1">{email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Phone Number</p>
            <p className="text-sm font-medium text-slate-800 mt-1">{phone}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Email Verified</p>
            <p className="text-sm font-medium text-slate-800 mt-1">
              {account.is_email_verified ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Phone Verified</p>
            <p className="text-sm font-medium text-slate-800 mt-1">
              {account.is_phone_verified ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Profile Picture</p>
            {account.profile_picture ? (
              <a href={account.profile_picture} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                View Picture ↗
              </a>
            ) : (
              <p className="text-sm text-slate-400">Not Uploaded</p>
            )}
          </div>

          {/* Conditional Role Metadata */}
          {rawRole.includes('doctor') && (
            <>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Specialization</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{account.specialization || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">License Number</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{account.license_number || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Practice Start Date</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{account.practice_start_date || 'Not Provided'}</p>
              </div>
            </>
          )}

          {rawRole.includes('organisation') && (
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

      {/* Registered Addresses */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Address Details</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No registered address entries on record.</p>
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

      {/* Uploaded Verification Documents */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Verification Documents</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No compliance documents uploaded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {doc.document_type.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">
                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                  </p>
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