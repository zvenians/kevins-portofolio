import { type SiteSettings } from "@/types/settings";

interface FooterProps {
  settings: SiteSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full px-6 md:px-12 py-12 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-mono uppercase tracking-widest text-text-muted">
        <p>
          &copy; {currentYear} {settings?.siteName || "Kevin Simatupang"}
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-text-primary transition-colors">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
