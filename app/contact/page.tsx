export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Dark banner with "Contact Us" title */}
      <section className="relative w-full overflow-hidden bg-zinc-900 px-4 py-16 sm:px-6 lg:px-8 dark:bg-zinc-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          aria-hidden
        />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
          <span
            className="whitespace-nowrap text-[6vw] font-bold tracking-[0.2em] text-white"
            style={{ transform: "rotate(-12deg)" }}
          >
            VN CODES VN CODES VN CODES VN CODES
          </span>
        </div>
        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>
        </div>
      </section>

      {/* White content box */}
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 sm:p-8">
            <div className="space-y-8 text-left text-zinc-800 dark:text-zinc-200">
              {/* Customer Support */}
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white sm:text-lg">
                  Customer Support:
                </h2>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 sm:text-base">
                  For product related problems or support, please DM us on{" "}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-red-600 hover:underline dark:text-red-400"
                  >
                    Instagram
                  </a>
                  .
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 sm:text-sm">
                  (Our team usually replies within 3 hours)
                </p>
              </div>

              {/* Admin Information */}
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white sm:text-lg">
                  Admin Information:
                </h2>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 sm:text-base">
                  Dhruv Thakkar, Asha Thakkar & Atul Thakkar
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <a
                      href="mailto:atulthakkar092@gmail.com"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      atulthakkar092@gmail.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:ashathakkar092@gmail.com"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      ashathakkar092@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
