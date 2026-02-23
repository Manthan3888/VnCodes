"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/app/components/Pagination";
import * as ordersApi from "@/lib/api/orders";

interface Order {
  id: string;
  customerEmail: string;
  items: Array<{
    id?: string | number;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  date: string;
  status: "pending" | "completed" | "cancelled";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    ordersApi
      .getOrdersAdmin()
      .then((res) => setOrders(res.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    ordersApi
      .updateOrderStatus(orderId, newStatus)
      .then((res) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: (res as { order: Order }).order.status } : o))
        );
      })
      .catch(() => alert("Failed to update status."));
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Orders Management</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            View and manage customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800/80">
          <p className="text-zinc-500 dark:text-zinc-400">No orders found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
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
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{order.customerEmail}</p>
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
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Date: {new Date(order.date).toLocaleDateString()}
                    </p>
                    <div className="mt-2 space-y-1">
                      {order.items.map((item) => (
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
                    ₹{order.total.toFixed(2)}
                  </p>
                  <div className="mt-2 flex flex-col gap-2">
                    {order.status !== "completed" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "completed")}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                    )}
                    {order.status !== "cancelled" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    )}
                    {order.status === "cancelled" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "pending")}
                        className="rounded-lg bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-700"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
          {filteredOrders.length > itemsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredOrders.length}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
