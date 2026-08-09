import React from 'react';

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <div className="w-7 h-7 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
