export interface Photo {
  id: string;
  date: string;
  description: string;
  lat: number;
  lng: number;
  orientation: PhotoOrientation;
  thumbUrl: string;
  title: string;
  url: string;
}

export type PhotoOrientation = "landscape" | "portrait";
