"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { GooeyFilter } from "@/components/ui/gooey-filter";
import { useScreenSize } from "@/hooks/use-screen-size";

// ─── Icons ─────────────────────────────────────────────────────────────────────
// currentColor so they adapt to light/dark automatically

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 17 12 10 16 10 8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconSlides() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="2" y="6" width="14" height="11" rx="1.5" />
      <path d="M6 6V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2" />
      <line x1="5" y1="11" x2="12" y2="11" />
      <line x1="5" y1="14" x2="9"  y2="14" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M2 9h20" />
      <path d="M12 3l4 6-4 13-4-13 4-6z" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="18" cy="5"  r="3" />
      <circle cx="6"  cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" />
    </svg>
  );
}

// ─── AI icons ──────────────────────────────────────────────────────────────────

function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z" />
      <path d="M19 1l.5 1.5L21 3l-1.5.5L19 5l-.5-1.5L17 3l1.5-.5L19 1z" />
    </svg>
  );
}

function IconCpu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <line x1="9" y1="7"  x2="9"  y2="4"  /><line x1="12" y1="7"  x2="12" y2="4"  /><line x1="15" y1="7"  x2="15" y2="4"  />
      <line x1="9" y1="20" x2="9"  y2="17" /><line x1="12" y1="20" x2="12" y2="17" /><line x1="15" y1="20" x2="15" y2="17" />
      <line x1="7"  y1="9"  x2="4"  y2="9"  /><line x1="7"  y1="12" x2="4"  y2="12" /><line x1="7"  y1="15" x2="4"  y2="15" />
      <line x1="20" y1="9"  x2="17" y2="9"  /><line x1="20" y1="12" x2="17" y2="12" /><line x1="20" y1="15" x2="17" y2="15" />
    </svg>
  );
}

function IconWand() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <line x1="3" y1="21" x2="14" y2="10" />
      <path d="M14 10l2-2 4-1-1 4-2 2-3-3z" />
      <line x1="6" y1="4" x2="6" y2="6" />
      <line x1="18" y1="14" x2="18" y2="16" />
      <line x1="5" y1="11" x2="3" y2="13" />
      <line x1="19" y1="5" x2="17" y2="7" />
      <line x1="4" y1="4" x2="6" y2="4" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}


// ─── Tab data ──────────────────────────────────────────────────────────────────

const TABS = [
  {
    id:    "custom",
    label: "Custom",
    logos: [
      { id: "globe",   icon: <IconGlobe />   },
      { id: "play",    icon: <IconPlay />    },
      { id: "slides",  icon: <IconSlides />  },
      { id: "diamond", icon: <IconDiamond /> },
      { id: "share",   icon: <IconShare />   },
    ],
  },
  {
    id:    "ai",
    label: "AI",
    logos: [
      { id: "sparkles", icon: <IconSparkles /> },
      { id: "cpu",      icon: <IconCpu />      },
      { id: "wand",     icon: <IconWand />     },
      { id: "eye",      icon: <IconEye />      },
      { id: "layers",   icon: <IconLayers />   },
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

      {/* Shell — pt offsets for fixed navbar + 24px breathing gap */}
      <div className="relative flex h-full flex-col pt-[120px] sm:pt-[130px] md:pt-[144px] px-5 sm:px-6 md:px-[60px]">

        {/* Close button */}
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

        {/* Primary content — folder is the sole focus */}
        <div className="flex flex-1 items-center justify-center pb-[10%]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.44, delay: 0.1, ease: "easeOut" }}
            className="relative w-[92vw] max-w-[1160px]"
          >
            {/* Filter layer — in normal flow, sets height */}
            <div style={{ filter: "url(#studio-goo)" }}>

              {/* Tab background slots */}
              <div className="flex w-full">
                {TABS.map((tab, index) => (
                  <div key={tab.id} className="relative h-12 flex-1 sm:h-14 md:h-16">
                    {activeIndex === index && (
                      <motion.div
                        layoutId="folder-tab-bg"
                        className="absolute inset-0 bg-[var(--folder-bg)]"
                        transition={{ type: "spring", bounce: 0, duration: 0.36 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Logo canvas */}
              <div className="w-full overflow-hidden bg-[var(--folder-bg)] h-[280px] sm:h-[340px] md:h-[400px]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0,  filter: "blur(0px)"  }}
                    exit={{    opacity: 0, y: -40, filter: "blur(10px)" }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="flex h-full items-center justify-center px-8 sm:px-12 md:px-16"
                  >
                    {/* 5 logos in a single row */}
                    <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12">
                      {activeTab.logos.map((logo, i) => (
                        <motion.div
                          key={logo.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1   }}
                          transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                          whileHover={{
                            scale:     1.14,
                            boxShadow: "0 10px 32px rgba(18,18,18,0.14)",
                          }}
                          whileTap={{ scale: 0.96 }}
                          className="flex cursor-pointer items-center justify-center rounded-2xl border border-black/[0.07] bg-[var(--background)]/50 backdrop-blur-sm h-[72px] w-[72px] sm:h-[88px] sm:w-[88px] md:h-[104px] md:w-[104px]"
                          style={{ transition: "box-shadow 0.2s ease" }}
                        >
                          <div className="h-[30px] w-[30px] text-[var(--foreground)]/70 sm:h-[36px] sm:w-[36px] md:h-[42px] md:w-[42px]">
                            {logo.icon}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Tab labels — absolute over tab row, text never filtered */}
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
