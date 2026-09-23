import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  page,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange
}) => {
  const safeTotalPages = Math.max(1, totalPages);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pageNumbers = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-surface-card border-t border-borderTheme rounded-b-2xl">
      <div className="flex items-center gap-4 text-xs text-content-muted">
        <span>
          Showing <span className="font-semibold text-content-main">{start}</span> to{' '}
          <span className="font-semibold text-content-main">{end}</span> of{' '}
          <span className="font-semibold text-content-main">{total}</span> leads
        </span>

        <div className="flex items-center gap-2">
          <label htmlFor="limit-select" className="text-content-subtle">
            Rows:
          </label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg bg-surface-base border border-borderTheme text-content-main text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-1.5 rounded-lg border border-borderTheme bg-surface-base hover:bg-surface-hover text-content-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-7 h-7 text-xs font-semibold rounded-lg transition-all ${
                num === page
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                  : 'border border-borderTheme bg-surface-base hover:bg-surface-hover text-content-main'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-1.5 rounded-lg border border-borderTheme bg-surface-base hover:bg-surface-hover text-content-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
