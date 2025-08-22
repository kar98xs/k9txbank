import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    authService.setupAxiosInterceptors();
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    login: async (email, password) => {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    },
    logout: () => {
      authService.logout();
      setUser(null);
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
