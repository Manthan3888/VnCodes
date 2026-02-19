"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/components/CartContext";
import { AddToCartPopup } from "@/app/components/AddToCartPopup";

interface Template {
  id: number;
  title: string;
  fullTitle: string;
  originalPrice: number;
  price: number;
  category: string;
  date: string;
  description?: string;
  videoUrl?: string;
  videoData?: string; // Base64 encoded video data
  videoFileName?: string; // Original filename
}

// Default template data with extended details
const DEFAULT_TEMPLATES_DATA: Template[] = [
  {
    id: 1,
    title: "Doornas Devarem - Girl...",
    fullTitle: "Doornas Devarem - Girl Video Template",
    originalPrice: 200,
    price: 99,
    category: "Creator",
    date: "2026-02-15",
    description: "A beautiful video template featuring elegant transitions and modern design.",
  },
  {
    id: 2,
    title: "Bora Kamdeo - Mahade...",
    fullTitle: "Bora Kamdeo - Mahade Video Template",
    originalPrice: 200,
    price: 99,
    category: "Trending",
    date: "2026-02-14",
    description: "Trending video template with dynamic effects and smooth animations.",
  },
  {
    id: 3,
    title: "Tu Chaleye - Couple...",
    fullTitle: "Tu Chaleye - Couple Video Template",
    originalPrice: 200,
    price: 99,
    category: "Couple",
    date: "2026-02-13",
    description: "Perfect template for couple videos with romantic themes.",
  },
  {
    id: 4,
    title: "They call this Love L...",
    fullTitle: "They call this Love - Video Template",
    originalPrice: 200,
    price: 99,
    category: "Couple",
    date: "2026-02-12",
    description: "Love-themed template with heartwarming transitions.",
  },
  {
    id: 5,
    title: "Wedding Highlights...",
    fullTitle: "Wedding Highlights Video Template",
    originalPrice: 249,
    price: 149,
    category: "Wedding",
    date: "2026-02-11",
    description: "Professional wedding video template with elegant design.",
  },
  {
    id: 6,
    title: "Birthday Wishes...",
    fullTitle: "Birthday Wishes Video Template",
    originalPrice: 199,
    price: 79,
    category: "Birthday",
    date: "2026-02-10",
    description: "Fun and festive birthday video template.",
  },
  {
    id: 7,
    title: "Travel Memories...",
    fullTitle: "Travel Memories Video Template",
    originalPrice: 299,
    price: 129,
    category: "Travel",
    date: "2026-02-09",
    description: "Capture your travel adventures with this stunning template.",
  },
  {
    id: 8,
    title: "Anniversary Special...",
    fullTitle: "Anniversary Special Video Template",
    originalPrice: 220,
    price: 99,
    category: "Anniversary",
    date: "2026-02-08",
    description: "Celebrate special anniversaries with this elegant template.",
  },
];

// Helper function to load templates from localStorage or use defaults
const loadTemplates = (): Template[] => {
  try {
    const stored = localStorage.getItem("admin_templates");
    if (stored) {
      const adminTemplates = JSON.parse(stored);
      // Convert admin templates to full template format
      return adminTemplates.map((t: any) => ({
        id: t.id,
        title: t.title,
        fullTitle: t.title, // Use title as fullTitle if not provided
        originalPrice: t.originalPrice,
        price: t.price,
        category: t.category,
        date: new Date().toISOString().split("T")[0], // Use current date if not provided
        description: t.description || "A professional video template.",
        videoUrl: t.videoUrl,
        videoData: t.videoData,
        videoFileName: t.videoFileName,
      }));
    }
  } catch (e) {
    console.error("Failed to load templates from localStorage", e);
  }
  return DEFAULT_TEMPLATES_DATA;
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [template, setTemplate] = useState<Template | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [templatesData, setTemplatesData] = useState<Template[]>([]);

  useEffect(() => {
    // Load templates from localStorage
    const loadedTemplates = loadTemplates();
    setTemplatesData(loadedTemplates);

    // Listen for storage changes (cross-tab) and custom events (same-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin_templates") {
        const updatedTemplates = loadTemplates();
        setTemplatesData(updatedTemplates);
      }
    };

    const handleTemplatesUpdate = () => {
      const updatedTemplates = loadTemplates();
      setTemplatesData(updatedTemplates);
    };

    globalThis.addEventListener("storage", handleStorageChange);
    globalThis.addEventListener("templatesUpdated", handleTemplatesUpdate);
    return () => {
      globalThis.removeEventListener("storage", handleStorageChange);
      globalThis.removeEventListener("templatesUpdated", handleTemplatesUpdate);
    };
  }, []);

  useEffect(() => {
    if (templatesData.length === 0) return;

    const templateId = Number.parseInt(params.id as string);
    const foundTemplate = templatesData.find((t) => t.id === templateId);

    if (foundTemplate) {
      setTemplate(foundTemplate);
    } else {
      router.push("/");
    }
  }, [params.id, router, templatesData]);

  const handleAddToCart = () => {
    if (template) {
      addToCart({
        id: template.id,
        title: template.fullTitle,
        price: template.price,
        originalPrice: template.originalPrice,
      });
      setShowPopup(true);
    }
  };

  if (!template) {
    return (
      <main className="mx-auto w-full max-w-6xl bg-white px-4 py-10 dark:bg-black sm:px-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading template...</p>
          </div>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(template.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get similar templates from the same category (excluding current template)
  const similarTemplates = templatesData.filter(
    (t) => t.category === template.category && t.id !== template.id
  );

  return (
    <main className="mx-auto w-full max-w-7xl bg-white px-4 py-8 dark:bg-black sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to Templates
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Video Preview Section */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <div className="aspect-3/4 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-700">
            {template.videoData || template.videoUrl ? (
              <video
                src={template.videoData || template.videoUrl}
                controls
                className="h-full w-full object-cover"
                preload="metadata"
                aria-label={`Video preview for ${template.fullTitle}`}
              >
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg dark:bg-white/95">
                      <svg className="ml-1 h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Video Preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Details Section */}
        <div>
          <div>
            <h1 className="text-2xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-3xl">
              {template.fullTitle}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>in</span>
              <Link
                href={`/?category=${template.category}`}
                className="font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                {template.category}
              </Link>
              <span>on</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          <section className="mt-6 space-y-3">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Purchase this template only at
                {" "}
                <span className="font-semibold text-zinc-900 dark:text-white">VN Codes</span>
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-lg text-zinc-400 line-through dark:text-zinc-500">
                  ₹{template.originalPrice.toFixed(2)}
                </span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                  ₹{template.price.toFixed(2)}
                </span>
              </div>
            </div>

            {template.description && (
              <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {template.description}
              </p>
            )}

            {template.videoFileName && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Video file:
                {" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  {template.videoFileName}
                </span>
              </p>
            )}
          </section>

          <button
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-lg bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Add To Cart
          </button>

          {/* Features */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Unlimited Usage</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">100% Guarantee</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Lifetime Support</span>
            </div>
          </div>

          {/* Guarantee Statement */}
          <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold">100% Guarantee means:</span> The output of your video will look exactly like the preview. If there's even a slight difference, just DM us on Instagram and get any other template absolutely free.
            </p>
          </div>
        </div>
      </div>

      {/* Similar Templates Section */}
      {similarTemplates.length > 0 && (
        <section className="mt-16 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
          <h2 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-white">
            Similar Templates
          </h2>
          <p className="mb-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            More templates in the
            {" "}
            <span className="font-semibold text-zinc-900 dark:text-white">{template.category}</span>
            {" "}
            category
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
            {similarTemplates.map((item) => (
              <Link
                key={item.id}
                href={`/template/${item.id}`}
                className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80"
              >
                <div className="relative aspect-3/4 bg-zinc-200 dark:bg-zinc-700">
                  {item.videoData || item.videoUrl ? (
                    <video
                      src={item.videoData || item.videoUrl}
                      className="h-full w-full object-cover"
                      preload="metadata"
                      muted
                      aria-label={`Video preview for ${item.fullTitle}`}
                    >
                      <track kind="captions" />
                    </video>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-lg transition group-hover:scale-110 dark:bg-white/95">
                        <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-white">
                    {item.fullTitle || item.title}
                  </h4>
                  <p className="mt-1 flex items-center gap-2 text-sm">
                    <span className="text-zinc-400 line-through dark:text-zinc-500">
                      ₹{item.originalPrice.toFixed(2)}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AddToCartPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        templateTitle={template.fullTitle}
      />
    </main>
  );
}
