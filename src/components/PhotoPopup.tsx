import { useState } from "react";
import { createRoot } from "react-dom/client";
import LocationIcon from "./icons/LocationIcon";
import CalendarIcon from "./icons/CalendarIcon";
import type { Photo } from "../types/photo";

interface PhotoPopupProps {
  photo: Photo;
}

const PhotoPopup = ({
  photo: { url, title, date, description, orientation },
}: PhotoPopupProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="border border-black p-2 group"
      style={{ background: "var(--background-light)" }}
    >
      <div
        className="border border-[var(--brown-light)] relative overflow-hidden transition-all duration-300"
        style={{
          width: isExpanded
            ? orientation === "portrait"
              ? "533px"
              : "800px"
            : orientation === "portrait"
              ? "333px"
              : "500px",
          height: isExpanded
            ? orientation === "portrait"
              ? "800px"
              : "533px"
            : orientation === "portrait"
              ? "500px"
              : "333px",
        }}
      >
        <img
          src={url}
          alt={title || "Photo"}
          className={`w-full h-full  ${
            isExpanded ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        />
        <div
          className="absolute bottom-0 left-0 right-0 border-t border-[var(--gold-border-light)] px-4 py-3 flex justify-between items-center gap-3"
          style={{
            background:
              "linear-gradient(to top, var(--parchment-overlay-1) 0%, var(--parchment-overlay-2) 100%)",
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h6
                className="text-sm font-bold text-[var(--brown-dark)] font-serif m-0 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1.5"
                style={{
                  textShadow: "0 1px 2px var(--white-highlight-strong)",
                }}
              >
                <LocationIcon className="w-3.5 h-3.5 flex-shrink-0" />
                {title || "Untitled Location"}
              </h6>
              {date && (
                <div className="text-sm text-[var(--brown-medium)] font-serif whitespace-nowrap flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "short",
                    day: "2-digit",
                  })}
                </div>
              )}
            </div>

            <p
              className={`text-xs text-[var(--brown-medium)] font-serif m-0 mt-1 overflow-hidden transition-all duration-300 ${
                isExpanded ? "max-h-20" : "max-h-0"
              }`}
              style={{
                textShadow: "0 1px 2px var(--white-highlight-strong)",
              }}
            >
              {description ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque maximus elit vitae purus cursus, quis rhoncus purus cursus."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const createPhotoPopupElement = (
  props: PhotoPopupProps,
): HTMLElement => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<PhotoPopup {...props} />);
  return container;
};
