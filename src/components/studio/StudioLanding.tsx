"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { GooeyFilter } from "@/components/ui/gooey-filter";
import { useScreenSize } from "@/hooks/use-screen-size";

// ─── Icons ─────────────────────────────────────────────────────────────────────

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
      <line x1="5" y1="11" x2="12" y2="11" /><line x1="5" y1="14" x2="9" y2="14" />
    </svg>
  );
}
function IconDiamond() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M2 9h20M12 3l4 6-4 13-4-13 4-6z" />
    </svg>
  );
}
function IconShare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="18" cy="5"  r="3" /><circle cx="6"  cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" />
    </svg>
  );
}
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
      <line x1="9"  y1="7"  x2="9"  y2="4"  /><line x1="12" y1="7"  x2="12" y2="4"  /><line x1="15" y1="7"  x2="15" y2="4"  />
      <line x1="9"  y1="20" x2="9"  y2="17" /><line x1="12" y1="20" x2="12" y2="17" /><line x1="15" y1="20" x2="15" y2="17" />
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
      <line x1="6" y1="4" x2="6" y2="6"  />
      <line x1="18" y1="14" x2="18" y2="16" />
      <line x1="5" y1="11" x2="3" y2="13" />
      <line x1="19" y1="5" x2="17" y2="7" />
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

// ─── Data ───────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "website",      label: "Website",          icon: <IconGlobe />   },
  { id: "video",        label: "Video",             icon: <IconPlay />    },
  { id: "presentation", label: "Presentation",      icon: <IconSlides />  },
  { id: "logo",         label: "Logo",              icon: <IconDiamond /> },
  { id: "social",       label: "Social Media Post", icon: <IconShare />   },
] as const;

const AI_SERVICES = [
  { id: "website",      label: "Website",          icon: <IconSparkles /> },
  { id: "video",        label: "Video",             icon: <IconCpu />      },
  { id: "presentation", label: "Presentation",      icon: <IconWand />     },
  { id: "logo",         label: "Logo",              icon: <IconEye />      },
  { id: "social",       label: "Social Media Post", icon: <IconLayers />   },
] as const;

type ServiceId = "website" | "video" | "presentation" | "logo" | "social";
type TabId     = "custom" | "ai";

const CONTENT: Record<TabId, Record<ServiceId, { heading: string; lines: [string, string] }>> = {
  custom: {
    website: {
      heading: "Website",
      lines: [
        "Crafted from the ground up with tailored UX, storytelling, and performance-driven design.",
        "Built to reflect your brand, not a template.",
      ],
    },
    video: {
      heading: "Video",
      lines: [
        "High-impact visuals, storytelling, and editing designed to captivate your audience.",
        "Every frame is intentional and brand-aligned.",
      ],
    },
    presentation: {
      heading: "Presentation",
      lines: [
        "Strategically designed decks that communicate ideas with clarity and persuasion.",
        "Perfect for pitches, reports, and storytelling.",
      ],
    },
    logo: {
      heading: "Logo",
      lines: [
        "Unique, research-driven logos crafted to define your brand identity.",
        "Built for long-term recognition and versatility.",
      ],
    },
    social: {
      heading: "Social Media Post",
      lines: [
        "Visually compelling posts designed to engage, convert, and stay on-brand.",
        "Tailored for your audience and platform.",
      ],
    },
  },
  ai: {
    website: {
      heading: "Website",
      lines: [
        "Generate fast, structured websites using intelligent layouts and content suggestions.",
        "Optimized instantly for speed, clarity, and conversion.",
      ],
    },
    video: {
      heading: "Video",
      lines: [
        "Quickly generate engaging videos with automated scripts, visuals, and transitions.",
        "Ideal for rapid content production at scale.",
      ],
    },
    presentation: {
      heading: "Presentation",
      lines: [
        "Instantly generate structured presentations with smart content flow and layouts.",
        "From idea to deck in minutes.",
      ],
    },
    logo: {
      heading: "Logo",
      lines: [
        "Generate multiple logo concepts instantly based on your style and inputs.",
        "Fast, flexible, and easy to iterate.",
      ],
    },
    social: {
      heading: "Social Media Post",
      lines: [
        "Auto-generate scroll-stopping posts with smart captions and visuals.",
        "Consistent content, created in seconds.",
      ],
    },
  },
};

const TABS: { id: TabId; label: string }[] = [
  { id: "custom", label: "Custom" },
  { id: "ai",     label: "AI"     },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StudioLanding() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const paramTab     = searchParams.get("tab") as TabId | null;

  const [activeIndex, setActiveIndex] = useState(paramTab === "ai" ? 1 : 0);
  const [hoveredId,   setHoveredId]   = useState<ServiceId | null>(null);
  const screenSize = useScreenSize();

  const activeTabId  = TABS[activeIndex].id;
  const activeLogos  = activeTabId === "ai" ? AI_SERVICES : SERVICES;
  const content      = hoveredId ? CONTENT[activeTabId][hoveredId] : null;

  return (
    <AuroraBackground
      showRadialGradient
      className="h-[100dvh] w-screen overflow-hidden !bg-[var(--background)] text-[var(--foreground)]"
    >
      <div aria-hidden className="bg-paper-grid pointer-events-none absolute inset-0 opacity-40" />
      <div aria-hidden className="pointer-events-none absolute left-[-8%] top-[-10%] h-[clamp(12rem,26vw,28rem)] w-[clamp(12rem,26vw,28rem)] rounded-full bg-[var(--spot-b)] opacity-40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-[-12%] right-[-6%] h-[clamp(10rem,20vw,22rem)] w-[clamp(10rem,20vw,22rem)] rounded-full bg-[var(--spot-a)] opacity-40 blur-3xl" />

      <GooeyFilter id="studio-goo" strength={screenSize.lessThan("md") ? 8 : 14} />

      <div className="relative flex h-full flex-col pt-[120px] sm:pt-[130px] md:pt-[144px] px-5 sm:px-6 md:px-[60px]">

        {/* Close */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0   }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 50 }}
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Close"
            style={{ position: "relative", zIndex: 50, pointerEvents: "auto" }}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/90"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-[14px] w-[14px] text-black/55 transition-colors group-hover:text-black/85">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3"  y2="13" />
            </svg>
          </button>
        </motion.div>

        {/* Folder — sole focus */}
        <div className="flex flex-1 items-center justify-center pb-[10%]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.44, delay: 0.1, ease: "easeOut" }}
            className="relative w-[92vw] max-w-[1160px]"
          >

            {/* ── Gooey filter layer — background colour blocks ONLY ─────────────
                Content (logos + text) lives in the overlay below so it is
                never distorted by the filter. */}
            <div style={{ filter: "url(#studio-goo)" }}>
              {/* Tab backgrounds */}
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
              {/* Panel background — colour only, no content */}
              <div className="h-[340px] w-full bg-[var(--folder-bg)] sm:h-[400px] md:h-[460px]" />
            </div>

            {/* ── Content overlay — absolute, unfiltered ────────────────────────
                Covers the panel area (starts at tab bottom).
                Logo row at top; text fades in below on hover. */}
            <div
              className="absolute left-0 right-0 bottom-0 flex flex-col items-center justify-between px-8 sm:px-12 md:px-16 py-8 sm:py-10 md:py-12"
              style={{ top: "calc(3rem)" }} /* = tab h-12; sm/md overridden below */
            >
              {/* Logo row */}
              <div className="flex w-full items-center justify-center gap-5 sm:gap-8 md:gap-12">
                {activeLogos.map((service, i) => {
                  const isHovered = hoveredId === service.id;
                  const isBlurred = hoveredId !== null && !isHovered;
                  return (
                    <motion.div
                      key={service.id + activeTabId}
                      initial={{ opacity: 0, scale: 0.82 }}
                      animate={{
                        opacity: isBlurred ? 0.28 : 1,
                        scale:   isHovered ? 1.13 : 1,
                        filter:  isBlurred ? "blur(3px)" : "blur(0px)",
                      }}
                      transition={{
                        opacity: { duration: 0.18 },
                        scale:   { type: "spring", stiffness: 380, damping: 22 },
                        filter:  { duration: 0.18 },
                        // stagger-in on mount only
                        ...(isHovered === false && isBlurred === false
                          ? { delay: i * 0.06 }
                          : {}),
                      }}
                      whileTap={{ scale: 0.94 }}
                      onMouseEnter={() => setHoveredId(service.id as ServiceId)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="flex cursor-pointer items-center justify-center rounded-2xl border border-black/[0.12] dark:border-white/20 bg-[var(--background)]/50 backdrop-blur-sm h-[64px] w-[64px] sm:h-[78px] sm:w-[78px] md:h-[92px] md:w-[92px]"
                    >
                      <div className="h-[26px] w-[26px] text-[var(--foreground)]/75 sm:h-[32px] sm:w-[32px] md:h-[38px] md:w-[38px]">
                        {service.icon}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Text area */}
              <div className="flex w-full flex-1 items-center justify-center pt-6 sm:pt-8">
                <div className="max-w-[520px] sm:max-w-[580px] md:max-w-[640px] text-center">
                  <AnimatePresence mode="wait">
                    {content ? (
                      <motion.div
                        key={`${hoveredId}-${activeTabId}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0  }}
                        exit={{    opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="space-y-3 sm:space-y-4"
                      >
                        <h2 className="font-display text-[1.9rem] leading-[0.9] tracking-[-0.02em] text-[var(--foreground)] sm:text-[2.3rem] md:text-[2.7rem]">
                          {content.heading}
                        </h2>
                        <p className="font-ui text-[13px] leading-relaxed text-[var(--muted)] sm:text-[14px] md:text-[15px]">
                          {content.lines[0]}
                        </p>
                        <p className="font-ui text-[12px] leading-relaxed text-[var(--muted)]/65 sm:text-[13px]">
                          {content.lines[1]}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{    opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="font-ui text-[10px] uppercase tracking-[0.26em] text-[var(--muted)]/40"
                      >
                        Hover to explore
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Tab labels — above everything, text always sharp */}
            <div className="absolute left-0 right-0 top-0 z-10 flex h-12 sm:h-14 md:h-16">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveIndex(index); setHoveredId(null); }}
                  className="flex flex-1 cursor-pointer items-center justify-center"
                >
                  <span className={`font-ui text-[12px] uppercase tracking-[0.22em] transition-colors duration-200 sm:text-[13px] md:text-[14px] ${
                    activeIndex === index ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                  }`}>
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
