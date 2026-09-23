import React from 'react';
import { Mail, Phone, Calendar, UserCheck, Trash2, Edit2, Inbox } from 'lucide-react';
import { StatusDropdown } from './StatusDropdown';

export const LeadTable = ({
  leads = [],
  loading = false,
  tableLoading = false,
  onStatusChange,
  onEditLead,
  onDeleteLead,
  onOpenAddModal
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-surface-card border border-borderTheme rounded-t-2xl overflow-hidden p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-surface-base rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="w-full bg-surface-card border border-borderTheme rounded-t-2xl p-12 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-surface-hover flex items-center justify-center text-content-muted mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-content-main mb-1">No leads found</h4>
        <p className="text-xs text-content-muted max-w-sm mx-auto mb-4">
          No leads match your current search or status filter. Try clearing filters or add a new lead to start tracking.
        </p>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-md shadow-primary-500/20 transition-all"
        >
          Add New Lead
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-surface-card border border-borderTheme rounded-t-2xl shadow-sm relative">
      {tableLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary-500/20 overflow-hidden z-10">
          <div className="w-full h-full bg-primary-500 animate-pulse" />
        </div>
      )}

      <table className={`w-full text-left border-collapse transition-opacity duration-150 ${tableLoading ? 'opacity-85' : 'opacity-100'}`}>
        <thead>
          <tr className="border-b border-borderTheme bg-surface-base/50 text-content-muted text-[11px] font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-4 sm:px-6">Lead / Contact</th>
            <th className="py-3.5 px-4">Status (Update)</th>
            <th className="py-3.5 px-4">Assigned To</th>
            <th className="py-3.5 px-4 hidden md:table-cell">Created Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borderTheme/70 text-sm">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-surface-hover/50 transition-colors group"
            >
              <td className="py-3.5 px-4 sm:px-6">
                <div className="flex flex-col">
                  <span className="font-semibold text-content-main text-sm tracking-tight">
                    {lead.name}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-content-muted">
                    <span className="inline-flex items-center gap-1 hover:text-content-main">
                      <Mail className="w-3 h-3 text-content-subtle" />
                      {lead.email}
                    </span>
                    <span className="inline-flex items-center gap-1 hover:text-content-main">
                      <Phone className="w-3 h-3 text-content-subtle" />
                      {lead.phone}
                    </span>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4">
                <StatusDropdown
                  currentStatus={lead.status}
                  onStatusChange={(newStatus) => onStatusChange(lead._id, newStatus)}
                />
              </td>

              <td className="py-3.5 px-4">
                <div className="inline-flex items-center gap-1.5 text-xs text-content-main font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-primary-500" />
                  <span>{lead.assignedTo || 'Unassigned'}</span>
                </div>
              </td>

              <td className="py-3.5 px-4 hidden md:table-cell">
                <div className="inline-flex items-center gap-1.5 text-xs text-content-muted">
                  <Calendar className="w-3.5 h-3.5 text-content-subtle" />
                  <span>{formatDate(lead.createdAt)}</span>
                </div>
              </td>

              <td className="py-3.5 px-4 text-right">
                <div className="inline-flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEditLead(lead)}
                    title="Edit lead"
                    className="p-1.5 rounded-lg text-content-muted hover:text-primary-500 hover:bg-surface-hover transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteLead(lead)}
                    title="Delete lead"
                    className="p-1.5 rounded-lg text-content-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
