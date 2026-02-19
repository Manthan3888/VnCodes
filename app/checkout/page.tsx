"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../components/CartContext";
import { useUser } from "../components/UserContext";
import { RouteProtection } from "../components/RouteProtection";

function CheckoutPageContent() {
  const { cart, removeFromCart, totalPrice } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"INR" | "USD">("INR");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Pre-fill form with user data if available
    if (user) {
      setFormData({
        email: user.email || "",
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        phoneNumber: "",
      });
    }
  }, [user]);

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart.length, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const order = {
        id: Date.now().toString(),
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phoneNumber,
        items: cart,
        total: totalPrice,
        paymentMethod,
        discountCode: discountCode || null,
        date: new Date().toISOString(),
        status: "pending",
      };

      // Save order to localStorage
      const existingOrders = localStorage.getItem("orders");
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect to orders page
      router.push("/orders");
    } catch (e) {
      alert("Failed to process order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return null; // Will redirect via useEffect
  }

  const displayTotal = paymentMethod === "USD" ? totalPrice * 0.012 : totalPrice; // Approximate conversion
  const currencySymbol = paymentMethod === "USD" ? "$" : "₹";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Link
          href="/cart"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Item Summary Section */}
        <section>
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/80">
            <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-zinc-900 dark:text-white">
                <div className="col-span-5">Item Name</div>
                <div className="col-span-3 text-right">Item Price</div>
                <div className="col-span-4 text-right">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {cart.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-4">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                      <div className="flex h-full w-full items-center justify-center">
                        <svg className="h-6 w-6 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.title}</p>
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2 text-sm">
                    <span className="text-zinc-400 line-through dark:text-zinc-500">
                      {currencySymbol}
                      {(item.originalPrice * (paymentMethod === "USD" ? 0.012 : 1)).toFixed(2)}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {currencySymbol}
                      {(item.price * item.quantity * (paymentMethod === "USD" ? 0.012 : 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z M14 11v6 M10 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50">
              <div className="flex justify-end">
                <div className="text-right">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    TOTAL: {currencySymbol}
                    {displayTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discount Code Section */}
        <section>
          {!showDiscountCode ? (
            <button
              type="button"
              onClick={() => setShowDiscountCode(true)}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Have a discount code?{" "}
              <span className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Click to enter it
              </span>
            </button>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/80">
              <label htmlFor="discount-code" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Discount Code
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  id="discount-code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter discount code"
                  className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscountCode(false);
                    setDiscountCode("");
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Payment Method Section */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">Select Payment Method</h2>
          <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/80">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="payment-method"
                value="INR"
                checked={paymentMethod === "INR"}
                onChange={(e) => setPaymentMethod(e.target.value as "INR" | "USD")}
                className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
              />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                Indian Customer (INR)
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="payment-method"
                value="USD"
                checked={paymentMethod === "USD"}
                onChange={(e) => setPaymentMethod(e.target.value as "INR" | "USD")}
                className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
              />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                Non-Indian Customer (USD)
              </span>
            </label>
          </div>
        </section>

        {/* Personal Info Section */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">Personal Info</h2>
          <div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/80">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email address <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                We will send the purchase receipt to this address.
              </p>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`mt-2 block w-full rounded-lg border px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white sm:text-sm ${
                  errors.email
                    ? "border-red-300 dark:border-red-700"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
                placeholder="Email address"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                First name <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                We will use this to personalize your account experience.
              </p>
              <input
                type="text"
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`mt-2 block w-full rounded-lg border px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white sm:text-sm ${
                  errors.firstName
                    ? "border-red-300 dark:border-red-700"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Last name
              </label>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                We will use this as well to personalize your account experience.
              </p>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
                placeholder="Last name"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Enter your phone number.</p>
              <input
                type="tel"
                id="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`mt-2 block w-full rounded-lg border px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white sm:text-sm ${
                  errors.phoneNumber
                    ? "border-red-300 dark:border-red-700"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
                placeholder="Phone Number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
              )}
            </div>
          </div>
        </section>

        {/* Purchase Total and Submit */}
        <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/80">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">Purchase Total:</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              {currencySymbol}
              {displayTotal.toFixed(2)}
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {isSubmitting ? "Processing..." : "PROCEED TO PAY"}
          </button>
        </section>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <RouteProtection requireUser={true}>
      <CheckoutPageContent />
    </RouteProtection>
  );
}
