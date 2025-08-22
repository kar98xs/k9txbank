import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    authService.setupAxiosInterceptors();
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    login: async (email, password) => {
      try {
        const data = await authService.login(email, password);
        setUser(data.user);
        navigate("/"); // Redirect to home after login
        return data;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    logout: () => {
      authService.logout();
      setUser(null);
      navigate("/login"); // Redirect to login after logout
    },
    forgotPassword: async (email) => {
      try {
        await authService.resetPassword(email);
        navigate("/verify-otp"); // Redirect to OTP verification
      } catch (error) {
        console.error("Forgot password error:", error);
        throw error;
      }
    },
    register: async (userData) => {
      try {
        const data = await authService.register(userData);
        navigate("/login"); // Redirect to login after registration
        return data;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
