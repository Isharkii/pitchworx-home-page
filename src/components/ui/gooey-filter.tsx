import { memo } from "react";

// memo: strength only changes on viewport resize — not on every StudioLanding
// state change (hover, tab switch, generation). Without memo this SVG rerenders
// on every parent render even though its output never changes in practice.
const GooeyFilter = memo(function GooeyFilter({
  id = "goo-filter",
  strength = 10,
}: {
  id?: string;
  strength?: number;
}) {
  return (
    <svg className="absolute hidden">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
});

export { GooeyFilter };
