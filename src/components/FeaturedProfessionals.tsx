"use client";
import Link from "next/link";
import professionals from "@/data/professionals.json";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  city: string;
  experience: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
}

export default function FeaturedProfessionals() {
  const featured: Professional[] = professionals.slice(0, 4);

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2>Featured Professionals</h2>
          <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
            Top-rated verified professionals ready to help with your project
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((pro) => (
            <Link
              key={pro.id}
              href={`/professional/${pro.id}`}
              className="card group flex flex-col hover:border-primary/30"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                {pro.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="text-center mb-3">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {pro.name}
                </h3>
                <p className="text-text-secondary text-sm">{pro.specialty}</p>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm mb-2">
                <span className="stars">{Array(Math.floor(pro.rating)).fill("★").join("")}</span>
                <span className="font-medium">{pro.rating}</span>
                <span className="text-text-muted">({pro.reviewCount})</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-text-secondary mb-3">
                <span>{pro.experience} yrs exp</span>
                <span>📍 {pro.city}</span>
              </div>
              {pro.verified && (
                <div className="flex justify-center">
                  <span className="verified-badge">✓ Verified</span>
                </div>
              )}
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/search" className="btn btn-primary">
            View All Professionals
          </Link>
        </div>
      </div>
    </section>
  );
}
