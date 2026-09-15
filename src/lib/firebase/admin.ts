import * as admin from "firebase-admin";

if (!admin.apps.length) {
  let credential;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY", error);
      credential = admin.credential.applicationDefault();
    }
  } else {
    // Falls back to Application Default Credentials
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "simatupangkevin",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminDb = admin.firestore();
const adminStorage = admin.storage();
const adminAuth = admin.auth();

export { adminDb, adminStorage, adminAuth, admin };