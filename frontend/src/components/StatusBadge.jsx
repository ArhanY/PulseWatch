import React from 'react';

const VARIANTS = {
  healthy: 'bg-success/10 text-success border border-success/30',
  down: 'bg-danger/10 text-danger border border-danger/30',
  degraded: 'bg-warning/10 text-warning border border-warning/30',
  neutral: 'bg-surface-700 text-slate-300 border border-surface-600',
};

function StatusBadge({ variant = 'neutral', children }) {
  return <span className={`badge ${VARIANTS[variant] || VARIANTS.neutral}`}>{children}</span>;
}

export default StatusBadge;
