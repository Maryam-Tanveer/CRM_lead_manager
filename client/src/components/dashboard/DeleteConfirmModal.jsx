import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, leadName }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            Are you sure you want to permanently delete lead{' '}
            <strong className="font-semibold text-content-main">"{leadName}"</strong>? This
            action cannot be undone.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-content-muted hover:text-content-main rounded-xl hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Lead'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
