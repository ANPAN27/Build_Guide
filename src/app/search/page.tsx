"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  type: string;
  description: string;
}

const cities = [
  "Mumbai","Delhi","Bangalore","Chennai","Kolkata","Hyderabad","Pune",
  "Ahmedabad","Jaipur","Nagpur","Lucknow","Kochi","Indore","Bhopal",
  "Surat","Nashik","Visakhapatnam","Patna","Ranchi","Chandigarh",
];

function SearchResults() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const initialCity = searchParams.get("city") || "";

  const [filters, setFilters] = useState({
    city: initialCity,
    service: initialService,
    budget: "",
    experience: "",
    verified: false,
    type: "",
  });

  const results = useMemo(() => {
    return (professionals as Professional[]).filter((p) => {
      if (filters.city && p.city !== filters.city) return false;
      if (filters.service && p.specialty.toLowerCase().replace(/ /g, "-") !== filters.service.toLowerCase().replace(/ /g, "-")) return false;
      if (filters.verified && !p.verified) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.experience) {
        const [min] = filters.experience.split("-").map(Number);
        if (min && p.experience < min) return false;
      }
      return true;
    });
  }, [filters]);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ city: "", service: "", budget: "", experience: "", verified: false, type: "" });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl mb-2">Find Professionals</h1>
        <p className="text-text-secondary text-lg">
          {results.length} professional{results.length !== 1 ? "s" : ""} found
          {filters.city ? ` in ${filters.city}` : ""}
          {filters.service ? ` for ${filters.service.replace(/-/g, " ")}` : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 shrink-0">
          <div className="card lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                Clear all
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="filter-city" className="block text-sm font-medium mb-1.5">City</label>
                <select id="filter-city" value={filters.city} onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full px-3 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[44px]">
                  <option value="">All Cities</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="filter-service" className="block text-sm font-medium mb-1.5">Service</label>
                <select id="filter-service" value={filters.service} onChange={(e) => handleFilterChange("service", e.target.value)}
                  className="w-full px-3 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[44px]">
                  <option value="">All Services</option>
                  <option value="architects">Architects</option>
                  <option value="interior-designers">Interior Designers</option>
                  <option value="painters">Painters</option>
                  <option value="contractors">Contractors</option>
                  <option value="civil-engineers">Civil Engineers</option>
                  <option value="electricians">Electricians</option>
                  <option value="plumbers">Plumbers</option>
                  <option value="landscapers">Landscapers</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-budget" className="block text-sm font-medium mb-1.5">Budget</label>
                <select id="filter-budget" value={filters.budget} onChange={(e) => handleFilterChange("budget", e.target.value)}
                  className="w-full px-3 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[44px]">
                  <option value="">Any Budget</option>
                  <option value="Under ₹50,000">Under ₹50,000</option>
                  <option value="₹50K - ₹1L">₹50K - ₹1L</option>
                  <option value="₹1L - ₹5L">₹1L - ₹5L</option>
                  <option value="₹5L - ₹10L">₹5L - ₹10L</option>
                  <option value="Above ₹10L">Above ₹10L</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-exp" className="block text-sm font-medium mb-1.5">Experience</label>
                <select id="filter-exp" value={filters.experience} onChange={(e) => handleFilterChange("experience", e.target.value)}
                  className="w-full px-3 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[44px]">
                  <option value="">Any Experience</option>
                  <option value="5">5+ years</option>
                  <option value="10">10+ years</option>
                  <option value="15">15+ years</option>
                  <option value="20">20+ years</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3 py-2 cursor-pointer min-h-[44px]">
                  <input type="checkbox" checked={filters.verified} onChange={(e) => handleFilterChange("verified", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                  <span className="font-medium">Verified Only</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Project Type</label>
                <div className="flex gap-2">
                  <button onClick={() => handleFilterChange("type", filters.type === "residential" ? "" : "residential")}
                    className={`flex-1 py-3 px-3 rounded-xl border text-sm font-medium transition-colors min-h-[44px] ${
                      filters.type === "residential" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                    }`}>
                    Residential
                  </button>
                  <button onClick={() => handleFilterChange("type", filters.type === "commercial" ? "" : "commercial")}
                    className={`flex-1 py-3 px-3 rounded-xl border text-sm font-medium transition-colors min-h-[44px] ${
                      filters.type === "commercial" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                    }`}>
                    Commercial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No professionals found</h3>
              <p className="text-text-secondary mb-6">Try adjusting your filters or search in a different city.</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((pro: Professional, index: number) => (
                <Link
                  key={pro.id}
                  href={`/professional/${pro.id}`}
                  className="card group hover:border-primary/30 fade-in flex flex-col"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                      {pro.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {pro.name}
                        </h3>
                        {pro.verified && <span className="verified-badge text-xs">✓ Verified</span>}
                      </div>
                      <p className="text-sm text-text-secondary">{pro.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="stars text-sm">
                          {Array(Math.floor(pro.rating)).fill("★").join("")}
                        </span>
                        <span className="text-sm font-medium">{pro.rating}</span>
                        <span className="text-xs text-text-muted">({pro.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary mb-4">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {pro.city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {pro.experience} years
                    </span>
                    <span className="capitalize inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      {pro.type}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{pro.description}</p>

                  <div className="mt-auto pt-3 border-t border-border">
                    <span className="btn btn-primary w-full text-center text-base py-3">
                      View Profile
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="section">
      <div className="container">
        <Suspense fallback={
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-text-secondary">Loading search...</p>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
