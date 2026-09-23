import React from 'react';
import { Search, Plus, X, Filter } from 'lucide-react';

const statusTabs = [
  { value: 'all', label: 'All Leads' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' }
];

export const FilterBar = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenAddModal
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, phone or assignee..."
            className="w-full pl-10 pr-9 py-2 text-sm rounded-xl bg-surface-card border border-borderTheme text-content-main placeholder:text-content-subtle focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-main"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-card border border-borderTheme overflow-x-auto">
          {statusTabs.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onStatusFilterChange(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/25'
                    : 'text-content-muted hover:text-content-main hover:bg-surface-hover'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-md shadow-primary-500/25 transition-all hover:shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>
    </div>
  );
};
