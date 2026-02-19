"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const ADMIN_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@vncodes.in",
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123",
};

interface Admin {
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
    // Check if admin is logged in from localStorage
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        console.error("Failed to parse admin from localStorage", e);
      }
    }
    setIsVerifying(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Mock authentication - In production, use API call
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: Admin = {
        id: "1",
        email: email,
        name: "Admin User",
      };
      setAdmin(adminUser);
      localStorage.setItem("admin", JSON.stringify(adminUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem("admin");
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
