"use client";

import { useState, useEffect } from "react";

/* Search bar with magnifying glass button */
function SearchTemplateBar({
  query,
  onQueryChange,
}: {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}) {
  return (
    <section className="relative w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage: `repeating-linear-gradient(-12deg, transparent, transparent 80px, currentColor 80px, currentColor 81px)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
        <span className="whitespace-nowrap text-[8vw] font-bold tracking-[0.2em] text-zinc-900 dark:text-white" style={{ transform: "rotate(-12deg)" }}>
          VN CODES VN CODES VN CODES VN CODES VN CODES
        </span>
      </div>
      <div className="relative mx-auto flex w-full max-w-3xl">
        <div className="flex w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
          <input
            type="search"
            placeholder="Search Templates..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none dark:text-zinc-100 dark:placeholder-zinc-400 sm:py-3.5"
            aria-label="Search templates"
          />
          <button
            type="button"
            className="flex shrink-0 items-center justify-center bg-blue-600 px-4 text-white transition-colors hover:bg-blue-700 sm:px-6"
            aria-label="Search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

const CATEGORIES = [
  { label: "Creator", icon: "👤" },
  { label: "Trending", icon: "⭐" },
  { label: "Wedding", icon: "💒" },
  { label: "Community/Event", icon: "🎉" },
  { label: "Import", icon: "📥" },
  { label: "Favorites", icon: "❤️" },
  { label: "Couple", icon: "💑" },
  { label: "Motivation", icon: "💪" },
  { label: "Birthday", icon: "🎂" },
  { label: "Anniversary", icon: "🎊" },
  { label: "Travel", icon: "✈️" },
];

function BrowseByCategory({
  selectedCategory,
  onCategoryChange,
}: {
  readonly selectedCategory: string | null;
  readonly onCategoryChange: (category: string | null) => void;
}) {
  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Browse by Category
      </h2>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${selectedCategory === null
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
              }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => onCategoryChange(cat.label)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${selectedCategory === cat.label
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
                }`}
            >
              <span aria-hidden>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  "Quality Support",
  "Secure Payment",
  "Free Updates",
  "24/7 Support",
  "Easy Customization",
  "Instant Delivery",
];

function FeatureBadges() {
  return (
    <section className="w-full border-y border-zinc-200 bg-zinc-50 px-4 py-8 dark:border-zinc-700 dark:bg-zinc-900/50 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 sm:gap-8">
        {FEATURES.map((text) => (
          <div
            key={text}
            className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400"
              aria-hidden
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <span className="text-sm font-medium sm:text-base">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";

interface VideoTemplate {
  id: number;
  title: string;
  originalPrice: number;
  price: number;
  category: string;
  templateType?: "free" | "paid";
}

const DEFAULT_VIDEOS: VideoTemplate[] = [
  { id: 1, title: "Doornas Devarem - Girl...", originalPrice: 200, price: 99, category: "Creator" },
  { id: 2, title: "Bora Kamdeo - Mahade...", originalPrice: 200, price: 99, category: "Trending" },
  { id: 3, title: "Tu Chaleye - Couple...", originalPrice: 200, price: 99, category: "Couple" },
  { id: 4, title: "They call this Love L...", originalPrice: 200, price: 99, category: "Couple" },
  { id: 5, title: "Wedding Highlights...", originalPrice: 249, price: 149, category: "Wedding" },
  { id: 6, title: "Birthday Wishes...", originalPrice: 199, price: 79, category: "Birthday" },
  { id: 7, title: "Travel Memories...", originalPrice: 299, price: 129, category: "Travel" },
  { id: 8, title: "Anniversary Special...", originalPrice: 220, price: 99, category: "Anniversary" },
];

function VideoCard({
  id,
  title,
  originalPrice,
  price,
  templateType,
}: {
  readonly id: number;
  readonly title: string;
  readonly originalPrice: number;
  readonly price: number;
  readonly templateType?: "free" | "paid";
}) {
  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80">
      <Link href={`/template/${id}`}>
        <div className="relative aspect-3/4 bg-zinc-200 dark:bg-zinc-700 cursor-pointer">
          {templateType === "free" && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white shadow-md">
                FREE
              </span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-lg transition group-hover:scale-110 dark:bg-white/95">
              <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/template/${id}`}>
          <h3 className="truncate text-sm font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            {title}
          </h3>
        </Link>
        <p className="mt-1 flex items-center gap-2 text-sm">
          {templateType === "free" ? (
            <span className="font-semibold text-green-600 dark:text-green-400">
              Free
            </span>
          ) : (
            <>
              <span className="text-zinc-400 line-through dark:text-zinc-500">
                ₹{originalPrice.toFixed(2)}
              </span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                ₹{price.toFixed(2)}
              </span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

import { Pagination } from "./components/Pagination";

function VideoSection({
  selectedCategory,
  searchQuery,
}: {
  readonly selectedCategory: string | null;
  readonly searchQuery: string;
}) {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState<VideoTemplate[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    // Load templates from admin_templates (same storage as admin dashboard)
    const loadTemplates = () => {
      try {
        const stored = localStorage.getItem("admin_templates");
        if (stored) {
          const adminTemplates = JSON.parse(stored);
          // Convert admin templates to video format (remove videoUrl if present)
          const videoTemplates: VideoTemplate[] = adminTemplates.map((t: any) => ({
            id: t.id,
            title: t.title,
            originalPrice: t.originalPrice,
            price: t.price,
            category: t.category,
            templateType: t.templateType || "paid",
          }));
          if (videoTemplates.length > 0) {
            setVideos(videoTemplates);
            return;
          }
        }
        // Fallback to default videos
        setVideos(DEFAULT_VIDEOS);
      } catch (e) {
        console.error("Failed to load templates", e);
        setVideos(DEFAULT_VIDEOS);
      }
    };

    loadTemplates();

    // Listen for storage changes (cross-tab) and custom events (same-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin_templates") {
        loadTemplates();
      }
    };

    const handleTemplatesUpdate = () => {
      loadTemplates();
    };

    globalThis.addEventListener("storage", handleStorageChange);
    globalThis.addEventListener("templatesUpdated", handleTemplatesUpdate);
    return () => {
      globalThis.removeEventListener("storage", handleStorageChange);
      globalThis.removeEventListener("templatesUpdated", handleTemplatesUpdate);
    };
  }, []);

  const filteredVideos = videos.filter((v) => {
    const matchesCategory = !selectedCategory || v.category === selectedCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {selectedCategory ? `${selectedCategory} Templates` : "Recently Added"}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4">
          {paginatedVideos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              originalPrice={video.originalPrice}
              price={video.price}
              templateType={video.templateType}
            />
          ))}
        </div>
        {filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">No templates found in this category.</p>
          </div>
        )}
        {filteredVideos.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredVideos.length}
          />
        )}
      </div>
    </section>
  );
}


const FAQ_ITEMS = [
  {
    question: "How do I use a video template?",
    answer:
      "After purchasing, you get instant access to download the template. Open it in your preferred video editor, replace the placeholder media and text with your own, and export. Most templates work with popular editors and come with simple instructions.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, UPI, and other secure payment options. All transactions are encrypted and secure.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Due to the digital nature of our templates, we generally don't offer refunds once the file is downloaded. If you face a technical issue (e.g. file won't open), contact our support and we'll help you resolve it or replace the file.",
  },
  {
    question: "Do templates get free updates?",
    answer:
      "Yes. When we improve or fix a template you've bought, you get access to the updated version at no extra cost. We'll notify you when updates are available.",
  },
  {
    question: "How can I get support?",
    answer:
      "We offer 24/7 support via email and our contact page. For order or technical issues, include your order ID and we'll get back to you as soon as possible.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/80"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-700/50 sm:text-base"
                  onClick={() => setOpenIndex((i) => (i === index ? null : index))}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  {item.question}
                  <span
                    className={`shrink-0 text-zinc-500 transition-transform dark:text-zinc-400 ${isOpen ? "rotate-180" : ""
                      }`}
                    aria-hidden
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <section
                  id={`faq-answer-${index}`}
                  aria-labelledby={`faq-question-${index}`}
                  className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-zinc-200 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SearchTemplateBar query={searchQuery} onQueryChange={setSearchQuery} />
      <BrowseByCategory
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <FeatureBadges />
      <VideoSection selectedCategory={selectedCategory} searchQuery={searchQuery} />
      <FAQSection />
    </div>
  );
}
