import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '\u25A6' },
  { to: '/apis', label: 'APIs', icon: '\u26A1' },
  { to: '/metrics', label: 'Metrics', icon: '\u2248' },
  { to: '/incidents', label: 'Incidents', icon: '\u26A0' },
  { to: '/settings', label: 'Settings', icon: '\u2699' },
];

function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-surface-950">
      <aside className="w-60 shrink-0 border-r border-surface-800 bg-surface-900 flex flex-col">
        <div className="px-5 py-5 border-b border-surface-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center font-bold text-white">
              P
            </div>
            <span className="font-semibold text-lg tracking-tight">PulseWatch</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-600/15 text-accent-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-surface-800'
                }`
              }
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-surface-800">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="btn-secondary w-full text-sm">
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
