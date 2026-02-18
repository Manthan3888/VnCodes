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

export function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);


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
      if (e.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Cart"
            >
              <IconCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                {totalItems}
              </span>
            </Link>

            <Link
              href="/login"
              className="hidden h-10 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100 sm:inline-flex dark:border-white/25 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10"
            >
              <IconUser className="h-4 w-4" />
              Login
            </Link>

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
              <Link
                href="/login"
                className="mt-1 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                <IconUser className="h-4 w-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

