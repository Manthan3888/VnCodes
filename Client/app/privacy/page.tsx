export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 sm:p-8 md:p-10">
            <div className="space-y-6 text-left text-sm text-zinc-800 dark:text-zinc-200 sm:text-base">
              <p className="text-zinc-500 dark:text-zinc-500">
                Last updated on Mar 30th 2024
              </p>
              <p>
                This privacy policy sets out how vncodes uses and protects any information that you give
                vncodes when you visit their website and/or agree to purchase from them.
              </p>
              <p>
                vncodes is committed to ensuring that your privacy is protected. Should we ask you to
                provide certain information by which you can be identified when using this website, and
                then you can be assured that it will only be used in accordance with this privacy
                statement.
              </p>
              <p>
                vncodes may change this policy from time to time by updating this page. You should check
                this page from time to time to ensure that you adhere to these changes.
              </p>
              <p className="font-semibold text-zinc-900 dark:text-white">
                We may collect the following information:
              </p>
              <ul className="list-inside list-disc space-y-1 pl-2">
                <li>Name</li>
                <li>Contact information including email address</li>
                <li>Demographic information such as postcode, preferences and interests, if required</li>
                <li>Other information relevant to customer surveys and/or offers</li>
              </ul>
              <p className="font-semibold text-zinc-900 dark:text-white">
                What we do with the information we gather
              </p>
              <p>
                We require this information to understand your needs and provide you with a better
                service, and in particular for the following reasons:
              </p>
              <ul className="list-inside list-disc space-y-1 pl-2">
                <li>Internal record keeping.</li>
                <li>We may use the information to improve our products and services.</li>
                <li>
                  We may periodically send promotional emails about new products, special offers or other
                  information which we think you may find interesting using the email address which you
                  have provided.
                </li>
                <li>
                  From time to time, we may also use your information to contact you for market research
                  purposes. We may contact you by email, phone, fax or mail. We may use the information to
                  customise the website according to your interests.
                </li>
              </ul>
              <p>
                We are committed to ensuring that your information is secure. In order to prevent
                unauthorised access or disclosure we have put in suitable measures.
              </p>
              <p className="font-semibold text-zinc-900 dark:text-white">
                How we use cookies
              </p>
              <p>
                A cookie is a small file which asks permission to be placed on your computer&apos;s hard
                drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets
                you know when you visit a particular site. Cookies allow web applications to respond to
                you as an individual. The web application can tailor its operations to your needs, likes
                and dislikes by gathering and remembering information about your preferences.
              </p>
              <p>
                We use traffic log cookies to identify which pages are being used. This helps us analyze
                data about webpage traffic and improve our website in order to tailor it to customer
                needs. We only use this information for statistical analysis purposes and then the data is
                removed from the system.
              </p>
              <p>
                Overall, cookies help us provide you with a better website, by enabling us to monitor
                which pages you find useful and which you do not. A cookie in no way gives us access to
                your computer or any information about you, other than the data you choose to share with
                us.
              </p>
              <p>
                You can choose to accept or decline cookies. Most web browsers automatically accept
                cookies, but you can usually modify your browser setting to decline cookies if you
                prefer. This may prevent you from taking full advantage of the website.
              </p>
              <p className="font-semibold text-zinc-900 dark:text-white">
                Controlling your personal information
              </p>
              <p>
                You may choose to restrict the collection or use of your personal information in the
                following ways:
              </p>
              <ul className="list-inside list-disc space-y-1 pl-2">
                <li>
                  whenever you are asked to fill in a form on the website, look for the box that you can
                  click to indicate that you do not want the information to be used by anybody for
                  direct marketing purposes
                </li>
                <li>
                  if you have previously agreed to us using your personal information for direct
                  marketing purposes, you may change your mind at any time by writing to or emailing us
                </li>
              </ul>
              <p>
                We will not sell, distribute or lease your personal information to third parties unless
                we have your permission or are required by law to do so. We may use your personal
                information to send you promotional information about third parties which we think you may
                find interesting if you tell us that you wish this to happen.
              </p>
              <p>
                If you have any questions, comments, or complaints about this Privacy Policy please
                contact us at{" "}
                <a
                  href="mailto:hi@vncodes.in"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  hi@vncodes.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
