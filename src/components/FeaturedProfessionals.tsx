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
<<<<<<< HEAD
  firmName?: string;
  subSpecialization?: string;
=======
  workExperience?: { role: string; company: string; duration: string; projects: number }[];
>>>>>>> 1d2e764ed2ed65148fa6409b371bb7958a0377d3
}

export default function FeaturedProfessionals() {
  const sorted = [...(professionals as Professional[])].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  const featured: Professional[] = sorted.slice(0, 4);

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
<<<<<<< HEAD
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                {pro.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
=======
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">
                  {pro.name.split(" ").map((n) => n[0]).join("")}
                </span>
>>>>>>> 1d2e764ed2ed65148fa6409b371bb7958a0377d3
              </div>
              <div className="text-center mb-3">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {pro.name}
                </h3>
                {pro.firmName && <p className="text-primary text-xs font-medium">{pro.firmName}</p>}
                <p className="text-text-secondary text-sm">{pro.subSpecialization || pro.specialty}</p>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm mb-2">
                <span className="stars">{Array(Math.floor(pro.rating)).fill("★").join("")}</span>
                <span className="font-medium">{pro.rating}</span>
                <span className="text-text-muted">({pro.reviewCount})</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-text-secondary mb-3">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {pro.experience} yrs exp
                </span>
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {pro.city}
                </span>
              </div>
              {pro.workExperience && pro.workExperience.length > 0 && (
                <div className="text-center mb-3 px-2">
                  <p className="text-xs text-primary bg-primary/5 rounded-lg px-2 py-1 truncate">
                    {pro.workExperience[0].role} at {pro.workExperience[0].company}
                  </p>
                </div>
              )}
              {pro.verified && (
                <div className="flex justify-center mt-auto">
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
