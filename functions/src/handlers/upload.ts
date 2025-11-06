import { onObjectFinalized } from "firebase-functions/storage";
import { db, storage } from "../init";
import { parse } from "exifr";

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

  const [buffer] = await file.download();

  try {
    const { latitude, longitude, DateTimeOriginal } = await parse(buffer);

    // Not sure if thumbnail is needed for now, commenting out
    // // create thumbnail buffer (webp)
    // const thumbBuffer = await sharp(buffer)
    //   .resize({ width: 800, withoutEnlargement: true })
    //   .toFormat("webp", { quality: 80 })
    //   .toBuffer();

    // // upload thumbnail to bucket
    // const thumbPath = filePath.replace(/\.[^/.]+$/, "_thumb.webp");
    // const thumbFile = bucket.file(thumbPath);
    // await thumbFile.save(thumbBuffer);

    // await thumbFile.makePublic();
    // const thumbUrl = thumbFile.publicUrl();

    // console.log("Thumbnail created at", thumbUrl);

    await file.makePublic();
    const url = file.publicUrl();

    await db
      .collection("photos")
      .doc(docId)
      .set({
        url,
        title: "",
        description: "",
        lat: latitude,
        lng: longitude,
        date: DateTimeOriginal ? DateTimeOriginal.toISOString() : null,
      });

    console.log(`Metadata saved for: ${fileName}`);
  } catch (err) {
    console.error("EXIF parsing failed:", err);
  }
  return null;
});
