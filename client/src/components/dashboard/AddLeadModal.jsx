import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { leadFormSchema } from '../../validations/leadSchema';

export const AddLeadModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new',
    assignedTo: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || 'new',
        assignedTo: initialData.assignedTo || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'new',
        assignedTo: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const result = leadFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      const backendMessage = err.response?.data?.message || 'Failed to save lead';
      const backendErrors = err.response?.data?.errors || {};
      setErrors({ form: backendMessage, ...backendErrors });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Lead Details' : 'Create New Lead'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            {errors.form}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-content-main mb-1.5">
            Full Name <span className="text-primary-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="e.g. Sarah Connor"
            className="w-full px-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-content-main mb-1.5">
              Email Address <span className="text-primary-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="e.g. sarah@example.com"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-content-main mb-1.5">
              Phone Number <span className="text-primary-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder="e.g. +1 555-0199"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-content-main mb-1.5">
              Pipeline Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-content-main mb-1.5">
              Assigned Representative
            </label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-borderTheme mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-content-muted hover:text-content-main rounded-xl hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-md shadow-primary-500/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : initialData ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
