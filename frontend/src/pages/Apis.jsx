import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';
import useSocketEvent from '../hooks/useSocketEvent';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ApiFormModal from '../components/ApiFormModal.jsx';

function circuitVariant(state) {
  if (state === 'OPEN') return 'down';
  if (state === 'HALF_OPEN') return 'degraded';
  return 'healthy';
}

function timeAgo(iso) {
  if (!iso) return 'Never checked';
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

function Apis() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApi, setEditingApi] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const loadApis = useCallback(async () => {
    try {
      const data = await apiService.listApis();
      setApis(data);
    } catch (err) {
      toast.error('Failed to load APIs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApis();
  }, [loadApis]);

  const silentRefresh = useCallback(() => {
    apiService.listApis().then(setApis).catch(() => {});
  }, []);
  useSocketEvent('api:statusChanged', silentRefresh);
  useSocketEvent('metrics:update', silentRefresh);

  function openAddModal() {
    setEditingApi(null);
    setModalOpen(true);
  }

  function openEditModal(api) {
    setEditingApi(api);
    setModalOpen(true);
  }

  async function handleToggle(api) {
    try {
      await apiService.toggleApi(api._id);
      toast.success(`Monitoring ${api.enabled ? 'disabled' : 'enabled'} for ${api.name}`);
      loadApis();
    } catch (err) {
      toast.error('Failed to toggle API');
    }
  }

  async function handleDelete(api) {
    try {
      await apiService.deleteApi(api._id);
      toast.success(`${api.name} deleted`);
      setPendingDeleteId(null);
      loadApis();
    } catch (err) {
      toast.error('Failed to delete API');
    }
  }

  if (loading) return <LoadingSpinner label="Loading APIs..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">APIs</h1>
          <p className="text-slate-400 text-sm mt-1">Manage the APIs PulseWatch monitors for you</p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-sm">
          + Add API
        </button>
      </div>

      {apis.length === 0 ? (
        <EmptyState
          icon="⚡"
          title="No APIs yet"
          description="Add your first API to start monitoring uptime, latency, and incidents in real time."
          action={
            <button onClick={openAddModal} className="btn-primary text-sm">
              + Add your first API
            </button>
          }
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">URL</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last Checked</th>
                <th className="px-5 py-3 font-medium">Monitoring</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apis.map((api) => (
                <tr key={api._id} className="border-b border-surface-800 last:border-0 hover:bg-surface-900/50">
                  <td className="px-5 py-3 font-medium">
                    <Link to={`/metrics?apiId=${api._id}`} className="hover:text-accent-400">
                      {api.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-400 max-w-xs truncate">{api.url}</td>
                  <td className="px-5 py-3 text-slate-400">{api.method}</td>
                  <td className="px-5 py-3">
                    <StatusBadge variant={circuitVariant(api.circuitBreaker.state)}>
                      {api.circuitBreaker.state === 'CLOSED' ? 'Healthy' : api.circuitBreaker.state}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{timeAgo(api.lastCheckedAt)}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggle(api)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        api.enabled ? 'bg-accent-600' : 'bg-surface-600'
                      }`}
                      aria-label={api.enabled ? 'Disable monitoring' : 'Enable monitoring'}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          api.enabled ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(api)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-slate-200"
                      >
                        Edit
                      </button>
                      {pendingDeleteId === api._id ? (
                        <>
                          <button
                            onClick={() => handleDelete(api)}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-danger/20 hover:bg-danger/30 text-danger"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setPendingDeleteId(null)}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-slate-200"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setPendingDeleteId(api._id)}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-danger"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ApiFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={loadApis}
        editingApi={editingApi}
      />
    </div>
  );
}

export default Apis;
