import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCN7PwghGjnXnnvRANh6bbT_x5ZahCXM9Q",
  authDomain: "travel-map-1b5c5.firebaseapp.com",
  projectId: "travel-map-1b5c5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CACHE_KEY = "markerData";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

async function fetchPhotosFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "photos"));
  const photos = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return photos;
}

export async function getPhotos() {
  try {
    const cachedPhotos = localStorage.getItem(CACHE_KEY);
    if (cachedPhotos) {
      const photosJson = JSON.parse(cachedPhotos);
      const age = Date.now() - photosJson.ts;
      if (age < CACHE_TTL_MS) {
        return photosJson.data;
      }
    }

    const photos = await fetchPhotosFromFirestore();
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), data: photos }),
    );
    return photos;
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
}
