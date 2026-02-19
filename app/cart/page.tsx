"use client";

import Link from "next/link";
import { useCart } from "../components/CartContext";
import { useUser } from "../components/UserContext";

export default function CartPage() {
  const { cart, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const { isAuthenticated } = useUser();

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center bg-white px-4 py-20 dark:bg-black sm:px-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-16 w-16 text-zinc-300 dark:text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"> Your cart is empty</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Looks like you haven't added any templates to your cart yet.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl bg-white px-4 py-10 dark:bg-black sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Shopping Cart</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        You have {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart.
      </p>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
        <div className="lg:col-span-8">
          <ul role="list" className="divide-y divide-zinc-200 border-b border-t border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {cart.map((item) => (
              <li key={item.id} className="flex py-6 sm:py-10">
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 sm:h-32 sm:w-28">
                  {/* Aspect ratio placeholder */}
                  <div className="flex h-full w-full items-center justify-center">
                    <svg className="h-8 w-8 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            {item.title}
                          </span>
                        </h3>
                      </div>
                      <p className="mt-1 flex items-center gap-2 text-sm">
                        <span className="text-zinc-400 line-through">₹{item.originalPrice.toFixed(2)}</span>
                        <span className="font-medium text-zinc-900 dark:text-white">₹{item.price.toFixed(2)}</span>
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-500 dark:text-red-400 dark:hover:bg-red-900/20"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z M14 11v6 M10 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => clearCart()}
            className="mt-4 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            Clear shopping cart
          </button>
        </div>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-6 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8"
        >
          <h2 id="summary-heading" className="text-lg font-medium text-zinc-900 dark:text-white">
            Order summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">Subtotal</dt>
              <dd className="text-sm font-medium text-zinc-900 dark:text-white">₹{totalPrice.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <dt className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                <span>Shipping estimate</span>
              </dt>
              <dd className="text-sm font-medium text-green-600 dark:text-green-400">Free</dd>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <dt className="text-base font-medium text-zinc-900 dark:text-white">Order total</dt>
              <dd className="text-base font-medium text-zinc-900 dark:text-white">₹{totalPrice.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            {isAuthenticated ? (
              <Link
                href="/checkout"
                className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors lg:text-sm"
              >
                Checkout
              </Link>
            ) : (
              <Link
                href="/login?redirect=/checkout"
                className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors lg:text-sm"
              >
                Login to Checkout
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}


