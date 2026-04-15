"use client";

/**
 * StudioLanding — gooey folder view
 *
 * Opened when the user clicks "Custom" or "AI" on the home toggle.
 * Tabs correspond to the two creation modes; the active tab is set
 * by the `?tab=` query param from the URL.
 *
 * Close button (×) navigates back to /.
 */

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { GooeyFilter } from "@/components/ui/gooey-filter";
import { useScreenSize } from "@/hooks/use-screen-size";

// ─── Tab data ──────────────────────────────────────────────────────────────────

const TABS = [
  {
    id:    "custom",
    label: "Custom",
    files: [
      { name: "brand-identity-v2.pdf",    meta: "Brand strategy" },
      { name: "pitch-deck-final.pptx",    meta: "Investor deck"  },
      { name: "campaign-brief.doc",       meta: "Q2 campaign"    },
      { name: "style-guide.pdf",          meta: "Visual system"  },
    ],
  },
  {
    id:    "ai",
    label: "AI",
    files: [
      { name: "generated-concepts.md",    meta: "AI ideation"    },
      { name: "smart-copy-drafts.md",     meta: "AI copywriting" },
      { name: "auto-layouts.fig",         meta: "AI layout"      },
      { name: "variation-set.json",       meta: "AI variants"    },
    ],
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StudioLanding() {
  const searchParams  = useSearchParams();
  const paramTab      = searchParams.get("tab") as TabId | null;
  const initialTab    = paramTab === "ai" ? 1 : 0; // default to Custom

  const [activeIndex, setActiveIndex] = useState(initialTab);
  const screenSize = useScreenSize();

  const activeTab = TABS[activeIndex];

  return (
    <AuroraBackground
      showRadialGradient
      className="h-[100dvh] w-screen overflow-hidden !bg-[var(--background)] text-[var(--foreground)]"
    >
      {/* Paper grid */}
      <div aria-hidden className="bg-paper-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Bloom orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] top-[-10%] h-[clamp(12rem,26vw,28rem)] w-[clamp(12rem,26vw,28rem)] rounded-full bg-[var(--spot-b)] opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-12%] right-[-6%] h-[clamp(10rem,20vw,22rem)] w-[clamp(10rem,20vw,22rem)] rounded-full bg-[var(--spot-a)] opacity-40 blur-3xl"
      />

      {/* Gooey SVG filter definition */}
      <GooeyFilter
        id="studio-goo"
        strength={screenSize.lessThan("md") ? 8 : 14}
      />

      {/* ── Layout ── */}
      <div className="relative flex h-full flex-col">

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0   }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center px-5 pt-5 sm:px-8 sm:pt-6"
        >
          {/* Close → back to home */}
          <Link
            href="/"
            aria-label="Close and return to home"
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/90"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="h-4 w-4 text-black/60 transition-colors group-hover:text-black/90"
            >
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </Link>
        </motion.div>

        {/* Centre content */}
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-12 sm:gap-10">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
            className="font-ui text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]"
          >
            Studio
          </motion.p>

          {/* Gooey folder — the filter is applied to the background layer only */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
            className="w-full max-w-[520px]"
          >
            {/* Background layer — receives the gooey filter */}
            <div style={{ filter: "url(#studio-goo)" }}>
              {/* Tab pill row */}
              <div className="flex w-full">
                {TABS.map((tab, index) => (
                  <div key={tab.id} className="relative h-10 flex-1 sm:h-12">
                    {activeIndex === index && (
                      <motion.div
                        layoutId="folder-tab-bg"
                        className="absolute inset-0 bg-[var(--surface-soft)]"
                        transition={{ type: "spring", bounce: 0, duration: 0.38 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Content panel */}
              <div className="h-[220px] w-full overflow-hidden bg-[var(--surface-soft)] sm:h-[260px]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 40,  filter: "blur(8px)"  }}
                    animate={{ opacity: 1, y: 0,   filter: "blur(0px)"  }}
                    exit={{    opacity: 0, y: -40,  filter: "blur(8px)"  }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="px-6 pt-5 pb-4 sm:px-8 sm:pt-7"
                  >
                    <ul className="space-y-0">
                      {activeTab.files.map((file) => (
                        <li
                          key={file.name}
                          className="flex items-center justify-between border-b border-[var(--line)] py-2.5"
                        >
                          <span className="font-ui text-[13px] text-[var(--foreground)] sm:text-[14px]">
                            {file.name}
                          </span>
                          <span className="font-ui text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                            {file.meta}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Tab label row — sits above the filter layer so text stays sharp */}
            <div className="relative -mt-[calc(220px+2.5rem)] flex w-full sm:-mt-[calc(260px+3rem)]">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="flex h-10 flex-1 items-center justify-center sm:h-12"
                >
                  <span
                    className={`font-ui text-[12px] uppercase tracking-[0.2em] transition-colors duration-200 sm:text-[13px] ${
                      activeIndex === index
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </AuroraBackground>
  );
}
