import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';
import metricService from '../services/metricService';
import useSocketEvent from '../hooks/useSocketEvent';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import LatencyChart from '../charts/LatencyChart.jsx';
import AvailabilityChart from '../charts/AvailabilityChart.jsx';

function Metrics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedApiId = searchParams.get('apiId') || '';

  const [apis, setApis] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loadingApis, setLoadingApis] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    apiService
      .listApis()
      .then((data) => {
        setApis(data);
        if (!selectedApiId && data.length > 0) {
          setSearchParams({ apiId: data[0]._id });
        }
      })
      .catch(() => toast.error('Failed to load APIs'))
      .finally(() => setLoadingApis(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMetrics = useCallback(() => {
    if (!selectedApiId) return;
    setLoadingMetrics(true);
    metricService
      .getMetricsForApi(selectedApiId, { limit: 50 })
      .then(setMetrics)
      .catch(() => toast.error('Failed to load metrics'))
      .finally(() => setLoadingMetrics(false));
  }, [selectedApiId]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  useSocketEvent('metrics:update', (payload) => {
    if (payload.apiId === selectedApiId) loadMetrics();
  });

  const selectedApi = apis.find((a) => a._id === selectedApiId);

  if (loadingApis) return <LoadingSpinner label="Loading APIs..." />;

  if (apis.length === 0) {
    return (
      <EmptyState
        icon="~"
        title="No APIs to show metrics for"
        description="Add an API on the APIs page first — metrics will appear here once monitoring begins."
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Metrics</h1>
          <p className="text-slate-400 text-sm mt-1">Response time and availability history</p>
        </div>
        <select
          value={selectedApiId}
          onChange={(e) => setSearchParams({ apiId: e.target.value })}
          className="input-field w-64"
        >
          {apis.map((api) => (
            <option key={api._id} value={api._id}>
              {api.name}
            </option>
          ))}
        </select>
      </div>

      {loadingMetrics ? (
        <LoadingSpinner label="Loading metrics..." />
      ) : metrics.length === 0 ? (
        <EmptyState
          icon="~"
          title="No metrics yet"
          description={`${selectedApi?.name || 'This API'} hasn't been checked yet. Metrics appear here after the first monitoring cycle.`}
        />
      ) : (
        <>
          <div className="card mb-4">
            <h2 className="font-semibold mb-2">Response Time</h2>
            <LatencyChart metrics={metrics} />
          </div>

          <div className="card mb-6">
            <h2 className="font-semibold mb-2">Success / Failure</h2>
            <AvailabilityChart metrics={metrics} />
          </div>

          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700 text-left text-slate-400">
                  <th className="px-5 py-3 font-medium">Timestamp</th>
                  <th className="px-5 py-3 font-medium">Status Code</th>
                  <th className="px-5 py-3 font-medium">Latency</th>
                  <th className="px-5 py-3 font-medium">Response Size</th>
                  <th className="px-5 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m._id} className="border-b border-surface-800 last:border-0">
                    <td className="px-5 py-3 text-slate-400">{new Date(m.timestamp).toLocaleString()}</td>
                    <td className="px-5 py-3">{m.statusCode ?? '—'}</td>
                    <td className="px-5 py-3">{m.latency} ms</td>
                    <td className="px-5 py-3 text-slate-400">{m.responseSize} B</td>
                    <td className="px-5 py-3">
                      <StatusBadge variant={m.success ? 'healthy' : 'down'}>
                        {m.success ? 'Success' : m.errorMessage || 'Failed'}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Metrics;
