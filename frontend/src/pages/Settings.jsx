import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getSocket } from '../services/socket';

function Settings() {
  const { user, logout } = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    setSocketConnected(socket.connected);

    function handleConnect() {
      setSocketConnected(true);
    }
    function handleDisconnect() {
      setSocketConnected(false);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="card mb-4">
        <h2 className="font-semibold mb-4">Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-surface-700">
            <span className="text-slate-400">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-surface-700">
            <span className="text-slate-400">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Member since</span>
            <span className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="font-semibold mb-4">Realtime Connection</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Live updates for metrics, incidents, and status changes stream over Socket.IO.
          </p>
          <span
            className={`badge shrink-0 ml-4 ${
              socketConnected
                ? 'bg-success/10 text-success border border-success/30'
                : 'bg-danger/10 text-danger border border-danger/30'
            }`}
          >
            {socketConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="card border-danger/30">
        <h2 className="font-semibold mb-2 text-danger">Session</h2>
        <p className="text-sm text-slate-400 mb-4">Sign out of PulseWatch on this device.</p>
        <button onClick={logout} className="btn-danger text-sm">
          Log out
        </button>
      </div>
    </div>
  );
}

export default Settings;
