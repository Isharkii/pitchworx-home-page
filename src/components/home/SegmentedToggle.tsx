"use client";

import { motion } from "framer-motion";

export type ToggleTab = "Custom" | "AI";

type SegmentedToggleProps = {
  activeTab: ToggleTab;
  onChange: (tab: ToggleTab) => void;
};

const TABS: ToggleTab[] = ["Custom", "AI"];

export function SegmentedToggle({ activeTab, onChange }: SegmentedToggleProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex cursor-pointer items-center gap-[3px] rounded-full bg-[#EDEDED] p-[5px]"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className="relative min-h-[34px] min-w-[72px] rounded-full px-5 py-[10px] text-[13px] font-medium leading-none"
          >
            {/* Sliding active pill */}
            {isActive && (
              <motion.span
                layoutId="segment-pill"
                className="absolute inset-0 rounded-full bg-black shadow-[0_2px_10px_rgba(0,0,0,0.22)]"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <span
              className={`relative z-10 select-none transition-colors duration-200 ${
                isActive ? "text-white" : "text-black/60"
              }`}
            >
              {tab}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
