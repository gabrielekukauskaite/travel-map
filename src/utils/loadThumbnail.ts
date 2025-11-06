const imageUrlCache = new Map<string, HTMLImageElement>();

export const loadThumbnail = (
  map: mapboxgl.Map,
  id: string,
  url: string,
  count?: number,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (map.hasImage(id)) return resolve();

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

      // 1. Draw the circular photo with its border
      const imageRadius = (size - borderWidth * 2) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, imageRadius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, imageRadius, 0, Math.PI * 2, true);
      ctx.strokeStyle = "white";
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // 2. If a count is provided, draw the count circle and text
      if (count && count > 1) {
        const circleRadius = size * 0.2;
        const circleX = size - circleRadius - borderWidth / 2;
        const circleY = circleRadius + borderWidth / 2;

        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = borderWidth;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = `bold ${size * 0.2}px "Open Sans", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(count.toString(), circleX, circleY);
      }

      const imageData = ctx.getImageData(0, 0, size, size);
      map.addImage(id, imageData);
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
