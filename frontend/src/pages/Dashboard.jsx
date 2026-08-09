import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import dashboardService from '../services/dashboardService';
import incidentService from '../services/incidentService';
import useSocketEvent from '../hooks/useSocketEvent';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

function formatDuration(ms) {
  if (ms == null) return '—';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [dashboardData, incidents] = await Promise.all([
        dashboardService.getDashboard(),
        incidentService.listIncidents(),
      ]);
      setStats(dashboardData);
      setRecentIncidents(incidents.slice(0, 5));
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useSocketEvent('dashboard:update', loadData);
  useSocketEvent('incident:new', loadData);
  useSocketEvent('incident:resolved', loadData);
  useSocketEvent('api:statusChanged', loadData);

  if (loading || !stats) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time overview of your monitored APIs</p>
        </div>
        <Link to="/apis" className="btn-primary text-sm">
          + Add API
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total APIs" value={stats.totalApis} />
        <StatCard label="Healthy" value={stats.healthyApis} tone="success" />
        <StatCard label="Failed" value={stats.failedApis} tone={stats.failedApis > 0 ? 'danger' : 'default'} />
        <StatCard
          label="Active Incidents"
          value={stats.activeIncidents}
          tone={stats.activeIncidents > 0 ? 'warning' : 'default'}
        />
        <StatCard label="Avg Latency" value={stats.averageLatency} suffix="ms" />
        <StatCard label="Avg Uptime" value={stats.averageUptime} suffix="%" tone="success" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Incidents</h2>
          <Link to="/incidents" className="text-sm text-accent-400 hover:text-accent-300">
            View all →
          </Link>
        </div>

        {recentIncidents.length === 0 ? (
          <EmptyState
            icon="✓"
            title="No incidents"
            description="All monitored APIs have been healthy. Incidents will show up here the moment something fails."
          />
        ) : (
          <div className="space-y-2">
            {recentIncidents.map((inc) => (
              <div
                key={inc._id}
                className="flex items-center justify-between px-3 py-3 rounded-lg bg-surface-900 border border-surface-700"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{inc.reason}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Started {new Date(inc.startedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-slate-500">{formatDuration(inc.duration)}</span>
                  <StatusBadge variant={inc.status === 'active' ? 'down' : 'healthy'}>
                    {inc.status}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
