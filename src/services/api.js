const REMOTE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Utility to clear auth cookies and session keys on expiry or unauthorized responses
 */
export const clearAuthSession = () => {
  // Clear cookie targeting the production domain
  document.cookie = "auth_token=; path=/; domain=.docapp.co.in; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  // Clear root cookie fallback (for local development)
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
  localStorage.removeItem('auth_token');
  localStorage.removeItem('admin_current_view');
};

/**
 * Robust utility to parse and extract the token out of the document cookie stack.
 * Incorporates a localStorage fallback loop to support unblocked testing on localhost.
 */
const getAuthToken = () => {
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * Standard HTTP Request Wrapper for Native Fetch Calls
 */
const makeFetchRequest = async (endpoint, options = {}) => {
  const url = `${REMOTE_API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle Unauthorized / Expired sessions
    if (response.status === 401 || response.status === 403) {
      clearAuthSession();
      // Reload window to trigger the login screen view
      window.location.reload();
      return;
    }

    let responseData = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    }

    if (!response.ok) {
      const errorContext = new Error(responseData?.message || `HTTP Request Failure Status: ${response.status}`);
      errorContext.response = { data: responseData, status: response.status };
      throw errorContext;
    }

    return { data: responseData, status: response.status };
  } catch (error) {
    if (!error.response) {
      error.message = `Network connectivity layer failure: ${error.message}`;
    }
    throw error;
  }
};

export const superAdminEndpoints = {
  login: (credentials) => 
    makeFetchRequest('/admin/login', {
      method: 'POST',
      body: credentials
    }),

  getStats: () => 
    makeFetchRequest('/admin/stats', {
      method: 'GET'
    }),

  getUnverifiedAccounts: () => 
    makeFetchRequest('/admin/get-unverified-acc', {
      method: 'GET'
    }),

  searchAccounts: (query) => 
    makeFetchRequest(`/admin/search-accounts?search=${encodeURIComponent(query)}`, {
      method: 'GET'
    }),

  approveDoctor: (id) => 
    makeFetchRequest('/admin/approve-doctor', {
      method: 'PUT',
      body: { doctor_id: Number(id) }
    }),

  approveHospital: (id) => 
    makeFetchRequest('/admin/approve-hospital', {
      method: 'PUT',
      body: { org_id: Number(id) }
    }),

  deleteAccount: (id) => 
    makeFetchRequest(`/admin/delete-account/${id}`, {
      method: 'PUT'
    }),

  holdAccount: (id) => 
    makeFetchRequest(`/admin/hold-account/${id}`, {
      method: 'PUT'
    }),

  resumeAccount: (id) => 
    makeFetchRequest('/admin/resume-account/' + id, { 
      method: 'PUT' 
    })
};