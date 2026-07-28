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
              <li><Link href="/contact" className="text-blue-100 hover:text-white transition-colors text-base">Contact Us</Link></li>
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

          <div>
            <h3 className="text-base font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-blue-100 text-base">123 Business Avenue, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919876543210" className="text-blue-100 hover:text-white transition-colors text-base">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@buildguide.in" className="text-blue-100 hover:text-white transition-colors text-base">info@buildguide.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-blue-100 text-base">
          <p>&copy; {currentYear} Build Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
