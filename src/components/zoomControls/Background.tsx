import type { PropsWithChildren } from "react";

const Background = ({ children }: PropsWithChildren) => {
  return (
    <div
      style={{
        width: "350px",
        height: "260px",
        position: "relative",
        border: "1px solid",
        // borderImage:
        //   "repeating-linear-gradient(45deg, #3d2817 0px, #3d2817 8px, #6b5438 8px, #6b5438 16px, #3d2817 16px, #3d2817 24px) 6",
        background: "#f5f1e8",
        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
      }}
    >
      {/* Parchment background with gradient */}
      <div
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
          right: "5px",
          bottom: "5px",
          background:
            "radial-gradient(circle at 50% 50%, #d9e8f5 0%, #a8c5dd 50%, #7a9fb8 100%)",
          backgroundSize: "130% 130%",
          backgroundPosition: "center",
          border: "1px solid var(--earth-button-stroke, #8b6f47)",
          filter: "contrast(1.1) brightness(0.98)",
        }}
      >
        {/* Noise overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.25'/%3E%3C/svg%3E")`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Grid lines container */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        >
          {/* Horizontal lines */}
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((topPct) => {
            // Calculate opacity: stronger at edges (0%, 100%), weaker at center (50%)
            const distanceFromCenter = Math.abs(50 - topPct) / 50;
            const baseOpacity = 0.08 + distanceFromCenter * 0.12;

            return (
              <div
                key={`h-${topPct}`}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${topPct}%`,
                  height: "0.5px",
                  background: "var(--earth-button-stroke, #8b6f47)",
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
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${leftPct}%`,
                  width: "0.5px",
                  background: "var(--earth-button-stroke, #8b6f47)",
                  opacity: baseOpacity,
                }}
              />
            );
          })}
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
      </div>
    </div>
  );
};

export default Background;
