import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token and trace ID
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('setu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const traceId = `tr-fe-${Math.random().toString(36).substring(2, 9)}`;
  config.headers['X-Trace-Id'] = traceId;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('setu_token');
    }
    return Promise.reject(error);
  }
);

export default api;
