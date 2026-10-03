const REMOTE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const clearAuthSession = () => {
  document.cookie = "auth_token=; path=/; domain=.docapp.co.in; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
  localStorage.removeItem('auth_token');
  localStorage.removeItem('admin_current_view');
};


const getAuthToken = () => {
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return localStorage.getItem('auth_token');
  }
  return null;
};


const makeFetchRequest = async (endpoint, options = {}) => {
  const url = `${REMOTE_API_BASE_URL}${endpoint}`;

  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    let responseData = null;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    }

    if (!response.ok) {
      await setTimeout(() => {
        console.error(`HTTP Request Failure: ${response.status} - ${response.statusText}`, responseData);
      }, 100000);
      if (
        response.status === 401 ||
        response.status === 403 ||
        (responseData && responseData.error === 'jwt expired')
      ) {
        clearAuthSession();
        window.location.reload();
        return;
      }

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