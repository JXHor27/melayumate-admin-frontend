import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from "../api/apiConfig";
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const storedToken = sessionStorage.getItem('lecturer_token');
    if (storedToken) {
      try {
        // Try to decode the token. This will fail for "123".
        const decodedUser = jwtDecode(storedToken);

        const isExpired = decodedUser.exp * 1000 < Date.now();

         if (!isExpired) {
          // Token is valid, set the auth state
          console.log("Valid token found, logging in..");
          setToken(storedToken);
          setUserId(decodedUser.userId);
          setUsername(decodedUser.sub)
          setIsAuthenticated(true);
        } else {
          // Token is expired, remove it
          console.log("Token expired, logging out.");
          sessionStorage.removeItem('lecturer_token');
        }
      } catch (error) {
        // Token is malformed, remove it
        console.error("Invalid token found in storage.", error);
        sessionStorage.removeItem('lecturer_token');
      }
    }
     // IMPORTANT: We are finished checking, so we set loading to false.
    setIsLoading(false);
  }, []); 

  useEffect(() => {
    // This effect ensures state is updated if the token changes in localStorage
    // (e.g., another tab logs in/out)
    const handleStorageChange = () => {
      const storedToken = sessionStorage.getItem('lecturer_token');
      console.log(storedToken)
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  async function login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if(!response.ok){
        const error = await response.json();
        const message = `An error occurred: ${response.status} ${error.message}`;
        console.error(message);        
        return;
      }
      const data = await response.json();
      const { token } = data;
      setToken(token);
      const decodedToken = jwtDecode(token);
      console.log("token: ", decodedToken);
      const { userId, sub } = decodedToken;
      setUserId(userId);
      setUsername(sub);
      setIsAuthenticated(true);
      sessionStorage.setItem('lecturer_token', token);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  async function register(username, email, password) {
    try{
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username : username,
          email : email,
          password : password
        }),
      });
      return response;
    }
    catch (error){
        console.error("Failed to register user:", error);
    }
  }

  function logout() {
    sessionStorage.removeItem('lecturer_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, register, logout, isLoading, userId, username}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};