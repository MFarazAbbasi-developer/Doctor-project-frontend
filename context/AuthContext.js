"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // logged-in user
  const [role, setRole] = useState(null); // Role of user
  // const [loading, setLoading] = useState(true); // true until /me completes
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1️⃣ Try normal user
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        setRole(data.role);
        setIsAuthenticated(true);
      } catch (err) {
        // 2️⃣ If normal user fails → try admin
        try {
          const { data } = await api.get("/auth/admin/me");
          setUser(data.user);
          setRole(data.role);
          setIsAuthenticated(true);
          console.log("role: ", data.role);
        } catch (err2) {
          // 3️⃣ If both fail → unauthenticated
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsAuthLoaded(true);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthLoaded,
        isAuthenticated,
        setIsAuthenticated,
        role,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
