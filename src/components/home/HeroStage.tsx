"use client";

/**
 * HeroStage — 3-phase animated card gallery
 *
 * Phase 1 (0 → ~700ms)
 *   Lead card springs in from below.
 *
 * Phase 2 (~700ms → ~1400ms)
 *   Lead card rests at center — editorial pause.
 *
 * Phase 3 (~1400ms → ∞)
 *   Lead card fades; 7 gallery cards fan into a horizontal arc.
 *
 *   Desktop  — mouse hover highlights a card (scale 1.05, siblings blur).
 *   Mobile   — swipe left/right cycles the highlight through the arc.
 *              The arc itself never pans; only the focus moves.
 *
 * Accessibility: prefers-reduced-motion skips to phase 3 immediately.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import hiringImage from "../../../placeholder_images/327439864_0e229c72-bb61-410d-9ccc-83676217513d-scaled.png";
import beatoImage from "../../../placeholder_images/PW_Mockup_1-scaled.png";
import reebloImage from "../../../placeholder_images/Picture11.png";
import craftImage from "../../../placeholder_images/psd-2-scaled.png";

import { getArcStyle } from "./arc-layout";
import { ProjectCard, type ProjectCardData } from "./project-card";
import { SegmentedToggle, type ToggleTab } from "./SegmentedToggle";

// ─── Data ──────────────────────────────────────────────────────────────────────

const leadProject: ProjectCardData = {
  id: "lead",
  title: "Selected Work",
  eyebrow: "Launch archive",
  image: beatoImage,
  alt: "BeatO presentation mockup laid out across a dark canvas.",
};

const galleryProjects: ProjectCardData[] = [
  { id: "hiring",   title: "Hiring",   eyebrow: "Campaign system",  image: hiringImage, alt: "Blue hiring campaign boards." },
  { id: "beato",    title: "BeatO",    eyebrow: "Product story",    image: beatoImage,  alt: "BeatO product deck." },
  { id: "reeblo",   title: "Reeblo",   eyebrow: "Partner deck",     image: reebloImage, alt: "Reeblo vendor deck slides." },
  { id: "craft",    title: "Craft",    eyebrow: "Packaging story",  image: craftImage,  alt: "Craft Juices presentation." },
  { id: "indeed",   title: "Indeed",   eyebrow: "Rollout frames",   image: hiringImage, alt: "Indeed campaign layout." },
  { id: "platform", title: "Platform", eyebrow: "Deck system",      image: beatoImage,  alt: "Healthcare presentation mockups." },
  { id: "brand",    title: "Brand",    eyebrow: "Identity system",  image: reebloImage, alt: "Brand identity slides." },
];

const TOTAL        = galleryProjects.length;     // 7
const CENTER_INDEX = Math.floor(TOTAL / 2);      // 3

// ─── Spring configs ────────────────────────────────────────────────────────────

const springEntry   = { type: "spring", stiffness: 90,  damping: 22 } as const;
const springGallery = { type: "spring", stiffness: 100, damping: 20 } as const;
const springParallax= { type: "spring", stiffness: 60,  damping: 20 } as const;

// ─── Component ─────────────────────────────────────────────────────────────────

type Phase = 1 | 2 | 3;

export function HeroStage() {
  const [phase,      setPhase]      = useState<Phase>(1);
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [swipeIndex, setSwipeIndex] = useState<number | null>(null);
  const [mouse,      setMouse]      = useState({ x: 0, y: 0 });
  const [activeTab,  setActiveTab]  = useState<ToggleTab>("Custom");
  const reduceMotion = useReducedMotion();

  // The "active" card: mouse hover takes priority, then touch swipe focus
  const activeId = hoveredId ?? (swipeIndex !== null ? galleryProjects[swipeIndex].id : null);

  // ── Phase sequencing ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduceMotion) { setPhase(3); return; }
    const t1 = window.setTimeout(() => setPhase(2), 700);
    const t2 = window.setTimeout(() => setPhase(3), 1400);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [reduceMotion]);

  // ── Mouse parallax (desktop) ──────────────────────────────────────────────────
  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => setMouse({
      x: (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2),
      y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
    });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);

  // ── Swipe handler (mobile) ────────────────────────────────────────────────────
  // The drag container has near-zero elastic so the arc stays visually still.
  // The gesture is read for direction only; focus advances through galleryProjects.
  function handleArcSwipe(_: unknown, info: { offset: { x: number } }) {
    const threshold = 40;
    if (Math.abs(info.offset.x) < threshold) return;

    setSwipeIndex((prev) => {
      const current = prev ?? CENTER_INDEX;
      if (info.offset.x < 0) return Math.max(current - 1, 0);          // swipe left  → prev (left card)
      return Math.min(current + 1, TOTAL - 1);                          // swipe right → next (right card)
    });
  }

  return (
    <div className="relative h-full w-full">

      {/* ── Phase 1 & 2: Lead card ──────────────────────────────────────────────
          Enters from bottom (phase 1), rests at center (phase 2), then exits. */}
      <AnimatePresence>
        {phase !== 3 && (
          <motion.div
            key="lead-card"
            initial={{ y: "100vh", scale: 0.88, rotate: -4, opacity: 0.96 }}
            animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.72, opacity: 0, transition: { duration: 0.2 } }}
            transition={springEntry}
            style={{ willChange: "transform", zIndex: 20 }}
            className="absolute left-1/2 top-1/2"
          >
            <ProjectCard project={leadProject} isCenter priority className="-translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase 3: Arc gallery ────────────────────────────────────────────────
          Always rendered as an arc (desktop + mobile).
          Desktop: mouse hover sets the active card.
          Mobile: swipe on the invisible drag layer cycles activeId through the arc. */}
      <AnimatePresence>
        {phase === 3 && (
          <>
            {/* Invisible drag surface — mobile swipe to cycle highlight.
                dragElastic is near-zero so the arc never visually shifts. */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.04}
              dragMomentum={false}
              onDragEnd={handleArcSwipe}
              className="absolute inset-0 z-30 touch-pan-y md:pointer-events-none"
              aria-hidden
            />

            {galleryProjects.map((project, index) => {
              const arc      = getArcStyle(index, TOTAL);
              const isCenter = index === CENTER_INDEX;
              const isActive = activeId === project.id;
              const isBlurred= activeId !== null && !isActive;

              const depth = 1 - Math.abs(index - CENTER_INDEX) / TOTAL;
              const pX = reduceMotion ? 0 : mouse.x * 6 * depth;
              const pY = reduceMotion ? 0 : mouse.y * 4 * depth;

              return (
                <motion.div
                  key={project.id}
                  // Arc position wrapper — pointer-events:none so it never
                  // intercepts hover; only the innermost card surface does.
                  // z-index boosts to 30 when active so the card visually
                  // rises above all siblings once hover is triggered.
                  initial={{ x: 0, y: 0, rotate: 0, scale: 0.6, opacity: 0 }}
                  animate={{ x: arc.x, y: arc.y, rotate: arc.rotate, scale: arc.scale, opacity: 1 }}
                  exit={{ x: 0, y: 0, rotate: 0, scale: 0.6, opacity: 0, transition: { duration: 0.16 } }}
                  transition={{ ...springGallery, delay: reduceMotion ? 0 : index * 0.06 }}
                  style={{
                    willChange: "transform",
                    zIndex: isActive ? 30 : arc.zIndex,
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    pointerEvents: "none",   // transparent — let events reach the card surface
                  }}
                >
                  {/* Float oscillation — also transparent to pointer events */}
                  <motion.div
                    animate={reduceMotion ? {} : { y: [0, -10, 0] }}
                    transition={{ duration: 2.6 + index * 0.22, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 }}
                    style={{ willChange: "transform", pointerEvents: "none" }}
                  >
                    {/* Parallax + active scale + sibling blur.
                        THIS is the hit surface — pointer-events:auto here only.
                        Using native onMouseEnter/Leave instead of Framer Motion
                        onHoverStart/End for reliable cross-browser hit detection. */}
                    <motion.div
                      animate={{
                        x: pX,
                        y: pY,
                        scale: isActive ? 1.05 : 1,
                        filter: isBlurred ? "blur(3px)" : "blur(0px)",
                      }}
                      transition={{
                        x: springParallax,
                        y: springParallax,
                        scale:  { type: "spring", stiffness: 300, damping: 20 },
                        filter: { duration: 0.2 },
                      }}
                      style={{ willChange: "transform", pointerEvents: "auto", cursor: "pointer" }}
                      onMouseEnter={() => setHoveredId(project.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <ProjectCard project={project} isCenter={isCenter} className="-translate-x-1/2 -translate-y-1/2" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
            {/* ── Segmented toggle — floats below the arc ────────────────────────
                Fades + slides in after cards are fully spread (0.55s delay).
                z-index 5 keeps it above the background but below card stack. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, transition: { duration: 0.16 } }}
              transition={{
                opacity: { duration: 0.4, delay: reduceMotion ? 0 : 0.55 },
                y:       { type: "spring", stiffness: 120, damping: 18, delay: reduceMotion ? 0 : 0.55 },
              }}
              style={{
                position:  "absolute",
                bottom:    "12%",
                left:      "50%",
                transform: "translateX(-50%)",
                zIndex:    5,
              }}
              className="sm:bottom-[14%]"
            >
              <SegmentedToggle activeTab={activeTab} onChange={setActiveTab} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
