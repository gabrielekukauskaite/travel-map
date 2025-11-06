import { setGlobalOptions } from "firebase-functions";
import * as admin from "firebase-admin";
import { Storage } from "@google-cloud/storage";

setGlobalOptions({ maxInstances: 10 });
admin.initializeApp();

export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const storage = new Storage();
