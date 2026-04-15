"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";

const stats = [
  { value: "13+",     label: "Years of experience"   },
  { value: "150K+",   label: "Slides created"         },
  { value: "500+",    label: "Clients worldwide"       },
  { value: "100%",    label: "On-brand, every time"   },
];

export default function AboutLanding() {
  return (
    <AuroraBackground
      showRadialGradient
      className="h-[100dvh] w-screen overflow-hidden !bg-[var(--background)] text-[var(--foreground)]"
    >
      {/* Paper grid */}
      <div aria-hidden className="bg-paper-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Bloom — top left */}
      <div aria-hidden className="pointer-events-none absolute left-[-8%] top-[-10%] h-[clamp(12rem,26vw,28rem)] w-[clamp(12rem,26vw,28rem)] rounded-full bg-[var(--spot-b)] opacity-40 blur-3xl" />
      {/* Bloom — bottom right */}
      <div aria-hidden className="pointer-events-none absolute bottom-[-12%] right-[-6%] h-[clamp(10rem,20vw,22rem)] w-[clamp(10rem,20vw,22rem)] rounded-full bg-[var(--spot-a)] opacity-40 blur-3xl" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-6 sm:px-10 md:px-16">
        <div className="w-full max-w-[860px]">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06, ease: "easeOut" }}
            className="font-ui text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]"
          >
            About PitchWorx
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
            className="font-display mt-4 text-[2.4rem] leading-[0.88] tracking-[-0.03em] text-[var(--foreground)] sm:text-[3.2rem] md:text-[4rem]"
          >
            We bring the oomph
            <br />
            your presentations need.
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
            className="mt-8 h-px w-full bg-[var(--line)]"
          />

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
            className="font-ui mt-8 max-w-[600px] text-[14px] leading-[1.75] text-[var(--muted)] sm:text-[15px] md:text-[16px]"
          >
            As a leading presentation design agency, PitchWorx crafts visually
            compelling and engaging slides for some of the world&apos;s most
            ambitious brands. Our expert PowerPoint designers combine strategic
            storytelling with precision craft — every deck is built to inform,
            persuade, and leave a lasting impression.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44, ease: "easeOut" }}
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-0"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.48 + i * 0.07, ease: "easeOut" }}
                className="flex flex-col gap-1"
              >
                <span className="font-display text-[2rem] leading-none tracking-[-0.03em] text-[var(--foreground)] sm:text-[2.4rem]">
                  {stat.value}
                </span>
                <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </AuroraBackground>
  );
}
