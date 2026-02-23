"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = { label: string; href: string };

function IconCart(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M6.5 7.5H21l-1.6 7.4a2 2 0 0 1-2 1.6H9.1a2 2 0 0 1-2-1.5L5.2 4.5H2.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 20.3a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8ZM17.2 20.3a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconUser(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M12 12.2a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4.7 20.2a7.3 7.3 0 0 1 14.6 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMenu(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClose(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

import { useCart } from "./CartContext";
import { useUser } from "./UserContext";

export function Header() {
  const { cart, totalItems, totalPrice, removeFromCart } = useCart();
  const { user, isAuthenticated, logout } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);


  const navItems: NavItem[] = useMemo(
    () => [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Order History", href: "/orders" },
      { label: "Learn Video Editing", href: "/learn" },
    ],
    [],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setShowUserMenu(false);
        setShowCartDropdown(false);
      }
    }

    function onClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
      // Only close cart if click is outside and target is still in DOM (avoids closing when remove-item button is unmounted)
      if (!target.closest(".cart-dropdown-container") && document.contains(target)) {
        setShowCartDropdown(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-white/10 dark:bg-black/50 dark:supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-zinc-900 hover:text-zinc-700 dark:text-white dark:hover:text-white/90"
        >
          <span className="grid h-8 w-8 place-items-center rounded bg-zinc-200 text-sm font-semibold tracking-tight text-zinc-800 dark:bg-white/10 dark:text-white">
            VN
          </span>
          <span className="truncate text-sm font-semibold tracking-wide">
            VN <span className="text-zinc-600 dark:text-white/70">codes.in</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden items-center gap-4 lg:flex lg:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-white/80 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="cart-dropdown-container relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCartDropdown(!showCartDropdown);
                }}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Cart"
                aria-expanded={showCartDropdown}
              >
                <IconCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {showCartDropdown && totalItems > 0 && (
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="max-h-96 overflow-y-auto p-4">
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                      Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </h3>
                    <div className="space-y-3 border-b border-zinc-200 pb-3 dark:border-zinc-700">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 rounded-lg border border-zinc-100 p-2 dark:border-zinc-700"
                        >
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex h-full w-full items-center justify-center">
                              <svg className="h-6 w-6 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                              {item.title}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                            className="flex-shrink-0 rounded p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            aria-label={`Remove ${item.title} from cart`}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z M14 11v6 M10 11v6" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Subtotal:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          ₹{totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <Link
                        href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
                        onClick={() => setShowCartDropdown(false)}
                        className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Checkout
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setShowCartDropdown(false)}
                        className="block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty Cart Message */}
              {showCartDropdown && totalItems === 0 && (
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="p-6 text-center">
                    <div className="mb-2 flex justify-center">
                      <IconCart className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Your cart is empty</p>
                    <Link
                      href="/"
                      onClick={() => setShowCartDropdown(false)}
                      className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Browse Templates
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="user-menu-container relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex h-10 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100 dark:border-white/25 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10"
                >
                  <IconUser className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{user?.name || user?.email}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {user?.email}
                      </div>
                      <Link
                        href="/orders"
                        className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden h-10 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100 sm:inline-flex dark:border-white/25 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10"
              >
                <IconUser className="h-4 w-4" />
                Login
              </Link>
            )}

            <ThemeToggle />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <IconClose className="h-5 w-5" />
              ) : (
                <IconMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-zinc-200 bg-white px-3 py-3 dark:border-white/10 dark:bg-black/70 lg:hidden">
          <div className="mx-auto flex w-full flex-col gap-2">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto pr-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <div className="mt-1 rounded-md border-t border-zinc-200 pt-2 dark:border-zinc-700">
                    <div className="px-2 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {user?.email}
                    </div>
                    <Link
                      href="/orders"
                      className="block rounded-md px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full rounded-md px-2 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="mt-1 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  <IconUser className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

