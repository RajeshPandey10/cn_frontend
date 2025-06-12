import React, { createContext, useState, useContext, useEffect } from "react";
import ApiEndpoints from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ status: false, userData: undefined });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiEndpoints.getProfile.request();
        if (response.data && response.data.success && response.data.user) {
          setAuth({ status: true, userData: response.data.user });
        } else {
          setAuth({ status: false, userData: undefined });
        }
      } catch {
        setAuth({ status: false, userData: undefined });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await ApiEndpoints.login.request({ email, password });
      if (response.data.success && response.data.user) {
        setAuth({ status: true, userData: response.data.user });
        return { success: true };
      } else {
        setAuth({ status: false, userData: undefined });
        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      }
    } catch (error) {
      setAuth({ status: false, userData: undefined });
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await ApiEndpoints.logout.request();
    } catch (error) {
      // Ignore error
    } finally {
      setAuth({ status: false, userData: undefined });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
