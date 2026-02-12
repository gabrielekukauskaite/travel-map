import type { PropsWithChildren } from "react";

const Background = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-[350px] h-[260px] relative border border-solid shadow-[0_0_15px_var(--shadow-dark)] bg-[var(--background-light)]">
      {/* Parchment background with gradient */}
      <div className="absolute top-[5px] left-[5px] right-[5px] bottom-[5px] border border-[var(--brown-light)] contrast-[1.1] brightness-[0.98] bg-[radial-gradient(circle_at_50%_50%,var(--blue-light)_0%,var(--blue-medium)_50%,var(--blue-dark)_100%)] [background-size:130%_130%] [background-position:center]">
        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.25'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Grid lines container */}
        <div className="absolute inset-0 z-[1]">
          {/* Horizontal lines */}
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((topPct) => {
            // Calculate opacity: stronger at edges (0%, 100%), weaker at center (50%)
            const distanceFromCenter = Math.abs(50 - topPct) / 50;
            const baseOpacity = 0.08 + distanceFromCenter * 0.12;

            return (
              <div
                key={`h-${topPct}`}
                className="absolute left-0 right-0 h-[0.5px] bg-[var(--brown-light)]"
                style={{
                  top: `${topPct}%`,
                  opacity: baseOpacity,
                }}
              />
            );
          })}

          {/* Vertical lines */}
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((leftPct) => {
            // Calculate opacity: stronger at edges, weaker at center
            const distanceFromCenter = Math.abs(50 - leftPct) / 50;
            const baseOpacity = 0.08 + distanceFromCenter * 0.12;

            return (
              <div
                key={`v-${leftPct}`}
                className="absolute top-0 bottom-0 w-[0.5px] bg-[var(--brown-light)]"
                style={{
                  left: `${leftPct}%`,
                  opacity: baseOpacity,
                }}
              />
            );
          })}
        </div>
        <div className="relative z-[2]">{children}</div>
      </div>
    </div>
  );
};

export default Background;
