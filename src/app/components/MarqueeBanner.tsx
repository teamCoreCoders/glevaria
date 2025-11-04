// components/MarqueeBanner.tsx
// Next.js + Tailwind marquee banner matching the shared UI
import React from "react";

type Props = {
  text?: string;           // default content
  repeat?: number;         // times to repeat per track
  speedSec?: number;       // animation duration
  gapRem?: number;         // gap between repeats
  direction?: "left" | "right";
  className?: string;      // extra classes
};

export default function MarqueeBanner({
  text = "New Arrivals Every Week",
  repeat = 10,
  speedSec = 18,
  gapRem = 1.1,          // ~36px
  direction = "left",
  className = "",
}: Props) {
  const items = Array.from({ length: repeat }).map((_, i) => (
    <span key={i} className="mx-0">
      {text}
    </span>
  ));

  // custom properties control speed and gap; direction via class
  return (
    <section
      className={[
        "relative w-full overflow-hidden bg-black text-white",
        "select-none",
        className,
      ].join(" ")}
      style={
        {
          // @ts-ignore
          "--speed": `${speedSec}s`,
          "--gap": `${gapRem}rem`,
        } as React.CSSProperties
      }
      aria-label="Marquee banner"
    >
      <div className="marquee-track">
        <div className={`marquee-lane ${direction === "right" ? "dir-right" : "dir-left"}`}>
          {items}
        </div>
        <div aria-hidden className={`marquee-lane ${direction === "right" ? "dir-right" : "dir-left"}`}>
          {items}
        </div>
      </div>
    </section>
  );
}
