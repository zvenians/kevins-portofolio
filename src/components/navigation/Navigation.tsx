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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out flex items-center justify-between px-6 py-8 md:px-12 ${scrolled ? 'bg-background/80 backdrop-blur-md py-4 border-b border-border/50' : 'bg-transparent border-b border-transparent'}`}>
        <Link 
          href="/" 
          className="font-mono text-xs tracking-[0.2em] uppercase text-text-primary hover:text-accent transition-colors duration-500 relative z-50"
          onClick={() => setIsOpen(false)}
        >
          simatupang.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 text-xs font-mono uppercase tracking-[0.15em] text-text-secondary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-text-primary transition-colors duration-500 relative group"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-accent transition-all duration-500 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-text-secondary hover:text-text-primary font-mono text-xs tracking-[0.2em] uppercase relative z-50 p-2 -mr-2 transition-colors duration-500"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-background flex flex-col items-start justify-center transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        aria-hidden={!isOpen}
      >
        <div className="w-full px-6 flex flex-col gap-8">
          <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4 opacity-50">Navigation</p>
          <nav className="flex flex-col items-start gap-6 w-full">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: `${isOpen ? index * 100 + 300 : 0}ms` }}
                className={`text-5xl font-light tracking-tighter text-text-primary hover:text-accent transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] block ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
