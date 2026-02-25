import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Nameplate from "./Nameplate";
import ExpandedPhotoView from "./ExpandedPhotoView";
import type { Photo } from "../types/photo";
import { usePhotosMap } from "../hooks/usePhotosMap";
import { isMobile } from "react-device-detect";

const App = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [expandedPhoto, setExpandedPhoto] = useState<Photo | null>(null);
  const [clusterPhotos, setClusterPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [popupStartPosition, setPopupStartPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const { longPressHandlers } = usePhotosMap({
    mapContainerRef,
    setExpandedPhoto,
    setClusterPhotos,
    setCurrentPhotoIndex,
    setPopupStartPosition,
  });

  const handleCloseExpandedPhoto = () => {
    setExpandedPhoto(null);
    setClusterPhotos([]);
    setCurrentPhotoIndex(0);
    setPopupStartPosition(null);
  };

  const handlePhotoIndexChange = (index: number) => {
    if (clusterPhotos.length > 0) {
      const clamped = Math.max(0, Math.min(index, clusterPhotos.length - 1));
      setCurrentPhotoIndex(clamped);
      setExpandedPhoto(clusterPhotos[clamped]);
    }
  };

  return (
    <div className="h-full w-full p-0 sm:p-5">
      <Nameplate />

      {/* Expanded photo overlay */}
      <AnimatePresence>
        {expandedPhoto && (
          <ExpandedPhotoView
            photo={expandedPhoto}
            startPosition={popupStartPosition}
            clusterPhotos={clusterPhotos}
            currentIndex={currentPhotoIndex}
            onClose={handleCloseExpandedPhoto}
            onIndexChange={handlePhotoIndexChange}
          />
        )}
      </AnimatePresence>

      <div className="h-full outerBevel">
        <div className="h-full flatSurface">
          <div className="h-full innerBevel">
            <div
              className="w-full h-full map"
              ref={mapContainerRef}
              {...(isMobile ? longPressHandlers : {})}
            />
          </div>
        </div>

        {/* <div className="absolute bottom-8 sm:bottom-15 left-8 sm:left-15 z-50">
          <ZoomControls />
        </div> */}

        {/* <div className="absolute bottom-12 right-12 z-50">
          <Book map={map} />
        </div> */}
      </div>
    </div>
  );
};

export default App;
