import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import incidentService from '../services/incidentService';
import useSocketEvent from '../hooks/useSocketEvent';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
];

function formatDuration(ms) {
  if (ms == null) return 'Ongoing';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadIncidents = useCallback(() => {
    incidentService
      .listIncidents(filter || undefined)
      .then(setIncidents)
      .catch(() => toast.error('Failed to load incidents'))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    loadIncidents();
  }, [loadIncidents]);

  useSocketEvent('incident:new', loadIncidents);
  useSocketEvent('incident:resolved', loadIncidents);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Incidents</h1>
          <p className="text-slate-400 text-sm mt-1">Failure history across all your monitored APIs</p>
        </div>
        <div className="flex gap-1 bg-surface-800 border border-surface-700 rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f.value ? 'bg-accent-600 text-white' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading incidents..." />
      ) : incidents.length === 0 ? (
        <EmptyState
          icon="✓"
          title={filter === 'active' ? 'No active incidents' : 'No incidents found'}
          description="Everything is running smoothly. Incidents will appear here automatically when a monitored API fails."
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Started</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc._id} className="border-b border-surface-800 last:border-0">
                  <td className="px-5 py-3 font-medium">{inc.reason}</td>
                  <td className="px-5 py-3 text-slate-400">{new Date(inc.startedAt).toLocaleString()}</td>
                  <td className="px-5 py-3 text-slate-400">{formatDuration(inc.duration)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge variant={inc.status === 'active' ? 'down' : 'healthy'}>
                      {inc.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Incidents;
