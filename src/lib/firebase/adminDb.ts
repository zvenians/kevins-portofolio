import { getFirestore } from "firebase-admin/firestore";
import "./adminApp";

export const adminDb = getFirestore();
