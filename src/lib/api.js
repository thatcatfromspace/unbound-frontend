import axios from 'axios';

const api = axios.create({
  baseURL: 'https://promoted-pipefish-currently.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('x-api-key');
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
      config.headers['ngrok-skip-browser-warning'] = "true";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear storage or redirect if key is invalid
      // localStorage.removeItem('x-api-key'); 
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
