/** @vitest-environment jsdom */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/admin/login/page";
import React from "react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock firebase/auth
vi.mock("firebase/auth", () => ({
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(() => ({
    setCustomParameters: vi.fn(),
  })),
  signOut: vi.fn(),
}));

// Mock firebase config
vi.mock("@/lib/firebase/config", () => ({
  auth: {},
}));

describe("Login Page UI", () => {
  it("renders only Google login button and no email/password inputs", () => {
    render(<LoginPage />);

    // Check for Google login button
    expect(screen.getByText(/Continue with Google/i)).toBeDefined();

    // Check that email/password inputs are absent
    const emailInput = screen.queryByLabelText(/Email/i);
    const passwordInput = screen.queryByLabelText(/Password/i);
    
    expect(emailInput).toBeNull();
    expect(passwordInput).toBeNull();
  });
});

