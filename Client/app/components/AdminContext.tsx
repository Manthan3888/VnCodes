"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/api/auth";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin";

export interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AdminContextType {
  admin: Admin | null;
  isVerifying: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
    if (!token) {
      localStorage.removeItem(ADMIN_USER_KEY);
      setIsVerifying(false);
      return;
    }
    authApi
      .adminMe()
      .then((res) => {
        if (res.admin) {
          setAdmin(res.admin);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.admin));
        }
      })
      .catch(() => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        setAdmin(null);
      })
      .finally(() => setIsVerifying(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authApi.adminLogin(email, password);
      const token = res.token;
      const adminData = res.admin;
      if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
      setAdmin(adminData);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    router.push("/admin/login");
  }, [router]);

  const value = React.useMemo(
    () => ({
      admin,
      isVerifying,
      login,
      logout,
      isAuthenticated: !!admin,
    }),
    [admin, isVerifying, login, logout]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
