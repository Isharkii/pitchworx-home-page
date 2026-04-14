"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";
type NavPanel = "about" | "login" | "pricing" | null;

const storageKey = "pitchworx-theme";

const panelCopy = {
  pricing: {
    eyebrow: "Pricing",
    title: "Pricing placeholder",
    description:
      "Keep this slot for a compact pricing modal, package matrix, or booking flow.",
  },
  about: {
    eyebrow: "About",
    title: "PitchWorx",
    description:
      "Minimal motion systems, editorial pacing, and single-screen launches with clean first impressions.",
  },
  login: {
    eyebrow: "Login",
    title: "Portal placeholder",
    description:
      "Replace this with the final auth route once the account flow is ready.",
  },
} as const;

function applyTheme(nextTheme: ThemeMode) {
  document.documentElement.dataset.theme = nextTheme;
}

function ThemeIcon({ theme }: { theme: ThemeMode }) {
  if (theme === "dark") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23 5.46 5.46" />
    </svg>
  );
}

function NavAction({
  children,
  onClick,
  className = "",
  ariaExpanded,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaExpanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      className={`font-ui text-[11px] uppercase tracking-[0.22em] text-black/56 transition-colors duration-200 hover:text-black/84 ${className}`}
    >
      {children}
    </button>
  );
}

export function SiteNavbar() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<NavPanel>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const nextTheme: ThemeMode =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : mediaQuery.matches
          ? "dark"
          : "light";

    applyTheme(nextTheme);
    setTheme(nextTheme);
    setMounted(true);

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem(storageKey)) {
        return;
      }

      const systemTheme: ThemeMode = event.matches ? "dark" : "light";
      applyTheme(systemTheme);
      setTheme(systemTheme);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActivePanel(null);
      }
    };

    mediaQuery.addEventListener("change", handlePreferenceChange);
    window.addEventListener("keydown", handleEscape);

    return () => {
      mediaQuery.removeEventListener("change", handlePreferenceChange);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("resize", closeMenu);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  const togglePanel = (panel: Exclude<NavPanel, null>) => {
    setActivePanel((currentPanel) =>
      currentPanel === panel ? null : panel,
    );
    setMenuOpen(false);
  };

  const panelContent = activePanel ? panelCopy[activePanel] : null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="flex items-center transition-opacity duration-200 hover:opacity-75">
          <Image
            src="/logo.png"
            alt="PitchWorx"
            width={80}
            height={80}
            className="logo-adaptive h-[80px] w-[80px] object-contain"
            priority
          />
        </a>

        <nav className="hidden items-center gap-5 md:flex">
          <a
            href="mailto:hello@pitchworx.com?subject=Get%20Started"
            className="font-ui rounded-full bg-[#121212] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#FAFAFA] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Get Started
          </a>
          <NavAction
            onClick={() => togglePanel("pricing")}
            ariaExpanded={activePanel === "pricing"}
          >
            Pricing
          </NavAction>
          <a
            href="mailto:hello@pitchworx.com"
            className="font-ui text-[11px] uppercase tracking-[0.22em] text-black/56 transition-colors duration-200 hover:text-black/84"
          >
            Contact
          </a>
          <NavAction
            onClick={() => togglePanel("about")}
            ariaExpanded={activePanel === "about"}
          >
            About
          </NavAction>
          <NavAction
            onClick={() => togglePanel("login")}
            ariaExpanded={activePanel === "login"}
          >
            Login
          </NavAction>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white/78 px-3 py-2 font-ui text-[11px] uppercase tracking-[0.18em] text-black/62 shadow-[0_12px_30px_rgba(18,18,18,0.06)] backdrop-blur-md transition-colors duration-200 hover:text-black/84"
            aria-label={
              mounted
                ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
                : "Toggle theme"
            }
          >
            <ThemeIcon theme={theme} />
            <span>{mounted ? theme : "Theme"}</span>
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/78 text-black/62 shadow-[0_12px_30px_rgba(18,18,18,0.06)] backdrop-blur-md transition-colors duration-200 hover:text-black/84"
            aria-label={
              mounted
                ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
                : "Toggle theme"
            }
          >
            <ThemeIcon theme={theme} />
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
              setActivePanel(null);
            }}
            className="pointer-events-auto font-ui text-[11px] uppercase tracking-[0.22em] text-black/62 transition-colors duration-200 hover:text-black/84"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {panelContent ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto mx-auto mt-1 w-[min(92vw,24rem)] rounded-[1.75rem] border border-black/10 bg-white/84 p-5 shadow-[0_20px_60px_rgba(18,18,18,0.12)] backdrop-blur-xl"
          >
            <p className="font-ui text-[10px] uppercase tracking-[0.26em] text-black/42">
              {panelContent.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl leading-[0.92] tracking-[-0.04em] text-black/86">
              {panelContent.title}
            </h2>
            <p className="font-ui mt-4 text-sm leading-6 text-black/58">
              {panelContent.description}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto mx-5 rounded-[1.75rem] border border-black/10 bg-white/84 p-5 shadow-[0_20px_60px_rgba(18,18,18,0.12)] backdrop-blur-xl sm:mx-8 md:hidden"
          >
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@pitchworx.com?subject=Get%20Started"
                className="font-ui rounded-full bg-[#121212] px-4 py-3 text-center text-[11px] uppercase tracking-[0.22em] text-[#FAFAFA]"
              >
                Get Started
              </a>
              <button
                type="button"
                onClick={() => togglePanel("pricing")}
                className="font-ui text-left text-[11px] uppercase tracking-[0.22em] text-black/62"
              >
                Pricing
              </button>
              <a
                href="mailto:hello@pitchworx.com"
                className="font-ui text-[11px] uppercase tracking-[0.22em] text-black/62"
              >
                Contact
              </a>
              <button
                type="button"
                onClick={() => togglePanel("about")}
                className="font-ui text-left text-[11px] uppercase tracking-[0.22em] text-black/62"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => togglePanel("login")}
                className="font-ui text-left text-[11px] uppercase tracking-[0.22em] text-black/62"
              >
                Login
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
