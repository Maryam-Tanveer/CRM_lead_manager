import api, { setStoredAccessToken } from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    if (response.data?.data?.accessToken) {
      setStoredAccessToken(response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem('lead_crm_refresh_token', response.data.data.refreshToken);
      }
      localStorage.setItem('lead_crm_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.accessToken) {
      setStoredAccessToken(response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem('lead_crm_refresh_token', response.data.data.refreshToken);
      }
      localStorage.setItem('lead_crm_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      const storedRefreshToken = localStorage.getItem('lead_crm_refresh_token');
      await api.post('/auth/logout', { refreshToken: storedRefreshToken });
    } catch (e) {
    } finally {
      setStoredAccessToken(null);
      localStorage.removeItem('lead_crm_refresh_token');
      localStorage.removeItem('lead_crm_user');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
