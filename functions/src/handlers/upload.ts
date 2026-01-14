import { onObjectFinalized } from "firebase-functions/storage";
import { db, storage } from "../init";
import { exiftool } from "exiftool-vendored";
import path from "path";
import os from "os";

export const onPhotoUpload = onObjectFinalized(async (object) => {
  const filePath = object.data.name;
  const fileName = filePath.split("/").pop() as string;
  const docId = fileName.replace(/\.[^/.]+$/, "");

  console.log(`File uploaded: ${fileName}`);

  const bucketName = object.bucket;
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);

  if (filePath.startsWith("thumbnails")) {
    db.collection("photos")
      .doc(docId)
      .set({ thumbUrl: file.publicUrl() }, { merge: true });
    return null;
  }

  const tempFilePath = path.join(os.tmpdir(), fileName);
  await file.download({ destination: tempFilePath });

  try {
    const { GPSLatitude, GPSLongitude, DateTimeOriginal } =
      await exiftool.read(tempFilePath);

    await file.makePublic();
    const url = file.publicUrl();

    await db
      .collection("photos")
      .doc(docId)
      .set({
        url,
        title: "",
        description: "",
        lat: GPSLatitude,
        lng: GPSLongitude,
        date: DateTimeOriginal ? DateTimeOriginal.toString() : null,
        sortOrder: 0,
      });

    console.log(`Metadata saved for: ${fileName}`);
  } catch (err) {
    console.error("EXIF parsing failed:", err);
  }
  return null;
});
