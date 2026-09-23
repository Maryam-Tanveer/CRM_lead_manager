import api from './api';

export const leadService = {
  async getLeads(params = {}) {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get('/leads/analytics');
    return response.data;
  },

  async getLeadById(id) {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  async createLead(leadData) {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  async updateLeadStatus(id, status) {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data;
  },

  async updateLead(id, leadData) {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  async deleteLead(id) {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  }
};
