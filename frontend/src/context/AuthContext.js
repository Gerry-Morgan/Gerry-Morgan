import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = localStorage.getItem('session_token');
    if (token) {
      setSessionToken(token);
      try {
        const response = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('session_token');
        setSessionToken(null);
      }
    }
    setLoading(false);
  };

  const login = async (sessionId) => {
    try {
      const response = await axios.post(
        `${API}/auth/session`,
        {},
        { headers: { 'X-Session-ID': sessionId } }
      );
      
      const { session_token, user: userData } = response.data;
      localStorage.setItem('session_token', session_token);
      setSessionToken(session_token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('session_token');
      setSessionToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    sessionToken,
    loading,
    login,
    logout,
    checkSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
