"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "users";
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

interface User {
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!savedUser) {
      // Keep proxy auth cookie in sync when there is no logged-in user.
      clearAuthCookie();
      setIsVerifying(false);
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
      setAuthCookie();
    } catch (e) {
      // Corrupted storage should not leave stale auth artifacts around.
      localStorage.removeItem(CURRENT_USER_KEY);
      clearAuthCookie();
      console.error("Failed to parse user from localStorage", e);
    }

    setIsVerifying(false);
  }, []);

  const getUsers = useCallback(() => {
    if (typeof window === "undefined") return [];
    const usersStr = localStorage.getItem(STORAGE_KEY);
    if (!usersStr) return [];
    try {
      return JSON.parse(usersStr);
    } catch {
      return [];
    }
  }, []);

  const checkUserExists = useCallback(
    (email: string) => {
      const users = getUsers();
      return users.some((u: User) => u.email.toLowerCase() === email.toLowerCase());
    },
    [getUsers]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const users = getUsers();
      const foundUser = users.find(
        (u: User & { password: string }) =>
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          joinedDate: foundUser.joinedDate,
        };
        setUser(userData);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        setAuthCookie();
        return { success: true };
      }

      return { success: false, error: "Invalid email or password" };
    },
    [getUsers]
  );

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      const users = getUsers();

      if (checkUserExists(email)) {
        return { success: false, error: "User with this email already exists" };
      }

      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        name,
        email,
        password,
        joinedDate: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));

      // Do not auto-login after signup; user must login explicitly.

      return { success: true };
    },
    [getUsers, checkUserExists]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    clearAuthCookie();
    router.push("/");
  }, [router]);

  const value = React.useMemo(
    () => ({
      user,
      isVerifying,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }),
    [user, isVerifying, login, signup, logout]
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
