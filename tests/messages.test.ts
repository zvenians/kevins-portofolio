import { describe, it, expect } from "vitest";
import { MessageSchema } from "../src/types/schema";

describe("Message Schema Validation", () => {
  it("should validate a correct message payload", () => {
    const payload = {
      id: "test-id",
      name: "John Doe",
      email: "john@example.com",
      subject: "Hello there",
      message: "I am testing the contact form.",
      status: "unread",
      createdAt: new Date(),
    };
    
    const result = MessageSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const payload = {
      id: "test-id",
      name: "John Doe",
      email: "not-an-email",
      message: "I am testing the contact form.",
      createdAt: new Date(),
    };
    
    const result = MessageSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("should reject message that is too short", () => {
    const payload = {
      id: "test-id",
      name: "John",
      email: "john@example.com",
      message: "Hi", // min length is 5
      createdAt: new Date(),
    };
    
    const result = MessageSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("should default status to unread if missing", () => {
    const payload = {
      id: "test-id",
      name: "John Doe",
      email: "john@example.com",
      message: "I am testing the contact form.",
      createdAt: new Date(),
    };
    
    const result = MessageSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("unread");
    }
  });
});
