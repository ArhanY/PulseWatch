import React from 'react';

function EmptyState({ icon = '\u25A6', title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-14">
      <div className="text-4xl mb-3 opacity-50">{icon}</div>
      <h3 className="font-medium text-slate-200 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
