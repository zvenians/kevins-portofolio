"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Work", href: "/projects" },
  { label: "Experiments", href: "/#experiments" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent scroll when menu is open without layout shift (no scroll hijacking, just overflow hidden)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-colors duration-500">
        <Link 
          href="/" 
          className="font-mono text-sm tracking-widest uppercase text-text-primary hover:text-accent transition-colors relative z-50"
          onClick={() => setIsOpen(false)}
        >
          simatupang.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-mono uppercase tracking-widest text-text-secondary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-text-primary transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-text-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-text-secondary hover:text-text-primary font-mono text-sm tracking-widest uppercase relative z-50 p-2 -mr-2"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center transition-all duration-500 ease-out md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        aria-hidden={!isOpen}
      >
        <nav className="flex flex-col items-center gap-12 text-center w-full px-6">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-3xl font-medium tracking-tight text-text-primary hover:text-accent transition-all duration-500 delay-${index * 100} ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
