"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
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
      { name: "brand-identity-v2.pdf",  meta: "Brand strategy"  },
      { name: "pitch-deck-final.pptx",  meta: "Investor deck"   },
      { name: "campaign-brief.doc",     meta: "Q2 campaign"     },
      { name: "style-guide.pdf",        meta: "Visual system"   },
    ],
  },
  {
    id:    "ai",
    label: "AI",
    files: [
      { name: "generated-concepts.md",  meta: "AI ideation"     },
      { name: "smart-copy-drafts.md",   meta: "AI copywriting"  },
      { name: "auto-layouts.fig",       meta: "AI layout"       },
      { name: "variation-set.json",     meta: "AI variants"     },
    ],
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StudioLanding() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const paramTab     = searchParams.get("tab") as TabId | null;

  const [activeIndex, setActiveIndex] = useState(paramTab === "ai" ? 1 : 0);
  const screenSize = useScreenSize();

  const activeTab = TABS[activeIndex];

  return (
    <AuroraBackground
      showRadialGradient
      className="h-[100dvh] w-screen overflow-hidden !bg-[var(--background)] text-[var(--foreground)]"
    >
      {/* Paper grid */}
      <div aria-hidden className="bg-paper-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Bloom — top left */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] top-[-10%] h-[clamp(12rem,26vw,28rem)] w-[clamp(12rem,26vw,28rem)] rounded-full bg-[var(--spot-b)] opacity-40 blur-3xl"
      />
      {/* Bloom — bottom right */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-12%] right-[-6%] h-[clamp(10rem,20vw,22rem)] w-[clamp(10rem,20vw,22rem)] rounded-full bg-[var(--spot-a)] opacity-40 blur-3xl"
      />

      <GooeyFilter id="studio-goo" strength={screenSize.lessThan("md") ? 8 : 14} />

      {/*
        Shell:
          pt = navbar height + 24px gap
            mobile  95px + 24 = 119px → pt-[120px]
            sm     105px + 24 = 129px → pt-[130px]
            md+    120px + 24 = 144px → pt-[144px]
          px = safe side margins: 20px / 24px / 60px
      */}
      <div className="relative flex h-full flex-col pt-[120px] sm:pt-[130px] md:pt-[144px] px-5 sm:px-6 md:px-[60px]">

        {/* Close button — z-50, useRouter for reliable navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0   }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 50 }}
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Close and return to home"
            style={{ position: "relative", zIndex: 50, pointerEvents: "auto" }}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/90"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              className="h-[14px] w-[14px] text-black/55 transition-colors group-hover:text-black/85"
            >
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3"  y2="13" />
            </svg>
          </button>
        </motion.div>

        {/*
          Primary content area.
          items-center + pb-[10%] pulls the folder slightly above dead-center.
          The folder is the only element here — no headings, no labels.
        */}
        <div className="flex flex-1 items-center justify-center pb-[10%]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.44, delay: 0.1, ease: "easeOut" }}
            /* width: min(900px, 90vw) */
            className="w-[90vw] max-w-[900px] relative"
          >

            {/*
              Gooey folder
              ─────────────────────────────────────────────
              Filter div is in normal flow → sets the outer height.
              Tab labels sit position:absolute top-0 over it (no filter
              on them so text stays perfectly sharp).
            */}

            {/* Filter layer */}
            <div style={{ filter: "url(#studio-goo)" }}>

              {/* Tab background row */}
              <div className="flex w-full">
                {TABS.map((tab, index) => (
                  <div key={tab.id} className="relative h-12 flex-1 sm:h-14 md:h-16">
                    {activeIndex === index && (
                      <motion.div
                        layoutId="folder-tab-bg"
                        className="absolute inset-0 bg-[var(--surface-soft)]"
                        transition={{ type: "spring", bounce: 0, duration: 0.36 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Content panel */}
              <div className="w-full overflow-hidden bg-[var(--surface-soft)] h-[260px] sm:h-[300px] md:h-[360px]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 40, filter: "blur(8px)"  }}
                    animate={{ opacity: 1, y: 0,  filter: "blur(0px)"  }}
                    exit={{    opacity: 0, y: -40, filter: "blur(8px)"  }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="px-8 pt-8 pb-6 sm:px-10 sm:pt-9 md:px-14 md:pt-11"
                  >
                    <ul>
                      {activeTab.files.map((file) => (
                        <li
                          key={file.name}
                          className="flex items-center justify-between border-b border-[var(--line)] py-3.5 sm:py-4 md:py-5"
                        >
                          <span className="font-ui text-[14px] text-[var(--foreground)] sm:text-[16px] md:text-[18px]">
                            {file.name}
                          </span>
                          <span className="font-ui text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] sm:text-[11px] md:text-[12px]">
                            {file.meta}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Tab labels — absolute, above filter, text always sharp */}
            <div className="absolute left-0 right-0 top-0 z-10 flex h-12 sm:h-14 md:h-16">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="flex flex-1 cursor-pointer items-center justify-center"
                >
                  <span
                    className={`font-ui text-[12px] uppercase tracking-[0.22em] transition-colors duration-200 sm:text-[13px] md:text-[14px] ${
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
