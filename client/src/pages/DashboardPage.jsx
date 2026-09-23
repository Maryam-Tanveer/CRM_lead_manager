import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { AnalyticsCards } from '../components/dashboard/AnalyticsCards';
import { FilterBar } from '../components/dashboard/FilterBar';
import { LeadTable } from '../components/dashboard/LeadTable';
import { Pagination } from '../components/dashboard/Pagination';
import { AddLeadModal } from '../components/dashboard/AddLeadModal';
import { DeleteConfirmModal } from '../components/dashboard/DeleteConfirmModal';
import { leadService } from '../services/leadService';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const DashboardPage = () => {
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [toast, setToast] = useState(null);

  const hasMounted = useRef(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const res = await leadService.getAnalytics();
      if (res?.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchLeads = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = debouncedSearch,
      targetStatus = statusFilter,
      isInitial = false
    ) => {
      try {
        if (isInitial) {
          setInitialLoading(true);
        } else {
          setTableLoading(true);
        }

        const res = await leadService.getLeads({
          page: targetPage,
          limit: targetLimit,
          search: targetSearch.trim() || undefined,
          status: targetStatus !== 'all' ? targetStatus : undefined
        });

        if (res?.success) {
          setLeads(res.data.leads || []);
          setPagination(
            res.data.pagination || {
              total: 0,
              page: targetPage,
              limit: targetLimit,
              totalPages: 1
            }
          );
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Error fetching leads', 'error');
      } finally {
        setInitialLoading(false);
        setTableLoading(false);
      }
    },
    [page, limit, debouncedSearch, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      fetchAnalytics();
      fetchLeads(1, limit, '', 'all', true);
      return;
    }

    fetchLeads(page, limit, debouncedSearch, statusFilter, false);
  }, [page, limit, debouncedSearch, statusFilter]);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleInlineStatusChange = async (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const res = await leadService.updateLeadStatus(leadId, newStatus);
      if (res?.success) {
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? res.data : l))
        );
        showToast(`Lead status updated to ${newStatus}`);
        fetchAnalytics();
      }
    } catch (err) {
      fetchLeads(page, limit, debouncedSearch, statusFilter, false);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
      throw err;
    }
  };

  const handleCreateOrUpdateLead = async (formData) => {
    try {
      if (editingLead) {
        const res = await leadService.updateLead(editingLead._id, formData);
        const updated = res.data;
        setLeads((prev) =>
          prev.map((l) => (l._id === updated._id ? updated : l))
        );
        showToast('Lead updated successfully');
      } else {
        const res = await leadService.createLead(formData);
        const created = res.data;

        setLeads((prev) => [
          created,
          ...prev.filter((l) => l._id !== created._id)
        ]);
        setPagination((prev) => ({
          ...prev,
          total: prev.total + 1,
          totalPages: Math.ceil((prev.total + 1) / limit) || 1
        }));
        showToast('New lead added to pipeline');

        setSearch('');
        setDebouncedSearch('');
        setStatusFilter('all');
        setPage(1);
        fetchLeads(1, limit, '', 'all', false);
      }

      setIsAddModalOpen(false);
      setEditingLead(null);
      fetchAnalytics();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteLeadConfirm = async () => {
    if (!deletingLead) return;
    const targetId = deletingLead._id;

    const remainingCount = leads.length - 1;
    const nextPage = remainingCount === 0 && page > 1 ? page - 1 : page;

    setLeads((prev) => prev.filter((l) => l._id !== targetId));
    setPagination((prev) => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
      totalPages: Math.ceil(Math.max(0, prev.total - 1) / limit) || 1
    }));
    setDeletingLead(null);
    if (nextPage !== page) {
      setPage(nextPage);
    }

    try {
      await leadService.deleteLead(targetId);
      showToast('Lead deleted successfully');
      fetchAnalytics();
      fetchLeads(nextPage, limit, debouncedSearch, statusFilter, false);
    } catch (err) {
      fetchLeads(page, limit, debouncedSearch, statusFilter, false);
      showToast(err.response?.data?.message || 'Failed to delete lead', 'error');
      throw err;
    }
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col transition-colors duration-200">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-card border border-borderTheme shadow-xl animate-in slide-in-from-bottom-5">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          <span className="text-xs font-medium text-content-main">{toast.message}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-content-main">
            Lead Management Overview
          </h2>
          <p className="text-xs text-content-muted mt-1">
            Track, assign, and convert incoming leads throughout your sales pipeline.
          </p>
        </div>

        <AnalyticsCards analytics={analytics} loading={analyticsLoading} />

        <div className="bg-surface-card border border-borderTheme rounded-2xl shadow-sm p-4 sm:p-6 mb-8">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onOpenAddModal={() => {
              setEditingLead(null);
              setIsAddModalOpen(true);
            }}
          />

          <LeadTable
            leads={leads}
            loading={initialLoading}
            tableLoading={tableLoading}
            onStatusChange={handleInlineStatusChange}
            onEditLead={handleOpenEdit}
            onDeleteLead={(lead) => setDeletingLead(lead)}
            onOpenAddModal={() => {
              setEditingLead(null);
              setIsAddModalOpen(true);
            }}
          />

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </main>

      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleCreateOrUpdateLead}
        initialData={editingLead}
      />

      <DeleteConfirmModal
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDeleteLeadConfirm}
        leadName={deletingLead?.name || ''}
      />
    </div>
  );
};
