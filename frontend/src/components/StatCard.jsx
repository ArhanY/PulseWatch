import React from 'react';

function StatCard({ label, value, tone = 'default', suffix = '' }) {
  const toneClasses = {
    default: 'text-slate-100',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
  };

  return (
    <div className="card">
      <p className="text-sm text-slate-400 mb-2">{label}</p>
      <p className={`text-3xl font-semibold ${toneClasses[tone] || toneClasses.default}`}>
        {value}
        {suffix && <span className="text-lg text-slate-500 ml-1">{suffix}</span>}
      </p>
    </div>
  );
}

export default StatCard;
