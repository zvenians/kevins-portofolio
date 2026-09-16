import { adminDb } from "../firebase/adminDb";
import { type Message, MessageSchema } from "../../types/schema";

export async function getMessages(): Promise<Message[]> {
  try {
    const snapshot = await adminDb
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();

    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      const raw = doc.data();
      if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
      raw.id = doc.id;
      
      const parsed = MessageSchema.safeParse(raw);
      if (parsed.success) {
        messages.push(parsed.data);
      } else {
        console.warn(`Invalid message document: ${doc.id}`);
      }
    });
    return messages;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

export async function getMessage(id: string): Promise<Message | null> {
  try {
    const doc = await adminDb.collection("messages").doc(id).get();
    if (!doc.exists) return null;

    const raw = doc.data()!;
    if (raw.createdAt?.toDate) raw.createdAt = raw.createdAt.toDate();
    raw.id = doc.id;

    const parsed = MessageSchema.safeParse(raw);
    if (parsed.success) return parsed.data;
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch message ${id}:`, error);
    return null;
  }
}
