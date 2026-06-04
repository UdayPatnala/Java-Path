import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [progress, setProgress] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Basic decoding just to keep username in state, or rely on login payload
      if (!user) {
         // This is a naive check; ideally we'd have a /api/auth/me endpoint
         setUser({ username: "Developer" }); 
      }
      fetchProgress();
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
    setToken(res.data.token);
    setUser({ username: res.data.username });
    setProgress(res.data.progress);
    setChatHistory(res.data.chatHistory);
  };

  const register = async (username, password) => {
    await axios.post(`${API_BASE_URL}/api/auth/register`, { username, password });
    await login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProgress([]);
    setChatHistory([]);
  };

  const fetchProgress = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/progress`);
      setProgress(res.data.progress);
    } catch (err) {
      console.error(err);
      logout(); // Logout on invalid token
    }
  };

  const updateProgress = async (completedDays) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/progress`, { completedDays });
      setProgress(res.data.progress);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, progress, chatHistory, setChatHistory, login, register, logout, updateProgress, API_BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
};
