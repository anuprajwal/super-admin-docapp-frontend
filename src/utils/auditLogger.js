const AUDIT_STORAGE_KEY = 'hms_super_admin_audit_logs';

export const getAuditLogs = () => {
  const logs = localStorage.getItem(AUDIT_STORAGE_KEY);
  return logs ? JSON.parse(logs) : [];
};

export const logAdminActivity = (action, accountName, role, status) => {
  const currentLogs = getAuditLogs();
  const newLog = {
    id: crypto.randomUUID(),
    action,
    accountName: accountName || 'System Process',
    role: role || 'System',
    date: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    status: status || 'Completed'
  };
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([newLog, ...currentLogs]));
};