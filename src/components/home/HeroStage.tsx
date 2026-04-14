"use client";

/**
 * HeroStage — 3-phase animated card gallery
 *
 * Phase 1 (0 → ~1200ms)
 *   A single lead card enters from below with a spring that has slight
 *   overshoot (low damping). Represents the "arrival" beat.
 *
 * Phase 2 (~1200ms → ~2200ms)
 *   Lead card rests at center. ~800ms of intentional pause — editorial pacing.
 *
 * Phase 3 (~2200ms → ∞)
 *   Lead card fades out; 7 gallery cards fan into a horizontal arc using
 *   positions from getArcStyle(). Stagger delay creates a spreading motion.
 *   Mouse parallax and card hover interactions activate in this phase.
 *
 * Accessibility: prefers-reduced-motion skips phases 1–2 and jumps straight
 * to the static arc (phase 3, no stagger, no parallax).
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import hiringImage from "../../../placeholder_images/327439864_0e229c72-bb61-410d-9ccc-83676217513d-scaled.png";
import beatoImage from "../../../placeholder_images/PW_Mockup_1-scaled.png";
import reebloImage from "../../../placeholder_images/Picture11.png";
import craftImage from "../../../placeholder_images/psd-2-scaled.png";

import { getArcStyle } from "./arc-layout";
import { ProjectCard, type ProjectCardData } from "./project-card";

// ─── Data ──────────────────────────────────────────────────────────────────────

const leadProject: ProjectCardData = {
  id: "lead",
  title: "Selected Work",
  eyebrow: "Launch archive",
  image: beatoImage,
  alt: "BeatO presentation mockup laid out across a dark canvas.",
};

const galleryProjects: ProjectCardData[] = [
  {
    id: "hiring",
    title: "Hiring",
    eyebrow: "Campaign system",
    image: hiringImage,
    alt: "Blue hiring campaign boards arranged in a large presentation mosaic.",
  },
  {
    id: "beato",
    title: "BeatO",
    eyebrow: "Product story",
    image: beatoImage,
    alt: "BeatO product deck with portrait and surrounding product slides.",
  },
  {
    id: "reeblo",
    title: "Reeblo",
    eyebrow: "Partner deck",
    image: reebloImage,
    alt: "Reeblo vendor partner deck slides on a white presentation board.",
  },
  {
    id: "craft",
    title: "Craft",
    eyebrow: "Packaging story",
    image: craftImage,
    alt: "Craft Juices lime presentation slide with layered fruit photography.",
  },
  {
    id: "indeed",
    title: "Indeed",
    eyebrow: "Rollout frames",
    image: hiringImage,
    alt: "A branded Indeed campaign layout with large blue circular graphics.",
  },
  {
    id: "platform",
    title: "Platform",
    eyebrow: "Deck system",
    image: beatoImage,
    alt: "Healthcare presentation mockups with portrait and product UI.",
  },
  {
    id: "brand",
    title: "Brand",
    eyebrow: "Identity system",
    image: reebloImage,
    alt: "Brand identity slides with a clean editorial layout.",
  },
];

const TOTAL = galleryProjects.length; // 7
const CENTER_INDEX = Math.floor(TOTAL / 2); // 3

// ─── Spring configs ─────────────────────────────────────────────────────────────

/** Smooth entry for the lead card — higher damping removes bounce */
const springEntry = { type: "spring", stiffness: 90, damping: 22 } as const;

/** Crisp arc landing for gallery cards (phase 3) */
const springGallery = { type: "spring", stiffness: 100, damping: 20 } as const;

/** Slow-follow for mouse parallax */
const springParallax = { type: "spring", stiffness: 60, damping: 20 } as const;

// ─── Component ─────────────────────────────────────────────────────────────────

type Phase = 1 | 2 | 3;

export function HeroStage() {
  const [phase, setPhase] = useState<Phase>(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 }); // normalised −1 … +1
  const reduceMotion = useReducedMotion();

  // ── Phase sequencing ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduceMotion) {
      // Skip intro — show final arc immediately
      setPhase(3);
      return;
    }

    const t1 = window.setTimeout(() => setPhase(2), 700);  // entry → pause
    const t2 = window.setTimeout(() => setPhase(3), 1400); // pause → arc

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduceMotion]);

  // ── Mouse parallax ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduceMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
        y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [reduceMotion]);

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
            <ProjectCard
              project={leadProject}
              isCenter
              priority
              className="-translate-x-1/2 -translate-y-1/2"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase 3: Arc gallery ────────────────────────────────────────────────
          7 cards fan out from center into a horizontal arc. Each card gets:
          - Arc position from getArcStyle() (vw/vh, responsive)
          - Stagger delay so cards spread sequentially
          - Continuous float oscillation (staggered per card, organic feel)
          - Mouse parallax offset on an inner wrapper (px, slow-follow spring)
          - Hover: scale 1.05 + blur for non-hovered siblings
          - Drag: horizontal swipe to pan the arc on mobile */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            drag="x"
            dragConstraints={{ left: -160, right: 160 }}
            dragElastic={0.12}
            dragMomentum
            dragTransition={{ bounceStiffness: 200, bounceDamping: 30 }}
            onDragStart={() => setHoveredId(null)}
            className="absolute inset-0"
          >
            {galleryProjects.map((project, index) => {
              const arc = getArcStyle(index, TOTAL);
              const isCenter = index === CENTER_INDEX;
              const isHovered = hoveredId === project.id;
              const isBlurred = hoveredId !== null && !isHovered;

              // Parallax depth: center cards follow mouse more, edges less
              const depth = 1 - Math.abs(index - CENTER_INDEX) / TOTAL;
              const pX = reduceMotion ? 0 : mouse.x * 6 * depth;
              const pY = reduceMotion ? 0 : mouse.y * 4 * depth;

              return (
                <motion.div
                  key={project.id}
                  // Arc position — starts collapsed at center, expands to arc
                  initial={{ x: 0, y: 0, rotate: 0, scale: 0.6, opacity: 0 }}
                  animate={{
                    x: arc.x,
                    y: arc.y,
                    rotate: arc.rotate,
                    scale: arc.scale,
                    opacity: 1,
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 0.6,
                    opacity: 0,
                    transition: { duration: 0.16 },
                  }}
                  transition={{
                    ...springGallery,
                    delay: reduceMotion ? 0 : index * 0.06,
                  }}
                  style={{
                    willChange: "transform",
                    zIndex: arc.zIndex,
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                  }}
                  onHoverStart={() => setHoveredId(project.id)}
                  onHoverEnd={() => setHoveredId(null)}
                >
                  {/* Float oscillation — looping y bobble, staggered per card */}
                  <motion.div
                    animate={reduceMotion ? {} : { y: [0, -10, 0] }}
                    transition={{
                      duration: 2.6 + index * 0.22,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.35,
                    }}
                    style={{ willChange: "transform" }}
                  >
                    {/* Parallax + hover scale + sibling blur */}
                    <motion.div
                      animate={{
                        x: pX,
                        y: pY,
                        scale: isHovered ? 1.05 : 1,
                        filter: isBlurred ? "blur(3px)" : "blur(0px)",
                      }}
                      transition={{
                        x: springParallax,
                        y: springParallax,
                        scale: { type: "spring", stiffness: 300, damping: 20 },
                        filter: { duration: 0.2 },
                      }}
                      style={{ willChange: "transform" }}
                    >
                      <ProjectCard
                        project={project}
                        isCenter={isCenter}
                        className="-translate-x-1/2 -translate-y-1/2"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
