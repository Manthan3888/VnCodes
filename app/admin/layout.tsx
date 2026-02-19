"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminProvider, useAdmin } from "@/app/components/AdminContext";
import Link from "next/link";

function VerifyingAdminLogin() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Verifying Admin Login
        </p>
      </div>
    </div>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isVerifying, logout, admin } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isVerifying) return;
    // Protect all admin routes except login
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    // If on login page and already authenticated, redirect to dashboard
    if (isAuthenticated && pathname === "/admin/login") {
      router.push("/admin");
    }
  }, [isAuthenticated, isVerifying, pathname, router]);

  if (isVerifying) {
    return <VerifyingAdminLogin />;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Templates", href: "/admin/templates", icon: "🎬" },
    { label: "Categories", href: "/admin/categories", icon: "🏷️" },
    { label: "Orders", href: "/admin/orders", icon: "📦" },
    { label: "Users", href: "/admin/users", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-700">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded bg-blue-600 text-sm font-semibold tracking-tight text-white">
              VN
            </span>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              Admin
            </span>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 p-4 dark:border-zinc-700">
          <div className="mb-3 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {admin?.email}
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </div>
      </aside>
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-700 dark:bg-zinc-800/90">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
              {navItems.find((item) => item.href === pathname)?.label || "Admin Dashboard"}
            </h1>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
