import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartContext";
import { UserProvider } from "./components/UserContext";
import { ConditionalLayout } from "./components/ConditionalLayout";
import { ScrollToTop } from "./components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VN CODES - Video Templates",
  description: "Browse and buy premium video templates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");var m=t||"light";document.documentElement.classList.toggle("dark",m==="dark");})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white antialiased dark:bg-black`}
      >
        <UserProvider>
          <CartProvider>
            <ScrollToTop />
            <ConditionalLayout>{children}</ConditionalLayout>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}

