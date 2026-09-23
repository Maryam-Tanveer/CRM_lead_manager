import React from 'react';

const statusStyles = {
  new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  contacted: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  converted: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
};

const dotStyles = {
  new: 'bg-blue-500',
  contacted: 'bg-amber-500',
  converted: 'bg-emerald-500'
};

export const StatusBadge = ({ status, className = '' }) => {
  const normalized = (status || 'new').toLowerCase();
  const style = statusStyles[normalized] || statusStyles.new;
  const dot = dotStyles[normalized] || dotStyles.new;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {normalized}
    </span>
  );
};
