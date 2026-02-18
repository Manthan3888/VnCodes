import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Dark banner with "About Us" title */}
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
            About Us
          </h1>
        </div>
      </section>

      {/* White content panel */}
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 sm:p-8 md:p-10">
            <div className="space-y-5 text-left text-zinc-800 dark:text-zinc-200 sm:text-base">
              <p>
                Welcome to <strong>VN Codes</strong> — your ultimate destination for VN mobile editor
                templates. We believe in empowering creators and enhancing storytelling through
                meticulously crafted templates that bring your vision to life.
              </p>
              <p>
                At VN Codes, we understand that visual storytelling is at the heart of every great
                video. Whether you&apos;re a beginner or a seasoned editor, our diverse collection
                of high-quality, easy-to-use templates is designed to help you create stunning
                content without the hassle.
              </p>
              <p>
                We are committed to quality and innovation. Our team continuously works to expand
                our template library with fresh, trending designs. We also provide a user-friendly
                platform with seamless download experiences and exceptional customer support to
                ensure your creative journey is smooth and enjoyable.
              </p>
              <p>
                Join the VN Codes community today and transform your videos with premium templates.
                We&apos;re here to help you make your mark in the world of digital content creation.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white sm:text-2xl">
              Want to know more about us?
            </h2>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
