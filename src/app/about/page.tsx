import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-3">About Build Guide</h1>
            <p className="text-text-secondary text-lg">
              Your trusted platform for finding home construction professionals
            </p>
          </div>

          <div className="space-y-8">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
              <p className="text-text-secondary leading-relaxed">
                Build Guide was created with a simple mission: help Indian
                homeowners find trusted construction professionals easily and
                quickly. We believe that finding a good architect, painter, or
                contractor should not be complicated or stressful.
              </p>
              <p className="text-text-secondary leading-relaxed mt-4">
                Every professional on our platform is verified, reviewed, and
                ready to help with your home construction or renovation project.
              </p>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Why Choose Build Guide?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Verified Professionals</h3>
                  <p className="text-text-secondary text-sm">
                    Every professional is verified for credentials, experience, and quality.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Local Experts</h3>
                  <p className="text-text-secondary text-sm">
                    Find professionals in your city who understand local regulations and requirements.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Real Reviews</h3>
                  <p className="text-text-secondary text-sm">
                    Read authentic reviews from homeowners who have hired them.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Free & Transparent</h3>
                  <p className="text-text-secondary text-sm">
                    Browse and connect with professionals at no cost. No hidden charges.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Our Values</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Trust</h3>
                  <p className="text-text-secondary text-sm">
                    We verify every professional to ensure you only work with trusted experts.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Simplicity</h3>
                  <p className="text-text-secondary text-sm">
                    We make finding a professional as easy as a few clicks.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Transparency</h3>
                  <p className="text-text-secondary text-sm">
                    Contact information, reviews, and pricing are always visible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <h2 className="mb-4">Ready to Find a Professional?</h2>
            <Link href="/search" className="btn btn-primary text-lg px-10">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
