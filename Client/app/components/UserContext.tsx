"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/api/auth";

const AUTH_TOKEN_KEY = "auth_token";
const CURRENT_USER_KEY = "current_user";
const USER_AUTH_COOKIE = "user_auth";
const COOKIE_MAX_AGE_DAYS = 7;

function setAuthCookie() {
  if (typeof document === "undefined") return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${USER_AUTH_COOKIE}=1; path=/; max-age=${maxAge}; samesite=lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${USER_AUTH_COOKIE}=; path=/; max-age=0`;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

interface UserContextType {
  user: User | null;
  isVerifying: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  getToken: () => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (!token) {
      localStorage.removeItem(CURRENT_USER_KEY);
      clearAuthCookie();
      setIsVerifying(false);
      return;
    }
    authApi
      .me()
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
          setAuthCookie();
        }
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        clearAuthCookie();
        setUser(null);
      })
      .finally(() => setIsVerifying(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await authApi.login(email, password);
        const userData = res.user;
        const token = res.token;
        if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
        setUser(userData);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        setAuthCookie();
        return { success: true };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Invalid email or password";
        return { success: false, error: message };
      }
    },
    []
  );

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await authApi.register(name, email, password);
        return { success: true };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Signup failed";
        return { success: false, error: message };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    clearAuthCookie();
    router.push("/");
  }, [router]);

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isVerifying,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      getToken,
    }),
    [user, isVerifying, login, signup, logout, getToken]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
