"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/app/components/Pagination";

interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const getDummyUsers = (): User[] => {
    return [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        joinedDate: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        joinedDate: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        joinedDate: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
      },
      {
        id: "4",
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        joinedDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      },
      {
        id: "5",
        name: "David Brown",
        email: "david.brown@example.com",
        joinedDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "6",
        name: "Emily Davis",
        email: "emily.davis@example.com",
        joinedDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      },
      {
        id: "7",
        name: "Robert Miller",
        email: "robert.miller@example.com",
        joinedDate: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      },
      {
        id: "8",
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        joinedDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
      },
    ];
  };

  const loadUsers = () => {
    try {
      const usersStr = localStorage.getItem("users");
      if (usersStr) {
        const parsedUsers = JSON.parse(usersStr);
        if (parsedUsers.length > 0) {
          setUsers(parsedUsers);
        } else {
          const dummyUsers = getDummyUsers();
          setUsers(dummyUsers);
          localStorage.setItem("users", JSON.stringify(dummyUsers));
        }
      } else {
        const dummyUsers = getDummyUsers();
        setUsers(dummyUsers);
        localStorage.setItem("users", JSON.stringify(dummyUsers));
      }
    } catch (e) {
      console.error("Failed to load users", e);
      setUsers(getDummyUsers());
    }
    setIsLoading(false);
  };

  const deleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updated = users.filter((user) => user.id !== userId);
      setUsers(updated);
      localStorage.setItem("users", JSON.stringify(updated));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Users Management</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage registered users
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800/80">
          <p className="text-zinc-500 dark:text-zinc-400">
            {searchQuery ? "No users found matching your search" : "No users found"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/80">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        aria-label={`Delete user ${user.name}`}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z M14 11v6 M10 11v6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length > itemsPerPage && (
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/80">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Statistics</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{users.length}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Active Users</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{users.length}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">New This Month</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
              {
                users.filter(
                  (user) =>
                    new Date(user.joinedDate).getMonth() === new Date().getMonth() &&
                    new Date(user.joinedDate).getFullYear() === new Date().getFullYear()
                ).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
