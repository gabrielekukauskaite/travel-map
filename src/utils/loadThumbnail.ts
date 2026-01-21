const imageUrlCache = new Map<string, HTMLImageElement>();
const loadingImages = new Set<string>();

export const loadThumbnail = (
  map: mapboxgl.Map,
  id: string,
  url: string,
  count?: number,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (map.hasImage(id)) return resolve();
    if (loadingImages.has(id)) return resolve(); // Already being loaded

    loadingImages.add(id);

    const cachedImg = imageUrlCache.get(url);

    const processImage = (img: HTMLImageElement) => {
      const size = 64;
      const borderWidth = size * 0.05;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return reject(new Error("Could not get canvas context"));
      }

      // 1. Draw the circular photo with its borders
      const brownBorderWidth = borderWidth * 0.4;
      const imageRadius = size / 2 - borderWidth / 2 - brownBorderWidth;

      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, imageRadius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();

      // Inner white border
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, imageRadius, 0, Math.PI * 2, true);
      ctx.strokeStyle = "white";
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // Outer brown border (adjacent to white border)
      ctx.beginPath();
      ctx.arc(
        size / 2,
        size / 2,
        imageRadius + borderWidth / 2 + brownBorderWidth / 2,
        0,
        Math.PI * 2,
        true,
      );
      ctx.strokeStyle = "#8b6f47"; // --brown-light
      ctx.lineWidth = brownBorderWidth;
      ctx.stroke();

      // 2. If a count is provided, draw the count circle and text
      if (count && count > 1) {
        const circleRadius = size * 0.2; // Slightly smaller
        const shadowPadding = 2.5; // Minimal padding for shadow
        const circleX = size - circleRadius - shadowPadding;
        const circleY = circleRadius + shadowPadding;

        // Outer shadow for depth (reduced for positioning)
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // Draw brown background circle
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#6b5438"; // --brown-medium
        ctx.fill();

        // Reset shadow for border
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw gold/cream border
        ctx.strokeStyle = "#f5ead4"; // --parchment-light
        ctx.lineWidth = borderWidth * 0.8;
        ctx.stroke();

        // Outer brown border (thin accent)
        const creamBorderWidth = borderWidth * 0.8;
        const brownCircleBorder = borderWidth * 0.3;
        ctx.beginPath();
        ctx.arc(
          circleX,
          circleY,
          circleRadius + creamBorderWidth / 2 + brownCircleBorder / 2,
          0,
          2 * Math.PI,
        );
        ctx.strokeStyle = "#8b6f47"; // --brown-light
        ctx.lineWidth = brownCircleBorder;
        ctx.stroke();

        // Inner darker ring for depth
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius * 0.85, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw count text
        ctx.fillStyle = "#f5ead4"; // --parchment-light
        ctx.font = `bold ${size * 0.22}px "Georgia", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(count.toString(), circleX, circleY);
      }

      const imageData = ctx.getImageData(0, 0, size, size);
      map.addImage(id, imageData);
      loadingImages.delete(id);
      resolve();
    };

    if (cachedImg) {
      processImage(cachedImg);
    } else {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        imageUrlCache.set(url, img);
        processImage(img);
      };

      img.onerror = reject;
      img.src = url;
    }
  });
};
