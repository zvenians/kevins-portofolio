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
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const tokenResult = await currentUser.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
        // Set cookie for server-side auth guard
        document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;
      } else {
        setIsAdmin(false);
        document.cookie = `firebase-token=; path=/; max-age=0; SameSite=Strict; Secure`;
      }
      setLoading(false);
    });

    // Refresh token periodically to keep cookie valid
    const interval = setInterval(async () => {
      if (auth && auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;
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
