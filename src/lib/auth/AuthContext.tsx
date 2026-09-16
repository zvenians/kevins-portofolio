"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const tokenResult = await currentUser.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
        // SameSite=Lax so the cookie is readable on server-side navigation
        document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;
      } else {
        setIsAdmin(false);
        document.cookie = `firebase-token=; path=/; max-age=0; SameSite=Lax`;
      }
      setLoading(false);
    });

    // Refresh token periodically to keep cookie valid
    const interval = setInterval(async () => {
      if (auth && auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
