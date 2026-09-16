import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";

if (!getApps().length) {
  let credential;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      credential = cert(serviceAccount);
    } catch (error) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY", error);
      credential = applicationDefault();
    }
  } else {
    // Falls back to Application Default Credentials
    credential = applicationDefault();
  }

  initializeApp({
    credential,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "simatupangkevin",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const getAdminApp = () => getApps()[0];
