import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/services/api' // This assumes api.js exports default object as you're doing
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/protected`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        console.log('User fetched from cookie:', response.data.user);
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

// ✅ Watch for user state updates
useEffect(() => {
  console.log("✅ User state now is:", user);
}, [user]);


  // Login handler
const login = async (credentials) => {
  try {
    console.log('Attempting login with credentials:', credentials); // Log credentials (be careful with sensitive data in production)
    const res = await api.login(credentials);
    const { success, message, user } = res.data;

    console.log('Login API response received:', res.data); // Log the full response data

    if (success) {
      setUser(user);
      console.log('Login successful! User set:', user); // Log successful login and user data
      return { success: true, message };
    } else {
      console.log('Login failed as per API response. Message:', message || 'No specific message.'); // Log failed login message
      return { success: false, message: message || 'Login failed' };
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error('Error during login attempt:', error); // Log the full error object
    console.error('Login error message:', msg || 'No specific error message.'); // Log the extracted error message
    return { success: false, message: msg || 'Something went wrong' };
  }
};

  // Register handler
  const register = async (data) => {
    try {
      const res = await api.register(data)
      const { user } = res.data
      setUser(user)
      return { success: true, message: 'Account created' }
    } catch (error) {
      const msg = error.response?.data?.message || error.message
      return { success: false, message: msg || 'Something went wrong' }
    }
  }

  // Logout handler
  const logout = async () => {
    try {
      await api.logout() // <-- Make sure this exists in api.js
    } catch (err) {
      console.warn('Logout API failed:', err.message)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
