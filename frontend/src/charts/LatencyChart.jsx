import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function LatencyChart({ metrics }) {
  const data = [...metrics]
    .reverse()
    .map((m) => ({ time: formatTime(m.timestamp), latency: m.latency, success: m.success }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2738" />
        <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit="ms" />
        <Tooltip
          contentStyle={{ background: '#161c2c', border: '1px solid #1f2738', borderRadius: 8 }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Line
          type="monotone"
          dataKey="latency"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LatencyChart;
