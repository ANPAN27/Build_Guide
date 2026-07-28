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
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-2xl">
                    ✓
                  </div>
                  <h3 className="font-semibold mb-1">Verified Professionals</h3>
                  <p className="text-text-secondary text-sm">
                    Every professional is verified for credentials, experience, and quality.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-2xl">
                    📍
                  </div>
                  <h3 className="font-semibold mb-1">Local Experts</h3>
                  <p className="text-text-secondary text-sm">
                    Find professionals in your city who understand local regulations and requirements.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-2xl">
                    ⭐
                  </div>
                  <h3 className="font-semibold mb-1">Real Reviews</h3>
                  <p className="text-text-secondary text-sm">
                    Read authentic reviews from homeowners who have hired them.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-2xl">
                    🔒
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
