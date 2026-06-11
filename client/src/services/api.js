import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Add a request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const { token } = JSON.parse(adminInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
