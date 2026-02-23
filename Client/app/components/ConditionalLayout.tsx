"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useUser } from "./UserContext";

function VerifyingUserLogin() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Verifying User Login
        </p>
      </div>
    </div>
  );
}

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isVerifying } = useUser();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes don't get Header/Footer
    return <>{children}</>;
  }

  if (isVerifying) {
    return <VerifyingUserLogin />;
  }

  // Regular website routes get Header and Footer
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col bg-white dark:bg-black">
        {children}
        <Footer />
      </div>
    </>
  );
}
