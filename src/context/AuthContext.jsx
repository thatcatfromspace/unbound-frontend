import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('x-api-key'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Maybe true initially if validating?

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('x-api-key', apiKey);
      // Optional: Validate key or fetch user role here if endpoints exist
      // fetchUser(); 
    } else {
      localStorage.removeItem('x-api-key');
      setUser(null);
    }
  }, [apiKey]);

  const login = (key) => {
    setApiKey(key);
    // Ideally we would fetch user details here to determine role
    // For now, we trust the key and let the backend enforce permissions
  };

  const logout = () => {
    setApiKey(null);
    setUser(null);
  };

  const value = {
    apiKey,
    user,
    isAuthenticated: !!apiKey,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
