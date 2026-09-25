import axios from 'axios';

let accessToken = localStorage.getItem('lead_crm_access_token') || null;

export const setStoredAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('lead_crm_access_token', token);
  } else {
    localStorage.removeItem('lead_crm_access_token');
  }
};

export const getStoredAccessToken = () => accessToken;


const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const proxy = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});



proxy.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

proxy.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url.includes('/auth/login') ||
        originalRequest.url.includes('/auth/register') ||
        originalRequest.url.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return proxy(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem('lead_crm_refresh_token');

                const response = await proxy.post(
  '/auth/refresh',
  { refreshToken: storedRefreshToken }
);


        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;

        setStoredAccessToken(newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('lead_crm_refresh_token', newRefreshToken);
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return proxy(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setStoredAccessToken(null);
        localStorage.removeItem('lead_crm_refresh_token');
        localStorage.removeItem('lead_crm_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default proxy;
