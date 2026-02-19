"use client";

import { RouteProtection } from "../components/RouteProtection";
import { useUser } from "../components/UserContext";
import { useState, useEffect } from "react";
import { Pagination } from "../components/Pagination";

function OrdersPageContent() {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Load orders from localStorage
    try {
      const ordersStr = localStorage.getItem("orders");
      if (ordersStr) {
        const allOrders = JSON.parse(ordersStr);
        // Filter orders for current user
        const userOrders = allOrders.filter(
          (order: any) => order.customerEmail === user?.email
        );
        setOrders(userOrders);
      }
    } catch (e) {
      console.error("Failed to load orders", e);
    }
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading orders...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Order History</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        View your past orders and purchases.
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800/80">
          <p className="text-zinc-500 dark:text-zinc-400">No orders found</p>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {orders
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/80"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="space-y-1">
                      {order.items?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400"
                        >
                          <span>{item.title}</span>
                          <span>₹{(item.price * (item.quantity ?? 1)).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    ₹{order.total?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>
          {orders.length > itemsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(orders.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={orders.length}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function OrdersPage() {
  return (
    <RouteProtection requireUser={true}>
      <OrdersPageContent />
    </RouteProtection>
  );
}
