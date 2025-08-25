import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/auth";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup axios interceptors
    authService.setupAxiosInterceptors();

    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const resetPassword = async (email) => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (data) => {
    try {
      return await authService.verifyOTP(data);
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      return await authService.changePassword(oldPassword, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post(
        "https://k9txelite.pythonanywhere.com/api/auth/google/",
        {
          access_token: response.access_token,
        }
      );

      if (res.data.token) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        return true;
      }
    } catch (error) {
      console.error("Google login error:", error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    verifyOTP,
    changePassword,
    handleGoogleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
