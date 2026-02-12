import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { useRef, useState } from "react";
import Nameplate from "./Nameplate";
import ZoomControls from "./zoomControls/ZoomControls";
import ExpandedPhotoView from "./ExpandedPhotoView";
import type { Photo } from "../types/photo";
import { usePhotosMap } from "../hooks/usePhotosMap";

const App = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [expandedPhoto, setExpandedPhoto] = useState<Photo | null>(null);
  const [clusterPhotos, setClusterPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPhotoAnimating, setIsPhotoAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [popupStartPosition, setPopupStartPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  usePhotosMap({
    mapContainerRef,
    setExpandedPhoto,
    setClusterPhotos,
    setCurrentPhotoIndex,
    setIsPhotoAnimating,
    setPopupStartPosition,
  });

  const handleCloseExpandedPhoto = () => {
    // Trigger fade out animation
    setIsClosing(true);

    // Wait for animation to complete before removing
    setTimeout(() => {
      setExpandedPhoto(null);
      setClusterPhotos([]);
      setCurrentPhotoIndex(0);
      setIsPhotoAnimating(false);
      setIsClosing(false);
      setPopupStartPosition(null);
    }, 300); // Faster fade out
  };

  const handlePhotoIndexChange = (index: number) => {
    if (clusterPhotos.length > 0) {
      const clamped = Math.max(0, Math.min(index, clusterPhotos.length - 1));
      setCurrentPhotoIndex(clamped);
      setExpandedPhoto(clusterPhotos[clamped]);
    }
  };

  return (
    <div className="h-full w-full p-2 sm:p-5">
      <Nameplate />

      {/* Expanded photo overlay */}
      {expandedPhoto && (
        <ExpandedPhotoView
          photo={expandedPhoto}
          isAnimating={isPhotoAnimating}
          isClosing={isClosing}
          startPosition={popupStartPosition}
          clusterPhotos={clusterPhotos}
          currentIndex={currentPhotoIndex}
          onClose={handleCloseExpandedPhoto}
          onIndexChange={handlePhotoIndexChange}
        />
      )}

      <div className="h-full outerBevel">
        <div className="h-full flatSurface">
          <div className="h-full innerBevel">
            <div className="w-full h-full map" ref={mapContainerRef} />
          </div>
        </div>

        <div className="absolute bottom-15 left-15 z-50">
          <ZoomControls />
        </div>

        {/* <div className="absolute bottom-12 right-12 z-50">
          <Book map={map} />
        </div> */}
      </div>
    </div>
  );
};

export default App;
