// // Centralized API Base Configurations
// const REMOTE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// /**
//  * Robust utility to parse and extract the token out of the document cookie stack
//  * This allows all nested subdomains to share the active session securely.
//  */
// const getCookieToken = () => {
//   const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
//   console.log("match..",match)
//   return match ? decodeURIComponent(match[2]) : null;
// };

// /**
//  * Standard HTTP Request Wrapper for Native Fetch Calls
//  * @param {string} baseUrl - The base target API cluster URL
//  * @param {string} endpoint - The explicit URL route path
//  * @param {object} options - Standard fetch options configuration (method, body, etc.)
//  */
// const makeFetchRequest = async (baseUrl, endpoint, options = {}) => {
//   const url = `${baseUrl}${endpoint}`;
  
//   // Initialize default headers layout mapping
//   const headers = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };

//   // Extract cookie and inject token parameters into the Authorization header dynamically
//   const token = getCookieToken();
//   console.log("token..", token)
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   // Construct final fetch configuration setup
//   const config = {
//     ...options,
//     headers,
//   };

//   // Convert payload objects to JSON string strings if present
//   if (options.body && typeof options.body === 'object') {
//     config.body = JSON.stringify(options.body);
//   }

//   try {
//     const response = await fetch(url, config);
    
//     // Explicitly parse JSON response bodies safely
//     let responseData = null;
//     const contentType = response.headers.get('content-type');
//     if (contentType && contentType.includes('application/json')) {
//       responseData = await response.json();
//     }

//     // Intercept failing HTTP status codes to throw structural runtime exceptions
//     if (!response.ok) {
//       const errorContext = new Error(responseData?.message || `HTTP Request Failure Status: ${response.status}`);
//       errorContext.response = { data: responseData, status: response.status };
//       throw errorContext;
//     }

//     return { data: responseData, status: response.status };
//   } catch (error) {
//     // Standardizing network connection failure logging structures
//     if (!error.response) {
//       error.message = `Network connectivity layer failure: ${error.message}`;
//     }
//     throw error;
//   }
// };

// /**
//  * Unified Super Admin Endpoint Infrastructure Core Contracts
//  * Explicitly preserves every single API route context, request parameter structure, and URL contract.
//  */
// export const superAdminEndpoints = {
//   // Remote Server Endpoint Architectures (landing.docapp.co.in)
//   login: (credentials) => 
//     makeFetchRequest(REMOTE_API_BASE_URL, '/admin/login', {
//       method: 'POST',
//       body: credentials
//     }),

//   getStats: () => 
//     makeFetchRequest(REMOTE_API_BASE_URL, '/admin/stats', {
//       method: 'GET'
//     }),

//   getUnverifiedAccounts: () => 
//     makeFetchRequest(REMOTE_API_BASE_URL, '/admin/get-unverified-acc', {
//       method: 'GET'
//     }),

//   searchAccounts: (query) => 
//     makeFetchRequest(REMOTE_API_BASE_URL, `/admin/search-accounts?search=${encodeURIComponent(query)}`, {
//       method: 'GET'
//     }),

//   approveDoctor: (id) => 
//     makeFetchRequest(REMOTE_API_BASE_URL, '/admin/approve-doctor', {
//       method: 'PUT',
//       body: { doctor_id: Number(id) }
//     }),

//   approveHospital: (id) => 
//     makeFetchRequest(REMOTE_API_BASE_URL, '/admin/approve-hospital', {
//       method: 'PUT',
//       body: { org_id: Number(id) }
//     }),

//   // Localized Administrative Node Endpoint Architectures (127.0.0.1:5000)
//   deleteAccount: (id) => 
//     makeFetchRequest(REMOTE_API_BASE_URL, `/admin/delete-account/${id}`, {
//       method: 'DELETE'
//     }),

//   holdAccount: (id) => 
//     makeFetchRequest(REMOTE_API_BASE_URL, `/admin/hold-account/${id}`, {
//       method: 'PUT'
//     })
// };




const REMOTE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      method: 'DELETE'
    }),

  holdAccount: (id) => 
    makeFetchRequest(`/admin/hold-account/${id}`, {
      method: 'PUT'
    })
};