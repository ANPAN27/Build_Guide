import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import FeaturedProfessionals from "@/components/FeaturedProfessionals";
import ConstructionTips from "@/components/ConstructionTips";
import Link from "next/link";
import services from "@/data/services.json";
import architects from "@/data/architects.json";

const architectCount = (architects as { name: string | null }[]).filter((a) => a.name).length;

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section bg-surface">
        <div className="container">
          <div className="text-center mb-12">
            <h2>What Service Do You Need?</h2>
            <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
              Choose from our verified network of home construction professionals
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.slice(0, 4).map((service: { id: string; name: string; icon: string; description: string; slug: string }) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
            {services.slice(4).map((service: { id: string; name: string; icon: string; description: string; slug: string }) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      <FeaturedProfessionals />

      <ConstructionTips />

      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Nagpur Architects Directory
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                {architectCount} registered architects on the Council of Architecture register
              </h3>
              <p className="text-text-secondary mb-6 max-w-lg">
                Search the complete directory of registered architects with their
                registration numbers, firms, and contact details.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link href="/architects" className="btn btn-primary">
                  Browse Architects
                </Link>
                <Link href="/search?service=architects" className="btn btn-outline">
                  Find Architects Nearby
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mb-4">Calculate Your Construction Cost</h2>
            <p className="text-lg text-blue-100 mb-8">
              Get an estimated cost for your home construction project based on
              your city, area, and material preferences.
            </p>
            <Link
              href="/cost-calculator"
              className="btn btn-secondary text-lg px-10"
            >
              Calculate Now
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Home Owner Guide</h2>
            <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
              Everything you need to know about home construction and renovation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/guide/construction-cost-calculator" className="card group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Construction Cost Guide
              </h3>
              <p className="text-text-secondary text-base">
                Understand construction costs per square foot across different cities and quality levels.
              </p>
            </Link>
            <Link href="/guide/how-to-choose-architect" className="card group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                How to Choose an Architect
              </h3>
              <p className="text-text-secondary text-base">
                Essential tips for selecting the right architect for your home project.
              </p>
            </Link>
            <Link href="/guide/types-of-paint" className="card group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Types of Paint Guide
              </h3>
              <p className="text-text-secondary text-base">
                Comprehensive guide to different paint types and their best applications.
              </p>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/guide" className="btn btn-outline">
              View All Guides
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-surface border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Are you a professional?
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                List your services on Build Guide
              </h3>
              <p className="text-text-secondary mb-6 max-w-lg">
                Join our network of verified home construction professionals.
                Get discovered by homeowners in your city and grow your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link href="/register" className="btn btn-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Free Profile
                </Link>
                <Link href="/provider/login" className="btn btn-outline">
                  Already Listed? Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
