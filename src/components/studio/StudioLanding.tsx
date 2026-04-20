"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AuroraBackgroundFixed } from "@/components/ui/aurora-background";
import { GooeyFilter } from "@/components/ui/gooey-filter";
import { useScreenSize } from "@/hooks/use-screen-size";

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconGlobe() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /></svg>;
}
function IconPlay() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><circle cx="12" cy="12" r="10" /><polygon points="10 8 17 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>;
}
function IconSlides() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="2" y="6" width="14" height="11" rx="1.5" /><path d="M6 6V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2" /><line x1="5" y1="11" x2="12" y2="11" /><line x1="5" y1="14" x2="9" y2="14" /></svg>;
}
function IconDiamond() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20M12 3l4 6-4 13-4-13 4-6z" /></svg>;
}
function IconShare() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
}
function IconSparkles() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z" /><path d="M19 1l.5 1.5L21 3l-1.5.5L19 5l-.5-1.5L17 3l1.5-.5L19 1z" /></svg>;
}
function IconCpu() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="7" y="7" width="10" height="10" rx="1" /><line x1="9" y1="7" x2="9" y2="4" /><line x1="12" y1="7" x2="12" y2="4" /><line x1="15" y1="7" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="17" /><line x1="12" y1="20" x2="12" y2="17" /><line x1="15" y1="20" x2="15" y2="17" /><line x1="7" y1="9" x2="4" y2="9" /><line x1="7" y1="12" x2="4" y2="12" /><line x1="7" y1="15" x2="4" y2="15" /><line x1="20" y1="9" x2="17" y2="9" /><line x1="20" y1="12" x2="17" y2="12" /><line x1="20" y1="15" x2="17" y2="15" /></svg>;
}
function IconWand() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><line x1="3" y1="21" x2="14" y2="10" /><path d="M14 10l2-2 4-1-1 4-2 2-3-3z" /><line x1="6" y1="4" x2="6" y2="6" /><line x1="18" y1="14" x2="18" y2="16" /><line x1="5" y1="11" x2="3" y2="13" /><line x1="19" y1="5" x2="17" y2="7" /></svg>;
}
function IconEye() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function IconLayers() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
}

// ─── Presentation option icons ─────────────────────────────────────────────────

function IconGenerate() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="h-full w-full">
      <path d="M14 4L16.5 11.5L24 14L16.5 16.5L14 24L11.5 16.5L4 14L11.5 11.5L14 4Z" fill="currentColor" />
      <path d="M22 19L23 22L26 23L23 24L22 27L21 24L18 23L21 22L22 19Z" fill="currentColor" opacity="0.55" />
      <path d="M7 3L7.75 5.25L10 6L7.75 6.75L7 9L6.25 6.75L4 6L6.25 5.25L7 3Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
function IconPasteText() {
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="4" y="4" width="20" height="22" rx="3" strokeWidth="1.8" />
      <line x1="8" y1="10" x2="20" y2="10" strokeWidth="1.8" />
      <line x1="8" y1="14" x2="20" y2="14" strokeWidth="1.8" />
      <line x1="8" y1="18" x2="15" y2="18" strokeWidth="1.8" />
    </svg>
  );
}
function IconTemplate() {
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="3"  y="3"  width="10" height="10" rx="2.5" strokeWidth="1.8" />
      <rect x="15" y="3"  width="10" height="10" rx="2.5" strokeWidth="1.8" />
      <rect x="3"  y="15" width="10" height="10" rx="2.5" strokeWidth="1.8" />
      <rect x="15" y="15" width="10" height="10" rx="2.5" strokeWidth="1.8" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M5 19v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" strokeWidth="1.8" />
      <path d="M19 9L14 4L9 9" strokeWidth="1.8" />
      <line x1="14" y1="4" x2="14" y2="19" strokeWidth="1.8" />
    </svg>
  );
}

function IconBulb() {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="h-[14px] w-[14px] shrink-0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2a5 5 0 0 0-2.5 9.33V13a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1.67A5 5 0 0 0 9 2z" />
      <line x1="7" y1="16" x2="11" y2="16" />
    </svg>
  );
}

// ─── Presentation option cards ─────────────────────────────────────────────────

const PRESENTATION_OPTIONS = [
  {
    id:     "generate",
    title:  "Generate",
    desc:   "Create from a one-line prompt in a few seconds",
    icon:   <IconGenerate />,
    iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300",
  },
  {
    id:     "text",
    title:  "Paste in text",
    desc:   "Create from notes, an outline, or existing content",
    icon:   <IconPasteText />,
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300",
  },
  {
    id:     "template",
    title:  "Create from template",
    desc:   "Create using the structure or layouts from a template",
    icon:   <IconTemplate />,
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  {
    id:     "import",
    title:  "Import file or URL",
    desc:   "Enhance existing docs, presentations, or webpages",
    icon:   <IconUpload />,
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300",
  },
] as const;

const PRESENTATION_SUB_TABS = [
  { id: "generate", label: "Generate"            },
  { id: "text",     label: "Paste in text"        },
  { id: "template", label: "Create from template" },
  { id: "import",   label: "Import file or URL"   },
] as const;

const presentationCardVariants = {
  hidden:  { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const presentationListVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};

const AIPresentationCards = memo(function AIPresentationCards({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <motion.div
      variants={presentationListVariants}
      initial="hidden"
      animate="visible"
      className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4"
    >
      {PRESENTATION_OPTIONS.map((opt) => (
        <motion.button
          key={opt.id}
          variants={presentationCardVariants}
          whileHover={{
            y: -5,
            scale: 1.02,
            transition: { type: "spring", stiffness: 420, damping: 22 },
          }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => onSelect(opt.id)}
          className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--background)]/80 p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-shadow duration-200 hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] dark:bg-white/[0.05]"
        >
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-2 ${opt.iconBg}`}>
            {opt.icon}
          </div>
          <div className="space-y-1">
            <p className="font-display text-[13px] font-semibold leading-snug text-[var(--foreground)] sm:text-[14px]">
              {opt.title}
            </p>
            <p className="font-ui text-[11px] leading-relaxed text-[var(--muted)] sm:text-[12px]">
              {opt.desc}
            </p>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
});

// ─── Generate chatbox ──────────────────────────────────────────────────────────

// ─── ThemePicker ───────────────────────────────────────────────────────────────

interface GammaTheme {
  id: string;
  name: string;
  type: "standard" | "custom";
  colorKeywords: string[];
  toneKeywords: string[];
}

/** Map Gamma color keywords → approximate hex swatches */
const KEYWORD_COLOR_MAP: Record<string, string> = {
  // Blues
  blue: "#3b82f6", navy: "#1e3a5f", cobalt: "#2563eb", royal: "#1d4ed8",
  sapphire: "#2563eb", electric: "#60a5fa", "pale-blue": "#bfdbfe", azure: "#38bdf8",
  // Purples
  purple: "#8b5cf6", violet: "#7c3aed", indigo: "#4f46e5", lavender: "#a78bfa",
  lilac: "#c4b5fd", amethyst: "#9333ea", mauve: "#c084fc",
  // Pinks / Reds
  pink: "#ec4899", blush: "#fda4af", rose: "#fb7185", red: "#ef4444",
  crimson: "#dc2626", burgundy: "#991b1b", "soft-red": "#f87171",
  // Greens
  green: "#22c55e", emerald: "#10b981", sage: "#4ade80", mint: "#6ee7b7",
  forest: "#166534", earth: "#65a30d", teal: "#14b8a6",
  // Oranges / Yellows
  orange: "#f97316", amber: "#f59e0b", fire: "#fb923c", gold: "#fbbf24",
  yellow: "#eab308",
  // Neutrals
  white: "#f8fafc", cream: "#fffbeb", light: "#f1f5f9", "pale-yellow": "#fef9c3",
  gray: "#94a3b8", silver: "#cbd5e1", slate: "#475569", cool: "#64748b",
  charcoal: "#374151", carbon: "#1f2937", black: "#09090b", dark: "#111827",
  obsidian: "#0f172a",
  // Cyan / Ice
  cyan: "#22d3ee", ice: "#e0f2fe", arctic: "#bae6fd", steel: "#7dd3fc",
  // Gradients / Misc
  gradient: "#6d28d9", holographic: "#818cf8", iridescent: "#a78bfa",
  neon: "#4ade80", sunset: "#fb923c", dusk: "#7c3aed",
};

function keywordToHex(kw: string): string {
  const normalized = kw.toLowerCase().replace(/[^a-z-]/g, "");
  return KEYWORD_COLOR_MAP[normalized] ?? "#94a3b8";
}

/** Derive a 3-color swatch from a theme's colorKeywords */
function themeSwatches(theme: GammaTheme): [string, string, string] {
  const kws = theme.colorKeywords.slice(0, 3);
  while (kws.length < 3) kws.push(kws[kws.length - 1] ?? "gray");
  return kws.map(keywordToHex) as [string, string, string];
}

const dropdownVariants: Variants = {
  hidden:  { opacity: 0, y: 6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.1 } },
};

interface ThemePickerProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

const ThemePicker = memo(function ThemePicker({ value, onChange, disabled }: ThemePickerProps) {
  const [open, setOpen]           = useState(false);
  const [pos, setPos]             = useState({ bottom: 0, left: 0, maxH: 320 });
  // Initialise to true on the client immediately — avoids the extra
  // useEffect render that previously fired mid-slide-transition.
  const [mounted, setMounted]     = useState(() => typeof window !== "undefined");
  const [themes, setThemes]       = useState<GammaTheme[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const triggerRef                = useRef<HTMLButtonElement>(null);
  const selected                  = useMemo(() => themes.find((t) => t.id === value) ?? null, [themes, value]);

  useEffect(() => { setMounted(true); }, []);

  // Load themes once on first open
  useEffect(() => {
    if (!open || themes.length > 0 || loadingThemes) return;
    setLoadingThemes(true);
    fetch("/api/gamma/themes")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.themes)) setThemes(d.themes); })
      .catch(() => {/* silently fail */})
      .finally(() => setLoadingThemes(false));
  }, [open, themes.length, loadingThemes]);

  function handleToggle() {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const bottomGap = window.innerHeight - r.top + 8;
      const left = Math.min(r.left, window.innerWidth - 320 - 16);
      const maxH = Math.min(320, r.top - 24);
      setPos({ bottom: bottomGap, left, maxH });
    }
    setOpen((v) => !v);
  }

  const selectedSwatches = selected ? themeSwatches(selected) : null;

  const dropdown = (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" aria-hidden onClick={() => setOpen(false)} />
          <motion.div
            key="theme-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ position: "fixed", bottom: pos.bottom, left: pos.left, zIndex: 9999 }}
            className="w-80 overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xl dark:border-white/[0.08] dark:bg-[#111] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            {loadingThemes ? (
              <div className="flex h-24 items-center justify-center">
                <svg className="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
                </svg>
              </div>
            ) : themes.length === 0 ? (
              <p className="p-4 text-center text-[11px] text-gray-400">No themes found.</p>
            ) : (
              <div className="overflow-y-auto p-1" style={{ maxHeight: pos.maxH }}>
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {themes.map((t) => {
                    const isSelected = value === t.id;
                    const swatches   = themeSwatches(t);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => { onChange(t.id); setOpen(false); }}
                        className={`w-full rounded-xl border p-3 text-left transition-colors duration-100 ${
                          isSelected
                            ? "border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-500/10"
                            : "border-transparent hover:border-black/[0.07] hover:bg-gray-50 dark:hover:border-white/[0.06] dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="mb-2 flex h-8 w-full overflow-hidden rounded-md">
                          {swatches.map((hex, i) => (
                            <span key={i} className="flex-1" style={{ background: hex }} />
                          ))}
                        </div>
                        <p className="text-xs font-medium text-gray-700 dark:text-white/70"
                           style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                          {t.name}
                        </p>
                        {t.toneKeywords?.length > 0 && (
                          <p className="mt-0.5 text-[9px] text-gray-400 dark:text-white/25">
                            {t.toneKeywords.slice(0, 3).join(" · ")}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      <motion.button
        ref={triggerRef}
        type="button"
        whileTap={{ scale: 0.95 }}
        disabled={disabled}
        onClick={handleToggle}
        aria-label="Pick a theme"
        className={`flex h-8 items-center gap-1.5 rounded-lg border px-2 transition-colors duration-150 disabled:opacity-40 ${
          open
            ? "border-violet-300 bg-violet-50/60 text-violet-600 dark:border-violet-600/50 dark:bg-violet-950/30 dark:text-violet-400"
            : "border-black/[0.08] bg-[var(--background)]/60 text-gray-400 hover:border-violet-300 hover:text-violet-600 dark:border-white/[0.08] dark:text-white/30 dark:hover:border-violet-500/60 dark:hover:text-violet-400"
        }`}
      >
        {selectedSwatches ? (
          <>
            <span className="flex items-center gap-[2px]">
              {selectedSwatches.map((hex, i) => (
                <span key={i} className="inline-block h-3 w-3 rounded-[2px]" style={{ background: hex }} />
              ))}
            </span>
            <span className="text-[10px] leading-none">Themes</span>
            <span
              role="button"
              aria-label="Clear theme"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onChange(""); } }}
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="ml-0.5 text-[11px] leading-none text-gray-400 hover:text-gray-600 dark:text-white/30 dark:hover:text-white/60"
            >
              ×
            </span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 18 18" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 1.5A7.5 7.5 0 1 0 16.5 9a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 0 11.5 4" />
              <circle cx="5.5" cy="7" r="1" fill="currentColor" stroke="none" />
              <circle cx="5.5" cy="11" r="1" fill="currentColor" stroke="none" />
              <circle cx="9"   cy="13" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-[10px] leading-none">Themes</span>
          </>
        )}
      </motion.button>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
});

function IconFile() {
  return (
    <svg viewBox="0 0 16 16" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
      <polyline points="9 2 9 6 13 6" />
    </svg>
  );
}

interface GammaResult {
  gammaUrl: string;
  gammaId: string;
  /** Vercel Blob URL for the PPTX — used for MS Office preview & download */
  pptxUrl?: string;
  title: string;
  generationId: string;
}

interface GenerateChatboxProps {
  onGenerated: (result: GammaResult) => void;
  onGeneratingChange: (loading: boolean) => void;
}

const GenerateChatbox = memo(function GenerateChatbox({ onGenerated, onGeneratingChange }: GenerateChatboxProps) {
  const [prompt, setPrompt]     = useState("");
  const [files, setFiles]       = useState<File[]>([]);
  const [theme, setTheme]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const fileInputRef            = useRef<HTMLInputElement>(null);

  async function handleGenerate() {
    if (!prompt.trim() || isLoading) return;
    setError(null);
    setIsLoading(true);
    onGeneratingChange(true);

    try {
      const res = await fetch("/api/gamma/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), themeId: theme || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Generation failed. Please try again.");
        return;
      }

      onGenerated(data as GammaResult);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
      onGeneratingChange(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 md:p-6">

      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
        }}
        placeholder="Describe your presentation… (e.g. 'Series A pitch deck for a B2B SaaS analytics startup')"
        disabled={isLoading}
        rows={4}
        className="font-ui w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--background)]/90 px-4 py-3 text-[13px] leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted)]/45 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400/25 sm:text-[14px] disabled:opacity-50"
        style={{ minHeight: "100px" }}
      />

      {/* Error */}
      {error && (
        <p className="font-ui rounded-lg border border-red-200/60 bg-red-50/60 px-3.5 py-2.5 text-[11px] text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 sm:text-[12px]">
          {error}
        </p>
      )}

      {/* Attached file chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <span
              key={i}
              className="font-ui inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--background)]/60 px-2.5 py-1 text-[11px] text-[var(--muted)]"
            >
              <span className="h-3 w-3 shrink-0"><IconFile /></span>
              <span className="max-w-[120px] truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="ml-0.5 text-[var(--muted)]/60 hover:text-[var(--foreground)]"
                aria-label="Remove file"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2.5">

        {/* + attach files */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach files"
          disabled={isLoading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--background)]/80 text-[var(--muted)] transition-colors hover:border-blue-400/40 hover:text-[var(--foreground)] disabled:opacity-40"
        >
          <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => {
            setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])]);
            e.target.value = "";
          }}
        />

        {/* Theme picker */}
        <ThemePicker value={theme} onChange={setTheme} disabled={isLoading} />

        {/* Tips */}
        <TipPopout disabled={isLoading} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Hint */}
        {!isLoading && (
          <span className="font-ui hidden text-[10px] text-[var(--muted)]/40 sm:block">
            ⌘↵ to generate
          </span>
        )}

        {/* Generate */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="font-ui shrink-0 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-[12px] font-medium text-white transition-colors duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-[13px]"
        >
          {isLoading ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
              </svg>
              Generating…
            </>
          ) : "Generate"}
        </button>
      </div>
    </div>
  );
});

// ─── Paste-in-text chatbox ────────────────────────────────────────────────────

interface PasteTextChatboxProps {
  onCreated: (result: GammaResult) => void;
  onCreatingChange: (loading: boolean) => void;
}

const PasteTextChatbox = memo(function PasteTextChatbox({ onCreated, onCreatingChange }: PasteTextChatboxProps) {
  const [text, setText]         = useState("");
  const [theme, setTheme]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleCreate() {
    if (!text.trim() || isLoading) return;
    setError(null);
    setIsLoading(true);
    onCreatingChange(true);

    try {
      const res = await fetch("/api/gamma/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text.trim(), themeId: theme || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Creation failed. Please try again.");
        return;
      }

      onCreated(data as GammaResult);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
      onCreatingChange(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 md:p-6">

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreate();
        }}
        placeholder="Paste your notes, outline, or existing content here…"
        disabled={isLoading}
        className="font-ui w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--background)]/90 px-4 py-3 text-[13px] leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted)]/45 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400/25 overflow-y-auto sm:text-[14px] disabled:opacity-50"
        style={{ height: "320px" }}
      />

      {/* Error */}
      {error && (
        <p className="font-ui rounded-lg border border-red-200/60 bg-red-50/60 px-3.5 py-2.5 text-[11px] text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 sm:text-[12px]">
          {error}
        </p>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2.5">

        {/* Theme picker */}
        <ThemePicker value={theme} onChange={setTheme} disabled={isLoading} />

        {/* Tips */}
        <TipPopout disabled={isLoading} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Hint */}
        {!isLoading && (
          <span className="font-ui hidden text-[10px] text-[var(--muted)]/40 sm:block">
            ⌘↵ to create
          </span>
        )}

        {/* Create */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={isLoading || !text.trim()}
          className="font-ui shrink-0 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-[12px] font-medium text-white transition-colors duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-[13px]"
        >
          {isLoading ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
              </svg>
              Creating…
            </>
          ) : "Create"}
        </button>
      </div>
    </div>
  );
});

// ─── Card-by-card control tip popout ───────────────────────────────────────────

const TIP_EXAMPLE = `Intro to our new strategy

Key point 1
Key point 2
Key point 3
---

Key metrics from Q1

Key point 1
Key point 2
Key point 3
---

Next steps + ownership

Key point 1
...`;

const tipPopoutVariants: Variants = {
  hidden:  { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.1 } },
};

function TipPopout({ disabled }: { disabled?: boolean }) {
  const [open, setOpen]     = useState(false);
  const [pos, setPos]       = useState({ bottom: 0, left: 0 });
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");
  const triggerRef          = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  function handleToggle() {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const bottom = window.innerHeight - r.top + 8;
      const left = Math.min(r.left, window.innerWidth - 352 - 16);
      setPos({ bottom, left });
    }
    setOpen((v) => !v);
  }

  const popout = (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" aria-hidden onClick={() => setOpen(false)} />
          <motion.div
            key="tip-card"
            variants={tipPopoutVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ position: "fixed", bottom: pos.bottom, left: pos.left, zIndex: 9999 }}
            className="w-[min(22rem,90vw)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--background)] shadow-[0_12px_40px_rgba(0,0,0,0.14)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
              <div className="flex items-center gap-2">
                <IconBulb />
                <span className="font-ui text-[11px] font-semibold text-[var(--foreground)]">
                  Card-by-card control
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close tip"
                className="flex h-5 w-5 items-center justify-center rounded-md text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="11" y2="11" />
                  <line x1="11" y1="1" x2="1" y2="11" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <p className="font-ui text-[12px] leading-relaxed text-[var(--muted)]">
                Know what you want on each card? Add three dashes{" "}
                <code className="rounded bg-[var(--muted)]/10 px-1 py-0.5 font-mono text-[11px] text-[var(--foreground)]">
                  ---
                </code>{" "}
                between each section.
              </p>

              <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]/50">
                Example
              </p>

              <pre className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--muted)]/[0.04] p-3 font-mono text-[10px] leading-relaxed text-[var(--muted)] whitespace-pre-wrap">
                {TIP_EXAMPLE}
              </pre>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      <motion.button
        ref={triggerRef}
        type="button"
        whileTap={{ scale: 0.95 }}
        disabled={disabled}
        onClick={handleToggle}
        aria-label="Tips"
        className={`font-ui flex h-8 items-center gap-1.5 rounded-lg border px-2 transition-colors duration-150 disabled:opacity-40 ${
          open
            ? "border-violet-300 bg-violet-50/60 text-violet-600 dark:border-violet-600/50 dark:bg-violet-950/30 dark:text-violet-400"
            : "border-black/[0.08] bg-[var(--background)]/60 text-gray-400 hover:border-violet-300 hover:text-violet-600 dark:border-white/[0.08] dark:text-white/30 dark:hover:border-violet-500/60 dark:hover:text-violet-400"
        }`}
      >
        <IconBulb />
        <span className="text-[10px] leading-none">Tips</span>
      </motion.button>

      {mounted && createPortal(popout, document.body)}
    </div>
  );
}

// ─── Template data ─────────────────────────────────────────────────────────────

const GAMMA_TEMPLATES = [
  { name: "Executive Summary",                          gammaId: "g_4gu8otk1vm1h4nl",  photo: "/template_photos/executive summary.avif"                                          },
  { name: "Market Sizing Framework",                    gammaId: "g_56g9bdj9de9uuzw",  photo: "/template_photos/Market-Sizing-Framework.avif"                                    },
  { name: "Experiment Report",                          gammaId: "g_i1ig9mm63pbq0vs",  photo: "/template_photos/experiment report.avif"                                          },
  { name: "Company Presentation Template Ultraviolet",  gammaId: "g_i2f9icr6yicxbkp",  photo: "/template_photos/company-presentation-template-ultraviolet.avif"                 },
  { name: "Lecture Plan",                               gammaId: "g_sorfwt2u4enk6w1",  photo: "/template_photos/Lecture-Plan.avif"                                               },
  { name: "Monthly Letter Newsletter",                  gammaId: "g_41avujzend54bkg",   photo: "/template_photos/monthly letter newsletter.avif"                                  },
  { name: "Project Timeline",                           gammaId: "g_q70t40qy7kihi67",   photo: "/template_photos/project timeline.avif"                                           },
  { name: "Partnership Proposal",                       gammaId: "g_yx8zuc9q23q3oad",   photo: "/template_photos/Partnership-Proposal.avif"                                       },
  { name: "Training Program Overview",                  gammaId: "g_cfbnuegk7s8xj53",   photo: "/template_photos/training program overview.avif"                                  },
  { name: "Freelance Services That Elevate Your Business", gammaId: "g_ue3m8n4eqwmottg", photo: "/template_photos/Freelance-Services-That-Elevate-Your-Business.avif"           },
  { name: "Rebrand Proposal",                           gammaId: "g_f7y0675r6sho845",   photo: "/template_photos/Rebrand-Proposal.avif"                                          },
  { name: "Client Design Review",                       gammaId: "g_pq1puep1gc8zxw1",   photo: "/template_photos/Client-Design-Review.avif"                                      },
  { name: "Mood Board",                                 gammaId: "g_vg3ibrp4jq8os8d",   photo: "/template_photos/Mood-Board.avif"                                                 },
  { name: "Engagement Kickoff",                         gammaId: "g_zm803g3ml2tmu7b",   photo: "/template_photos/Engagement-Kickoff.avif"                                        },
  { name: "Company Presentation Template Primer",       gammaId: "g_g7k457dgygz2gfd",   photo: "/template_photos/company-presentation-template-primer.avif"                     },
  { name: "Capabilities",                               gammaId: "g_4hq40ecz4sysx7v",   photo: "/template_photos/Capabilities.avif"                                              },
  { name: "Sales Incentive",                            gammaId: "g_269tutmduum49b4",    photo: "/template_photos/sales incentive.avif"                                           },
  { name: "Brand Guidelines",                           gammaId: "g_0hn8rxh1e0tsx09",   photo: "/template_photos/Brand-Guidelines.avif"                                          },
  { name: "Team Retrospective",                         gammaId: "g_c0igdundvqlozfe",    photo: "/template_photos/Team-Retrospective__1_.avif"                                    },
  { name: "Our Team",                                   gammaId: "g_n6a0tpb9t127d24", photo: "/template_photos/Our-Team.avif"                                                 },
] as const;

// ─── Template selector ─────────────────────────────────────────────────────────

interface TemplateSelectorProps {
  onSelect: (gammaId: string) => void;
}

const TemplateSelector = memo(function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="p-4 sm:p-5 md:p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {GAMMA_TEMPLATES.map((tpl) => (
          <motion.button
            key={tpl.gammaId}
            type="button"
            onClick={() => onSelect(tpl.gammaId)}
            whileHover={{ y: -4, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 22 } }}
            whileTap={{ scale: 0.96 }}
            className="group flex flex-col gap-2 rounded-xl border border-[var(--line)] bg-[var(--background)]/70 p-2 text-left shadow-sm transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--muted)]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tpl.photo}
                alt={tpl.name}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="font-ui px-0.5 pb-0.5 text-[10px] leading-snug text-[var(--foreground)] sm:text-[11px]">
              {tpl.name}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

// ─── Template chatbox ──────────────────────────────────────────────────────────

interface TemplateChatboxProps {
  gammaId: string;
  templateName: string;
  templatePhoto: string;
  onBack: () => void;
  onCreated: (result: GammaResult) => void;
  onCreatingChange: (loading: boolean) => void;
}

const TemplateChatbox = memo(function TemplateChatbox({
  gammaId,
  templateName,
  templatePhoto,
  onBack,
  onCreated,
  onCreatingChange,
}: TemplateChatboxProps) {
  const [prompt, setPrompt]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function handleCreate() {
    if (!prompt.trim() || isLoading) return;
    setError(null);
    setIsLoading(true);
    onCreatingChange(true);

    try {
      const res = await fetch("/api/gamma/generate-from-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), gammaId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Generation failed. Please try again.");
        return;
      }

      onCreated(data as GammaResult);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
      onCreatingChange(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 md:p-6">

      {/* Selected template chip */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-1 text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--foreground)] disabled:opacity-40"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10 4 6 8 10 12" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--background)]/60 px-2.5 py-1.5">
          <div className="h-7 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--muted)]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={templatePhoto} alt={templateName} className="h-full w-full object-contain" />
          </div>
          <span className="font-ui text-[11px] text-[var(--foreground)]">{templateName}</span>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreate();
        }}
        placeholder="Describe how you'd like to adapt this template…"
        disabled={isLoading}
        rows={4}
        className="font-ui w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--background)]/90 px-4 py-3 text-[13px] leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted)]/45 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400/25 sm:text-[14px] disabled:opacity-50"
        style={{ minHeight: "100px" }}
      />

      {/* Error */}
      {error && (
        <p className="font-ui rounded-lg border border-red-200/60 bg-red-50/60 px-3.5 py-2.5 text-[11px] text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 sm:text-[12px]">
          {error}
        </p>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1" />
        {!isLoading && (
          <span className="font-ui hidden text-[10px] text-[var(--muted)]/40 sm:block">
            ⌘↵ to create
          </span>
        )}
        <button
          type="button"
          onClick={handleCreate}
          disabled={isLoading || !prompt.trim()}
          className="font-ui shrink-0 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-[12px] font-medium text-white transition-colors duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-[13px]"
        >
          {isLoading ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
              </svg>
              Creating…
            </>
          ) : "Create"}
        </button>
      </div>
    </div>
  );
});

// ─── Slide card ────────────────────────────────────────────────────────────────


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
    website:      { heading: "Website",          lines: ["Crafted from the ground up with tailored UX, storytelling, and performance-driven design.", "Built to reflect your brand, not a template."] },
    video:        { heading: "Video",             lines: ["High-impact visuals, storytelling, and editing designed to captivate your audience.", "Every frame is intentional and brand-aligned."] },
    presentation: { heading: "Presentation",      lines: ["Strategically designed decks that communicate ideas with clarity and persuasion.", "Perfect for pitches, reports, and storytelling."] },
    logo:         { heading: "Logo",              lines: ["Unique, research-driven logos crafted to define your brand identity.", "Built for long-term recognition and versatility."] },
    social:       { heading: "Social Media Post", lines: ["Visually compelling posts designed to engage, convert, and stay on-brand.", "Tailored for your audience and platform."] },
  },
  ai: {
    website:      { heading: "Website",          lines: ["Generate fast, structured websites using intelligent layouts and content suggestions.", "Optimized instantly for speed, clarity, and conversion."] },
    video:        { heading: "Video",             lines: ["Quickly generate engaging videos with automated scripts, visuals, and transitions.", "Ideal for rapid content production at scale."] },
    presentation: { heading: "Presentation",      lines: ["Instantly generate structured presentations with smart content flow and layouts.", "From idea to deck in minutes."] },
    logo:         { heading: "Logo",              lines: ["Generate multiple logo concepts instantly based on your style and inputs.", "Fast, flexible, and easy to iterate."] },
    social:       { heading: "Social Media Post", lines: ["Auto-generate scroll-stopping posts with smart captions and visuals.", "Consistent content, created in seconds."] },
  },
};

const TABS: { id: TabId; label: string }[] = [
  { id: "custom", label: "Custom" },
  { id: "ai",     label: "AI"     },
];

const SERVICE_TABS: { id: ServiceId; label: string }[] = [
  { id: "website",      label: "Website"      },
  { id: "video",        label: "Video"        },
  { id: "presentation", label: "Presentation" },
  { id: "logo",         label: "Logo"         },
  { id: "social",       label: "Social"       },
];

// ─── Preview content ───────────────────────────────────────────────────────────

function WebsitePreviews() {
  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="aspect-[3/2] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--background)]/50">
          <div className="flex h-4 items-center gap-1 border-b border-[var(--line)] px-2.5">
            {[0,1,2].map(j => <span key={j} className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]/30" />)}
          </div>
          <div className="space-y-1.5 p-2.5">
            <div className="h-2 w-4/5 rounded bg-[var(--muted)]/25" />
            <div className="h-1.5 w-3/5 rounded bg-[var(--muted)]/15" />
            <div className={`mt-1.5 rounded bg-[var(--muted)]/10 ${i === 1 ? "h-8" : "h-10"}`} />
            {i === 0 && <div className="flex gap-1"><div className="h-4 w-1/2 rounded bg-[var(--muted)]/10" /><div className="h-4 flex-1 rounded bg-[var(--muted)]/10" /></div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoPreviews() {
  const tints = ["bg-[var(--spot-a)]/40", "bg-[var(--spot-b)]/40", "bg-[var(--muted)]/20"];
  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {tints.map((tint, i) => (
        <div key={i} className={`aspect-video overflow-hidden rounded-xl border border-[var(--line)] relative ${tint}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--foreground)]/20 bg-[var(--background)]/40 backdrop-blur-sm">
              <svg viewBox="0 0 12 12" className="ml-0.5 h-4 w-4 text-[var(--foreground)]/70" fill="currentColor">
                <polygon points="3 2 10 6 3 10" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-2 pb-1.5">
            <div className="h-1.5 w-2/3 rounded bg-[var(--foreground)]/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PresentationPreviews() {
  const previews = [GAMMA_TEMPLATES[0], GAMMA_TEMPLATES[6], GAMMA_TEMPLATES[13]];
  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {previews.map((tpl) => (
        <div key={tpl.gammaId} className="aspect-[4/3] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--background)]/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tpl.photo} alt={tpl.name} className="h-full w-full object-contain" />
        </div>
      ))}
    </div>
  );
}

function LogoPreviews() {
  const shapes = [
    <circle key="a" cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2" />,
    <path key="b" d="M20 8 L32 26 L8 26 Z" fill="none" stroke="currentColor" strokeWidth="2" />,
    <><rect key="c1" x="10" y="10" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><rect key="c2" x="16" y="16" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" /></>,
    <path key="d" d="M20 8 L28 20 L20 32 L12 20 Z" fill="none" stroke="currentColor" strokeWidth="2" />,
    <><circle key="e1" cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2" /><circle key="e2" cx="20" cy="20" r="6" fill="currentColor" opacity="0.3" /></>,
    <path key="f" d="M10 20 Q15 8 20 20 Q25 32 30 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />,
  ];
  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {shapes.map((shape, i) => (
        <div key={i} className="aspect-square overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--background)]/50 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="h-[55%] w-[55%] text-[var(--foreground)]/60">
            {shape}
          </svg>
        </div>
      ))}
    </div>
  );
}

function SocialPreviews() {
  const configs = [
    { from: "from-[var(--spot-b)]/60", to: "to-[var(--spot-a)]/40" },
    { from: "from-[var(--spot-a)]/50", to: "to-[var(--muted)]/30"  },
    { from: "from-[var(--muted)]/30",  to: "to-[var(--spot-b)]/50" },
  ];
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
      {configs.map((c, i) => (
        <div key={i} className={`w-[28%] max-w-[140px] aspect-[9/16] overflow-hidden rounded-xl border border-[var(--line)] bg-gradient-to-b ${c.from} ${c.to} flex flex-col justify-between p-2 sm:p-3`}>
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full bg-[var(--background)]/40" />
            <div className="h-1.5 w-10 rounded bg-[var(--background)]/40" />
          </div>
          <div className="space-y-1.5 rounded-lg bg-[var(--background)]/20 p-2">
            <div className="h-1.5 w-4/5 rounded bg-[var(--background)]/50" />
            <div className="h-1.5 w-3/5 rounded bg-[var(--background)]/35" />
          </div>
        </div>
      ))}
    </div>
  );
}

const PREVIEWS: Record<ServiceId, React.ReactNode> = {
  website:      <WebsitePreviews />,
  video:        <VideoPreviews />,
  presentation: <PresentationPreviews />,
  logo:         <LogoPreviews />,
  social:       <SocialPreviews />,
};

// ─── Slide variants ────────────────────────────────────────────────────────────

const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "102%" : "-102%",
    opacity: 0.85,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 240, damping: 28 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-102%" : "102%",
    opacity: 0.85,
    transition: { type: "spring", stiffness: 240, damping: 28 },
  }),
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StudioLanding() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const paramTab     = searchParams.get("tab") as TabId | null;

  const [activeIndex,    setActiveIndex]    = useState<0 | 1>(paramTab === "ai" ? 1 : 0);
  const [hoveredId,      setHoveredId]      = useState<ServiceId | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<ServiceId>("website");
  const [slideDir,       setSlideDir]       = useState<1 | -1>(1);
  const [activePresentationTab, setActivePresentationTab] = useState<string | null>(null);
  const [selectedTemplateId,    setSelectedTemplateId]    = useState<string | null>(null);
  // presentationMode drives the expensive layout change (outer container, folder height)
  // and is deferred via useTransition so it doesn't block the slide animation start
  const [presentationMode, setPresentationMode] = useState(false);
  const [gammaResult,      setGammaResult]      = useState<GammaResult | null>(null);
  const [isGenerating,     setIsGenerating]     = useState(false);
  // Lifecycle-based sync: fires when the entering slide spring settles.
  // Replaced setTimeout(520) — timing was fragile on slow devices.
  const onSlideSettledRef = useRef<(() => void) | null>(null);
  // Read presentationMode in callbacks without adding it to useCallback deps
  const presentationModeRef = useRef(presentationMode);
  presentationModeRef.current = presentationMode;
  const screenSize = useScreenSize();

  const activeTabId = TABS[activeIndex].id;
  const activeLogos = activeTabId === "ai" ? AI_SERVICES : SERVICES;
  const hoverContent = hoveredId ? CONTENT[activeTabId][hoveredId] : null;

  const openDetail = useCallback((service: ServiceId) => {
    setSlideDir(1);
    setActiveDetailTab(service);
    setHoveredId(null);
    setSelectedService(service);
  }, []);

  // X button: close sub-view → detail → main → home
  const handleClose = useCallback(() => {
    if (activePresentationTab) {
      setSlideDir(-1);
      setPresentationMode(false);
      setActivePresentationTab(null);
      setSelectedTemplateId(null);
      setGammaResult(null);
    } else if (selectedService) {
      setSlideDir(-1);
      setSelectedService(null);
    } else {
      router.push("/");
    }
  }, [activePresentationTab, selectedService, router]);

  // Open a presentation sub-tab: start the slide animation immediately,
  // then expand layout ONLY after the entering spring fully settles.
  // onSlideSettledRef is picked up by the presentation-sub motion.div's
  // onAnimationComplete — no setTimeout, no hardcoded timing.
  const openPresentationTab = useCallback((id: string) => {
    setSlideDir(1);
    setActivePresentationTab(id);
    // Only "generate" has content below the folder (chatbox + slide result),
    // so only it needs presentationMode (scrollable shell + folder resize).
    // The other tabs (text, template, import) have no sub-content — triggering
    // presentationMode for them caused a pointless folder expansion (52vh→62vh)
    // with nothing inside, which the user perceived as lag after the slide spring.
    if (!presentationModeRef.current && (id === "generate" || id === "text")) {
      onSlideSettledRef.current = () => {
        setPresentationMode(true);
        onSlideSettledRef.current = null;
      };
    }
  }, []);

  const handleSelectTemplate = useCallback((gammaId: string) => {
    setSelectedTemplateId(gammaId);
    if (!presentationModeRef.current) {
      setPresentationMode(true);
    }
  }, []);

  const handleBackToSelector = useCallback(() => {
    setSelectedTemplateId(null);
    setPresentationMode(false);
    setGammaResult(null);
  }, []);

  return (
    // Outer shell: handles scroll vs fixed-height layout. NOT the visual background.
    // The background is AuroraBackgroundFixed below — a position:fixed sibling,
    // completely decoupled from this element and all animated children.
    <main className={`relative w-screen text-[var(--foreground)] ${
      presentationMode
        ? "min-h-[100dvh] overflow-y-auto overflow-x-hidden"
        : "h-[100dvh] overflow-hidden"
    }`}>
      {/*
        AuroraBackgroundFixed lives in its OWN compositing layer (position:fixed),
        isolated from the folder's will-change:transform layers.
        memo() ensures it never re-renders regardless of StudioLanding state.

        BEFORE: aurora blur/blend was an ANCESTOR of animated slides →
          GPU had to flatten and re-composite aurora+slides together every frame.
        AFTER: aurora is a fixed sibling → GPU composites them independently.
      */}
      <AuroraBackgroundFixed showRadialGradient />

      {/* Content: explicit stacking context, isolated from aurora's mix-blend-difference */}
      <div className="relative" style={{ zIndex: 1, isolation: "isolate" }}>
        <div aria-hidden className="bg-paper-grid pointer-events-none absolute inset-0 opacity-40" />
        {/* Blobs are cheap static blurs — only render in top-level views, not during the scrollable presentation view */}
        {activePresentationTab === null && (
          <>
            <div aria-hidden className="pointer-events-none absolute left-[-8%] top-[-10%] h-[clamp(12rem,26vw,28rem)] w-[clamp(12rem,26vw,28rem)] rounded-full bg-[var(--spot-b)] opacity-40 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute bottom-[-12%] right-[-6%] h-[clamp(10rem,20vw,22rem)] w-[clamp(10rem,20vw,22rem)] rounded-full bg-[var(--spot-a)] opacity-40 blur-3xl" />
          </>
        )}

        <GooeyFilter id="studio-goo" strength={screenSize.lessThan("md") ? 8 : 14} />

        {/* Shell */}
        <div className={`relative flex flex-col pt-[100px] sm:pt-[112px] md:pt-[128px] px-5 sm:px-6 md:px-[60px] ${
          presentationMode ? "pb-20" : "h-full"
        }`}>

        {/* Close / Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0   }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 50 }}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label={selectedService ? "Back to services" : "Close"}
            style={{ position: "relative", zIndex: 50, pointerEvents: "auto" }}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/90"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-[14px] w-[14px] text-black/55 transition-colors group-hover:text-black/85">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3"  y2="13" />
            </svg>
          </button>
        </motion.div>

        {/* Folder container */}
        <div className={presentationMode
          ? "mt-6 sm:mt-8 flex flex-col items-center gap-8 sm:gap-10"
          : "flex flex-1 items-center justify-center pb-[10%]"
        }>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.44, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            /* overflow-hidden clips the horizontal slide; height via CSS transition — no layout measurement.
               No will-change here: this div animates only once on mount (0.44s), then is static forever.
               Framer Motion promotes it automatically during the animation; keeping will-change permanently
               would waste a GPU layer for the component's entire lifetime. */
            className={`relative w-[92vw] max-w-[1160px] overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[height] ${
              activePresentationTab === "template" && !selectedTemplateId
                ? "h-[38rem]"
                : presentationMode && activePresentationTab === "text"
                  ? "h-[36rem]"
                  : presentationMode
                    ? "h-[22rem]"
                    : "h-[29rem]"
            }`}
          >
            <AnimatePresence custom={slideDir} mode="sync" initial={false}>

              {/* ── MAIN VIEW ── */}
              {selectedService === null && (
                <motion.div
                  key="main"
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                  style={{ willChange: "transform" }}
                >
                  {/* Gooey filter — background colour blocks only, never receives pointer events */}
                  <div style={{ filter: "url(#studio-goo)", pointerEvents: "none" }} className="flex h-full flex-col">
                    <div className="flex w-full shrink-0">
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
                    <div className="flex-1 w-full bg-[var(--folder-bg)]" />
                  </div>

                  {/* Logo + text content overlay (unfiltered) */}
                  <div className="absolute left-0 right-0 bottom-0 top-12 sm:top-14 md:top-16 z-20 flex flex-col items-center justify-between px-6 sm:px-10 md:px-14 py-5 sm:py-7 md:py-9">

                    {/* Logo row */}
                    <div className="flex w-full items-center justify-center gap-3 sm:gap-5 md:gap-8">
                      {activeLogos.map((service) => {
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
                            }}
                            whileTap={{ scale: 0.94 }}
                            onMouseEnter={() => setHoveredId(service.id as ServiceId)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => openDetail(service.id as ServiceId)}
                            className="flex cursor-pointer items-center justify-center rounded-2xl border border-black/[0.12] dark:border-white/20 bg-[var(--background)]/50 backdrop-blur-sm h-[clamp(2.8rem,4.2vw,4.5rem)] w-[clamp(2.8rem,4.2vw,4.5rem)]"
                          >
                            <div className="h-[clamp(1.1rem,1.7vw,1.85rem)] w-[clamp(1.1rem,1.7vw,1.85rem)] text-[var(--foreground)]/75">
                              {service.icon}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Hover text */}
                    <div className="flex w-full flex-1 items-center justify-center pt-6 sm:pt-8">
                      <div className="max-w-[520px] sm:max-w-[580px] md:max-w-[640px] text-center">
                        <AnimatePresence mode="wait">
                          {hoverContent ? (
                            <motion.div
                              key={`${hoveredId}-${activeTabId}`}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0  }}
                              exit={{    opacity: 0, y: -10 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="space-y-3 sm:space-y-4"
                            >
                              <h2 className="font-display text-[1.9rem] leading-[0.9] tracking-[-0.02em] text-[var(--foreground)] sm:text-[2.3rem] md:text-[2.7rem]">
                                {hoverContent.heading}
                              </h2>
                              <p className="font-ui text-[13px] leading-relaxed text-[var(--muted)] sm:text-[14px] md:text-[15px]">
                                {hoverContent.lines[0]}
                              </p>
                              <p className="font-ui text-[12px] leading-relaxed text-[var(--muted)]/65 sm:text-[13px]">
                                {hoverContent.lines[1]}
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
                              Hover to explore · Click to open
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Tab labels */}
                  <div className="absolute left-0 right-0 top-0 z-10 flex h-12 sm:h-14 md:h-16">
                    {TABS.map((tab, index) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => { setActiveIndex(index as 0 | 1); setHoveredId(null); }}
                        className="flex flex-1 cursor-pointer items-center justify-center"
                      >
                        <span className={`font-ui text-[12px] uppercase tracking-[0.22em] transition-colors duration-200 sm:text-[13px] md:text-[14px] ${activeIndex === index ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── DETAIL VIEW ── */}
              {selectedService !== null && activePresentationTab === null && (
                <motion.div
                  key="detail"
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                  style={{ willChange: "transform" }}
                >
                  {/* Gooey filter layer — background colour blocks only, never receives pointer events */}
                  <div style={{ filter: "url(#studio-goo)", pointerEvents: "none" }} className="flex h-full flex-col">
                    <div className="flex w-full shrink-0">
                      {SERVICE_TABS.map((tab) => (
                        <div key={tab.id} className="relative h-12 flex-1 sm:h-14 md:h-16">
                          {activeDetailTab === tab.id && (
                            <motion.div
                              layoutId="detail-tab-bg"
                              className="absolute inset-0 bg-[var(--folder-bg)]"
                              transition={{ type: "spring", bounce: 0, duration: 0.36 }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 w-full bg-[var(--folder-bg)]" />
                  </div>

                  {/* Tab labels overlay — sits on top, unfiltered */}
                  <div className="absolute left-0 right-0 top-0 z-10 flex h-12 sm:h-14 md:h-16">
                    {SERVICE_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveDetailTab(tab.id)}
                        className="flex flex-1 cursor-pointer items-center justify-center"
                      >
                        <span className={`font-ui text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 sm:text-[11px] md:text-[12px] ${
                          activeDetailTab === tab.id
                            ? "text-[var(--foreground)]"
                            : "text-[var(--muted)]"
                        }`}>
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Content overlay — unfiltered, always above gooey layer */}
                  <div className="absolute left-0 right-0 bottom-0 top-12 sm:top-14 md:top-16 z-20 flex flex-col">
                    {/* Custom / AI mini toggle — top-right of content area */}
                    <div className="flex justify-end px-5 sm:px-7 md:px-9 pt-4 sm:pt-5">
                      <div className="flex items-center gap-[3px] rounded-full border border-[var(--line)] bg-[var(--background)]/40 p-[3px] backdrop-blur-sm">
                        {TABS.map((tab, i) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveIndex(i as 0 | 1)}
                            className={`rounded-full px-3 py-1 font-ui text-[9px] uppercase tracking-[0.18em] transition-colors duration-200 sm:text-[10px] ${
                              activeIndex === i
                                ? "bg-[var(--foreground)] text-[var(--background)]"
                                : "text-[var(--muted)]"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview content */}
                    <div className="flex flex-1 items-center justify-center p-5 sm:p-7 md:p-9">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeDetailTab + activeTabId}
                          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                          exit={{    opacity: 0, y: -10, filter: "blur(6px)" }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="w-full"
                        >
                          {activeTabId === "ai" && activeDetailTab === "presentation"
                            ? <AIPresentationCards onSelect={openPresentationTab} />
                            : PREVIEWS[activeDetailTab]
                          }
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PRESENTATION SUB VIEW ── */}
              {activePresentationTab !== null && (
                <motion.div
                  key="presentation-sub"
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                  style={{ willChange: "transform" }}
                  onAnimationComplete={(definition) => {
                    // "center" = the entering spring has fully settled.
                    // Trigger layout expansion ONLY at this lifecycle point —
                    // no setTimeout, no hardcoded timing, no race conditions.
                    if (definition === "center" && onSlideSettledRef.current) {
                      onSlideSettledRef.current();
                    }
                  }}
                >
                  {/* Gooey filter layer */}
                  <div style={{ filter: "url(#studio-goo)", pointerEvents: "none" }} className="flex h-full flex-col">
                    <div className="flex w-full shrink-0">
                      {PRESENTATION_SUB_TABS.map((tab) => (
                        <div key={tab.id} className="relative h-12 flex-1 sm:h-14 md:h-16">
                          {activePresentationTab === tab.id && (
                            <motion.div
                              layoutId="presentation-sub-tab-bg"
                              className="absolute inset-0 bg-[var(--folder-bg)]"
                              transition={{ type: "spring", bounce: 0, duration: 0.36 }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 w-full bg-[var(--folder-bg)]" />
                  </div>

                  {/* Tab labels overlay */}
                  <div className="absolute left-0 right-0 top-0 z-10 flex h-12 sm:h-14 md:h-16">
                    {PRESENTATION_SUB_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActivePresentationTab(tab.id)}
                        className="flex flex-1 cursor-pointer items-center justify-center px-1"
                      >
                        <span className={`font-ui text-[7px] uppercase tracking-[0.08em] transition-colors duration-200 sm:text-[8px] sm:tracking-[0.12em] md:text-[9px] md:tracking-[0.16em] text-center leading-tight ${
                          activePresentationTab === tab.id
                            ? "text-[var(--foreground)]"
                            : "text-[var(--muted)]"
                        }`}>
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Content area */}
                  <div className="absolute left-0 right-0 bottom-0 top-12 sm:top-14 md:top-16 z-20 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePresentationTab ?? "empty"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{    opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: "easeOut", delay: 0.22 }}
                      >
                        {activePresentationTab === "generate" && (
                          <GenerateChatbox
                            onGenerated={setGammaResult}
                            onGeneratingChange={setIsGenerating}
                          />
                        )}
                        {activePresentationTab === "text" && (
                          <PasteTextChatbox
                            onCreated={setGammaResult}
                            onCreatingChange={setIsGenerating}
                          />
                        )}
                        {activePresentationTab === "template" && (
                          <AnimatePresence mode="wait" initial={false}>
                            {!selectedTemplateId ? (
                              <motion.div
                                key="template-selector"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <TemplateSelector onSelect={handleSelectTemplate} />
                              </motion.div>
                            ) : (
                              <motion.div
                                key={`template-chatbox-${selectedTemplateId}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                {(() => {
                                  const tpl = GAMMA_TEMPLATES.find((t) => t.gammaId === selectedTemplateId);
                                  return tpl ? (
                                    <TemplateChatbox
                                      gammaId={tpl.gammaId}
                                      templateName={tpl.name}
                                      templatePhoto={tpl.photo}
                                      onBack={handleBackToSelector}
                                      onCreated={setGammaResult}
                                      onCreatingChange={setIsGenerating}
                                    />
                                  ) : null;
                                })()}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

          {/* Generated slides — rendered below the folder, only once layout has expanded */}
          {presentationMode && (
            <div className="w-full max-w-[1160px]">
              <AnimatePresence mode="wait">

                {/* Loading skeleton */}
                {isGenerating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--background)]/60 p-5"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="mb-3 h-4 w-2/3 rounded-lg bg-[var(--muted)]/15" />
                        <div className="space-y-2">
                          <div className="h-3 w-full rounded bg-[var(--muted)]/10" />
                          <div className="h-3 w-4/5 rounded bg-[var(--muted)]/10" />
                          <div className="h-3 w-3/5 rounded bg-[var(--muted)]/10" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Slide embed */}
                {!isGenerating && gammaResult && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                  >
                    {/* Header row */}
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]/50 mb-1">
                          Presentation ready
                        </p>
                        <h2 className="font-display text-[17px] font-semibold leading-snug text-[var(--foreground)] sm:text-[19px]">
                          {gammaResult.title}
                        </h2>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {gammaResult.pptxUrl && (
                          <a
                            href={gammaResult.pptxUrl}
                            download
                            className="font-ui inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--background)]/60 px-3.5 py-2 text-[11px] text-[var(--foreground)] backdrop-blur-sm transition-colors hover:bg-[var(--background)] sm:text-[12px]"
                          >
                            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 2v6M3 6l3 3 3-3M2 10h8" />
                            </svg>
                            Download PPT
                          </a>
                        )}
                        <a
                          href={gammaResult.gammaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-ui inline-flex items-center gap-1.5 rounded-xl bg-blue-500 px-3.5 py-2 text-[11px] font-medium text-white transition-colors hover:bg-blue-600 sm:text-[12px]"
                        >
                          Open in Gamma
                          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 10L10 2M10 2H5M10 2v5" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    {/* PPTX preview via Microsoft Office Online viewer */}
                    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--background)]/40">
                      {gammaResult.pptxUrl ? (
                        <iframe
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(gammaResult.pptxUrl)}`}
                          title={gammaResult.title}
                          allow="fullscreen"
                          loading="lazy"
                          className="w-full"
                          style={{ height: "80vh", border: "none", display: "block" }}
                        />
                      ) : (
                        <div className="flex h-64 items-center justify-center text-[var(--muted)] font-ui text-[13px]">
                          Preview unavailable —{" "}
                          <a href={gammaResult.gammaUrl} target="_blank" rel="noopener noreferrer" className="ml-1 underline">
                            open in Gamma
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          )}
        </div>
        </div>{/* end Shell */}
      </div>{/* end content z-1 wrapper */}
    </main>
  );
}
