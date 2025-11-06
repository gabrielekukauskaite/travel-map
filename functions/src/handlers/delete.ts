import { onObjectDeleted } from "firebase-functions/storage";
import { db } from "../init";

export const onPhotoDelete = onObjectDeleted(async (object) => {
  const filePath = object.data.name;
  const fileName = filePath.split("/").pop() as string;
  const docId = fileName.replace(/\.[^/.]+$/, "");

  console.log(`File deleted: ${fileName}`);
  if (filePath.startsWith("thumbnails")) {
    return null;
  }

  await db.collection("photos").doc(docId).delete();
  console.log(`Deleted Firestore doc for: ${docId}`);

  return null;
});
