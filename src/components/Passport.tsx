import { useState } from "react";
import { Map } from "mapbox-gl";
import "./Passport.css";

interface PassportProps {
  map: Map | null;
}

const Passport = ({ map }: PassportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flippedPages, setFlippedPages] = useState<Set<number>>(new Set());

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setFlippedPages(new Set());
    }
  };

  const handlePageClick = (e: React.MouseEvent, pageNum: number) => {
    if (!isOpen) return;
    e.stopPropagation();

    // Don't allow flipping first and last pages
    if (pageNum === 1 || pageNum === 6) return;

    setFlippedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNum)) {
        next.delete(pageNum);
      } else {
        next.add(pageNum);
      }
      return next;
    });
  };

  // Visited countries with coordinates
  const visitedCountries = [
    {
      code: "US",
      name: "USA",
      center: [-95.7129, 37.0902] as [number, number],
      zoom: 3,
    },
    {
      code: "GB",
      name: "UK",
      center: [-3.436, 55.3781] as [number, number],
      zoom: 5,
    },
    {
      code: "FR",
      name: "France",
      center: [2.2137, 46.2276] as [number, number],
      zoom: 5,
    },
    {
      code: "DE",
      name: "Germany",
      center: [10.4515, 51.1657] as [number, number],
      zoom: 5,
    },
    {
      code: "IT",
      name: "Italy",
      center: [12.5674, 41.8719] as [number, number],
      zoom: 5,
    },
    {
      code: "ES",
      name: "Spain",
      center: [-3.7492, 40.4637] as [number, number],
      zoom: 5,
    },
    {
      code: "JP",
      name: "Japan",
      center: [138.2529, 36.2048] as [number, number],
      zoom: 5,
    },
    {
      code: "AU",
      name: "Australia",
      center: [133.7751, -25.2744] as [number, number],
      zoom: 4,
    },
  ];

  const handleStampClick = (
    e: React.MouseEvent,
    country: (typeof visitedCountries)[0],
  ) => {
    e.stopPropagation();
    if (map) {
      map.easeTo({
        center: country.center,
        zoom: country.zoom,
        duration: 1500,
      });
    }
  };

  return (
    <div className={`book ${isOpen ? "open" : ""}`} onClick={handleClick}>
      <div className="back"></div>

      <div className="front">
        <div className="passport-text">
          <div className="globe-icon">🌍</div>
          <div className="passport-label">PASSPORT</div>
        </div>
      </div>

      <div
        className={`page1 ${flippedPages.has(1) ? "flipped" : ""}`}
        onClick={(e) => handlePageClick(e, 1)}
      >
        <div
          className="flag-stamp top-[12%] right-[18%]"
          onClick={(e) => handleStampClick(e, visitedCountries[6])}
        >
          <img
            src={`https://flagcdn.com/${visitedCountries[6]?.code.toLowerCase()}.svg`}
            alt={visitedCountries[6]?.name}
          />
          <span>{visitedCountries[6]?.name}</span>
        </div>
        <div
          className="flag-stamp top-[50%] left-[12%]"
          onClick={(e) => handleStampClick(e, visitedCountries[7])}
        >
          <img
            src={`https://flagcdn.com/${visitedCountries[7]?.code.toLowerCase()}.svg`}
            alt={visitedCountries[7]?.name}
          />
          <span>{visitedCountries[7]?.name}</span>
        </div>
      </div>

      <div
        className={`page2 ${flippedPages.has(2) ? "flipped" : ""}`}
        onClick={(e) => handlePageClick(e, 2)}
      >
        <div
          className="flag-stamp top-[20%] left-[20%]"
          onClick={(e) => handleStampClick(e, visitedCountries[4])}
        >
          <img
            src={`https://flagcdn.com/${visitedCountries[4]?.code.toLowerCase()}.svg`}
            alt={visitedCountries[4]?.name}
          />
          <span>{visitedCountries[4]?.name}</span>
        </div>
        <div
          className="flag-stamp top-[55%] right-[15%]"
          onClick={(e) => handleStampClick(e, visitedCountries[5])}
        >
          <img
            src={`https://flagcdn.com/${visitedCountries[5]?.code.toLowerCase()}.svg`}
            alt={visitedCountries[5]?.name}
          />
          <span>{visitedCountries[5]?.name}</span>
        </div>
      </div>

      <div
        className={`page3 ${flippedPages.has(3) ? "flipped" : ""}`}
        onClick={(e) => handlePageClick(e, 3)}
      ></div>

      <div
        className={`page4 ${flippedPages.has(4) ? "flipped" : ""}`}
        onClick={(e) => handlePageClick(e, 4)}
      ></div>

      <div
        className={`page5 ${flippedPages.has(5) ? "flipped" : ""}`}
        onClick={(e) => handlePageClick(e, 5)}
      >
        <div
          className="flag-stamp top-[15%] right-[15%]"
          onClick={(e) => handleStampClick(e, visitedCountries[2])}
        >
          <img
            src={`https://flagcdn.com/${visitedCountries[2]?.code.toLowerCase()}.svg`}
            alt={visitedCountries[2]?.name}
          />
          <span>{visitedCountries[2]?.name}</span>
        </div>
        <div
          className="flag-stamp top-[50%] left-[15%]"
          onClick={(e) => handleStampClick(e, visitedCountries[3])}
        >
          <img
            src={`https://flagcdn.com/${visitedCountries[3]?.code.toLowerCase()}.svg`}
            alt={visitedCountries[3]?.name}
          />
          <span>{visitedCountries[3]?.name}</span>
        </div>
      </div>

      <div
        className={`page6 ${flippedPages.has(6) ? "flipped" : ""}`}
        onClick={(e) => handlePageClick(e, 6)}
      >
        <div
          className="flag-stamp top-[10%] left-[15%]"
          onClick={(e) => handleStampClick(e, visitedCountries[0])}
        >
          <img
            src={`https://flagcdn.com/${visitedCountries[0]?.code.toLowerCase()}.svg`}
            alt={visitedCountries[0]?.name}
          />
          <span>{visitedCountries[0]?.name}</span>
        </div>
        <div
          className="flag-stamp top-[45%] right-[20%]"
          onClick={(e) => handleStampClick(e, visitedCountries[1])}
        >
          <img
            src={`https://flagcdn.com/${visitedCountries[1]?.code.toLowerCase()}.svg`}
            alt={visitedCountries[1]?.name}
          />
          <span>{visitedCountries[1]?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Passport;
