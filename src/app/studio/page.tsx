import { Suspense } from "react";
import StudioLanding from "@/components/studio/StudioLanding";

export const metadata = {
  title: "Studio — PitchWorx",
};

// StudioLanding uses useSearchParams which requires Suspense
export default function StudioPage() {
  return (
    <Suspense>
      <StudioLanding />
    </Suspense>
  );
}
