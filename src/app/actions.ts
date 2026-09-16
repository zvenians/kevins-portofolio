"use server";

import { adminDb } from "@/lib/firebase/adminDb";
import { MessageSchema } from "@/types/schema";
import { randomUUID } from "crypto";

// Basic in-memory rate limiting for serverless (only works per-instance, but fine for basic portfolio)
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

export async function submitContactForm(formData: FormData) {
  // 1. Anti-Spam: Honeypot check
  const honeypot = formData.get("website_url");
  if (honeypot) {
    // If honeypot is filled out, silently succeed to trick bots
    return { success: true };
  }

  // 2. Extract Data
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const subject = formData.get("subject")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim() || "";
  
  // IP/Identifier for basic rate limiting
  const identifier = email.toLowerCase();
  
  // 3. Basic Rate Limiting
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (record && now < record.resetAt) {
    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
      throw new Error("Too many requests. Please try again later.");
    }
    record.count++;
  } else {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  }

  // 4. Validate with Zod
  const payload = {
    id: randomUUID(),
    name,
    email,
    subject,
    message,
    status: "unread",
    createdAt: new Date(),
  };

  const result = MessageSchema.safeParse(payload);
  
  if (!result.success) {
    // Collect the first error message
    const errorMsg = result.error.issues[0]?.message || "Invalid form data.";
    throw new Error(errorMsg);
  }

  // 5. Save to Firestore
  try {
    await adminDb.collection("messages").doc(result.data.id).set(result.data);
    return { success: true };
  } catch (error) {
    console.error("Failed to save contact message:", error);
    throw new Error("Something went wrong. Please try again later.");
  }
}
