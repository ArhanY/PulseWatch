import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { getSocket, disconnectSocket } from '../services/socket';
import { TOKEN_STORAGE_KEY } from '../services/api';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getProfile()
      .then((profile) => {
        setUser(profile);
        connectSocketForUser();
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function connectSocketForUser() {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
  }

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser, token } = await authService.login(credentials);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setUser(loggedInUser);
    connectSocketForUser();
    return loggedInUser;
  }, []);

  const register = useCallback(async (details) => {
    const { user: newUser, token } = await authService.register(details);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setUser(newUser);
    connectSocketForUser();
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    disconnectSocket();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export { AuthProvider, useAuth };
