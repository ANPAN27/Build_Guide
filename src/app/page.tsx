import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import FeaturedProfessionals from "@/components/FeaturedProfessionals";
import ConstructionTips from "@/components/ConstructionTips";
import Link from "next/link";
import services from "@/data/services.json";

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

      <section className="section bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
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
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Construction Cost Guide
              </h3>
              <p className="text-text-secondary text-base">
                Understand construction costs per square foot across different cities and quality levels.
              </p>
            </Link>
            <Link href="/guide/how-to-choose-architect" className="card group">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                How to Choose an Architect
              </h3>
              <p className="text-text-secondary text-base">
                Essential tips for selecting the right architect for your home project.
              </p>
            </Link>
            <Link href="/guide/types-of-paint" className="card group">
              <div className="text-3xl mb-3">🎨</div>
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
    </>
  );
}
