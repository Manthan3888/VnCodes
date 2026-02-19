"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "./UserContext";

interface RouteProtectionProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireUser?: boolean;
}

export function RouteProtection({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireUser = false,
}: RouteProtectionProps) {
  const { isAuthenticated: isUserAuthenticated, isVerifying: isUserVerifying } = useUser();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAdminAuthenticated(!!localStorage.getItem("admin"));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading || isUserVerifying) return;

    if (requireAdmin && !isAdminAuthenticated) {
      setIsRedirecting(true);
      window.location.replace("/admin/login?redirect=" + encodeURIComponent(pathname));
      return;
    }

    if (requireUser && (!isUserAuthenticated || isAdminAuthenticated)) {
      setIsRedirecting(true);
      window.location.replace("/login?redirect=" + encodeURIComponent(pathname));
      return;
    }

    if (requireAuth && !isUserAuthenticated) {
      setIsRedirecting(true);
      window.location.replace("/login?redirect=" + encodeURIComponent(pathname));
      return;
    }

    setIsChecking(false);
  }, [
    isLoading,
    isUserVerifying,
    isUserAuthenticated,
    isAdminAuthenticated,
    requireAuth,
    requireAdmin,
    requireUser,
    pathname,
  ]);

  if (isLoading || isChecking || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
