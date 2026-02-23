"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdmin } from "@/app/components/AdminContext";
import * as statsApi from "@/lib/api/stats";

interface DashboardStats {
  totalTemplates: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: Array<{
    id: string;
    customerEmail: string;
    total: number;
    date: string;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const { admin } = useAdmin();
  const [stats, setStats] = useState<DashboardStats>({
    totalTemplates: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    statsApi
      .getAdminStats()
      .then((res) => {
        setStats({
          totalTemplates: res.totalTemplates ?? 0,
          totalOrders: res.totalOrders ?? 0,
          totalRevenue: res.totalRevenue ?? 0,
          totalUsers: res.totalUsers ?? 0,
          recentOrders: res.recentOrders ?? [],
        });
      })
      .catch(() => {
        setStats({
          totalTemplates: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalUsers: 0,
          recentOrders: [],
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = [
    {
      title: "Total Templates",
      value: stats.totalTemplates,
      icon: "🎬",
      color: "blue",
      href: "/admin/templates",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "📦",
      color: "green",
      href: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: "💰",
      color: "yellow",
      href: "/admin/orders",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "purple",
      href: "/admin/users",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Dashboard Overview{admin?.name ? ` — Welcome, ${admin.name}` : ""}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Here's an overview of your system.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{card.value}</p>
              </div>
              <div className="text-4xl">{card.icon}</div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
              View details
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all
            </Link>
          </div>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-700"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {order.customerEmail}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      ₹{order.total.toFixed(2)}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No orders yet</p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <Link
              href="/admin/templates"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700/50"
            >
              <span className="text-xl">➕</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Add New Template</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700/50"
            >
              <span className="text-xl">📊</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">View All Orders</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700/50"
            >
              <span className="text-xl">👥</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
