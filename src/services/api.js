import axios from 'axios';

const API_BASE_URL = 'https://landing.docapp.co.in/api';
const LOCAL_API_BASE_URL = 'http://127.0.0.1:5000/api';

// Helper to grab token out of the document cookie stack
const getCookieToken = () => {
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const api = axios.create({ baseURL: API_BASE_URL });
const localApi = axios.create({ baseURL: LOCAL_API_BASE_URL });

const attachAuthInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = getCookieToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));
};

attachAuthInterceptor(api);
attachAuthInterceptor(localApi);

export const superAdminEndpoints = {
  login: (credentials) => api.post('/admin/login', credentials),
  getStats: () => api.get('/admin/stats'),
  getUnverifiedAccounts: () => api.get('/admin/get-unverified-acc'),
  searchAccounts: (query) => api.get(`/admin/search-accounts?search=${encodeURIComponent(query)}`),
  approveDoctor: (id) => api.put('/admin/approve-doctor', { doctor_id: Number(id) }),
  approveHospital: (id) => api.put('/admin/approve-hospital', { org_id: Number(id) }),
  deleteAccount: (id) => localApi.delete(`/admin/delete-account/${id}`),
  holdAccount: (id) => localApi.put(`/admin/hold-account/${id}`)
};