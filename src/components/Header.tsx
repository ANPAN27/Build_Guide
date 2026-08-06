"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Find Professionals" },
    { href: "/cost-calculator", label: "Cost Calculator" },
    { href: "/guide", label: "Home Owner Guide" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">BG</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-primary">
              Build Guide
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 lg:px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:text-primary hover:bg-surface"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="btn btn-primary text-base px-5 py-2.5 min-h-[44px]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
