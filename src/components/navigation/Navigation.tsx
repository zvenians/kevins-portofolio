import Link from "next/link";

const NAV_ITEMS = [
  { label: "Work", href: "/projects" },
  { label: "Experiments", href: "/experiments" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      <Link href="/" className="font-semibold tracking-tight text-text-primary">
        simatupangkevin
      </Link>

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-text-primary transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button - Minimal approach for now */}
      <button className="md:hidden text-text-secondary hover:text-text-primary">
        Menu
      </button>
    </header>
  );
}
