import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-primary font-bold text-xl">BG</span>
              </div>
              <span className="text-xl font-bold">Build Guide</span>
            </div>
            <p className="text-blue-100 text-base mb-4">
              Your trusted partner in finding the right professionals for your
              home construction and renovation projects.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-blue-100 hover:text-white transition-colors text-base">Find Professionals</Link></li>
              <li><Link href="/cost-calculator" className="text-blue-100 hover:text-white transition-colors text-base">Cost Calculator</Link></li>
              <li><Link href="/guide" className="text-blue-100 hover:text-white transition-colors text-base">Home Owner Guide</Link></li>
              <li><Link href="/about" className="text-blue-100 hover:text-white transition-colors text-base">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/search?service=architects" className="text-blue-100 hover:text-white transition-colors text-base">Architects</Link></li>
              <li><Link href="/search?service=interior-designers" className="text-blue-100 hover:text-white transition-colors text-base">Interior Designers</Link></li>
              <li><Link href="/search?service=contractors" className="text-blue-100 hover:text-white transition-colors text-base">Contractors</Link></li>
              <li><Link href="/search?service=painters" className="text-blue-100 hover:text-white transition-colors text-base">Painters</Link></li>
              <li><Link href="/search?service=civil-engineers" className="text-blue-100 hover:text-white transition-colors text-base">Civil Engineers</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-blue-100 text-base">
          <p>&copy; {currentYear} Build Guide. All rights reserved.</p>
          <p className="mt-2 text-sm text-blue-100/80">
            Icons by{" "}
            <a
              href="https://iconscout.com"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white"
            >
              IconScout
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
