"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await cred.user.getIdTokenResult();
      
      if (!tokenResult.claims.admin) {
        setError("You do not have administrative privileges.");
        auth.signOut();
      } else {
        router.push("/admin");
      }
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface-elevated p-8 rounded-lg border border-border">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Portal</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-danger/20 border border-danger/50 rounded text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-border rounded focus:outline-none focus:border-accent text-text-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-border rounded focus:outline-none focus:border-accent text-text-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-text-primary text-background font-medium rounded hover:bg-text-secondary transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
