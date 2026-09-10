"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { isLoggedIn, provider, user, logout, logoutUser } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Find Professionals" },
    { href: "/cost-calculator", label: "Cost Calculator" },
    { href: "/guide", label: "Home Owner Guide" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
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
            {isLoggedIn && provider ? (
              <>
                <Link
                  href="/provider/dashboard"
                  className={`btn text-base px-4 py-2.5 min-h-[44px] ${
                    isActive("/provider/dashboard") ? "btn-primary" : "btn-outline"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Provider Dashboard
                </Link>
                <button
                  onClick={() => { logout(); }}
                  className="text-sm text-text-secondary hover:text-primary px-3 py-2 rounded-lg hover:bg-surface transition-colors min-h-[44px]"
                >
                  Sign Out
                </button>
              </>
            ) : isLoggedIn && user ? (
              <>
                <span className="text-sm font-medium text-primary px-3 py-2 min-h-[44px] inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user.name}
                </span>
                <button
                  onClick={() => { logoutUser(); }}
                  className="text-sm text-text-secondary hover:text-primary px-3 py-2 rounded-lg hover:bg-surface transition-colors min-h-[44px]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-text-secondary hover:text-primary px-3 py-2 rounded-lg hover:bg-surface transition-colors min-h-[44px] inline-flex items-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary text-base px-5 py-2.5 min-h-[44px]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  List Your Service
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
