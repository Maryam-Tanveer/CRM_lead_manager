import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const statuses = [
  { value: 'new', label: 'New', dot: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', dot: 'bg-amber-500' },
  { value: 'converted', label: 'Converted', dot: 'bg-emerald-500' }
];

export const StatusDropdown = ({ currentStatus, onStatusChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selected = statuses.find((s) => s.value === currentStatus) || statuses[0];

  const handleSelect = async (newStatus) => {
    if (newStatus === currentStatus || disabled) {
      setIsOpen(false);
      return;
    }

    try {
      setLoading(true);
      await onStatusChange(newStatus);
      setIsOpen(false);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-borderTheme bg-surface-card hover:bg-surface-hover text-content-main transition-colors disabled:opacity-50"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${selected.dot}`} />
        <span>{selected.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-content-muted" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1 w-36 rounded-xl border border-borderTheme bg-surface-card shadow-xl z-30 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {statuses.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item.value)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-surface-hover transition-colors text-content-main"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                  <span>{item.label}</span>
                </div>
                {item.value === currentStatus && (
                  <Check className="w-3.5 h-3.5 text-primary-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
