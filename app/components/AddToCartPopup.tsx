"use client";

import { useRouter } from "next/navigation";

interface AddToCartPopupProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly templateTitle: string;
}

export function AddToCartPopup({ isOpen, onClose, templateTitle }: AddToCartPopupProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSkipAndCheckout = () => {
    onClose();
    router.push("/cart");
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close popup"
      />
      <div
        className="relative w-full max-w-md rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 id="popup-title" className="text-lg font-semibold text-zinc-900 dark:text-white">
                Added to Cart!
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{templateTitle}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSkipAndCheckout}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Skip & Checkout
            </button>
            <button
              onClick={handleContinueShopping}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
