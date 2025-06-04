import React, { createContext, useState, useContext, useEffect } from 'react';
import { setAuthToken as setApiAuthToken, loginUser as apiLoginUser } from '../api/userApi'; // Adjusted path
import axios from 'axios';
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      const storedUserString = localStorage.getItem('authUser');
      if (storedUserString) {
        try {
          const userObject = JSON.parse(storedUserString);
          setUser(userObject); // Set user state to the parsed object
        } catch (e) {
          console.error("Failed to parse authUser from localStorage:", e);
          // Optionally, clear corrupted storage and log out
          localStorage.removeItem('authUser');
          localStorage.removeItem('authToken');
          setUser(null);
          setToken(null);
          // setApiAuthToken(null); // Call if appropriate
        }
      }
      setToken(storedToken);
      setApiAuthToken(storedToken); // Ensure this is the correct function from userApi
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:8080/api/usuario/login', {
        username,
        password,
      });
  
      const { jwt, username: nombreUsuario, message, status } = res.data;
  
      if (!status) throw new Error(message || 'Login incorrecto');
  
      const user = { username: nombreUsuario }; // Agregá más si lo necesitás
  
      localStorage.setItem('authToken', jwt);
      localStorage.setItem('authUser', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  
      setUser(user);
      setToken(jwt);
  
      return { user, jwt }; // Devuelto al componente
    } catch (error) {
      console.error('AuthContext login error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setApiAuthToken(null);
    setUser(null);
    setToken(null);
    // Consider adding a redirect to login page here:
    // window.location.href = '/login'; // Or use react-router's navigate
  };

  const value = {
    user,
    token,
    login, // This is the context's login function
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
    
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
