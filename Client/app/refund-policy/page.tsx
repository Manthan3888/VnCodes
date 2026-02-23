export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen">
      {/* Dark banner */}
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
            Refund Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 sm:p-8 md:p-10">
            <div className="space-y-8 text-left text-sm text-zinc-800 dark:text-zinc-200 sm:text-base">
              <p>
                Thank you for choosing VN Codes. We are dedicated to providing high-quality digital
                video templates. Please review our return and refund policy carefully.
              </p>

              <div>
                <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  1. No Cancellations and Refunds
                </h2>
                <p>
                  All sales of digital video templates are final. Once a purchase is completed and
                  the digital product is delivered, cancellations and refunds will not be provided
                  under any circumstances. We encourage customers to thoroughly review the product
                  details and available previews before making a purchase.
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  2. Exceptions
                </h2>
                <p>
                  In the unlikely event that there is a technical issue with the digital template
                  file, please contact our support team within 7 days of purchase. We will assess the
                  issue and, if necessary, provide a replacement template at our discretion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
