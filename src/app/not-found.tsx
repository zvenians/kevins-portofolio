import Link from "next/link";
import { Navigation } from "@/components/navigation/Navigation";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="flex flex-col items-center justify-center min-h-screen pt-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <p className="text-xl text-text-secondary mb-8">This page could not be found.</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-surface-elevated hover:bg-surface border border-border rounded transition-colors"
        >
          Return Home
        </Link>
      </main>
    </>
  );
}
