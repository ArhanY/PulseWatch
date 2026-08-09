import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AvailabilityChart({ metrics }) {
  const data = [...metrics]
    .reverse()
    .map((m) => ({ time: formatTime(m.timestamp), value: m.success ? 1 : 0, success: m.success }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2738" />
        <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
        <YAxis hide domain={[0, 1]} />
        <Tooltip
          contentStyle={{ background: '#161c2c', border: '1px solid #1f2738', borderRadius: 8 }}
          labelStyle={{ color: '#f1f5f9' }}
          formatter={(_, __, props) => [props.payload.success ? 'Success' : 'Failure', 'Result']}
        />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.success ? '#22c55e' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AvailabilityChart;
