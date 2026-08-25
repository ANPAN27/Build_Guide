"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Nagpur", "Lucknow", "Kochi",
  "Indore", "Bhopal", "Surat", "Nashik", "Visakhapatnam",
];

const services = [
  "Architects", "Interior Designers", "Painters", "Contractors",
  "Civil Engineers", "Electricians", "Plumbers", "Landscapers",
];

export default function FloatingSearch() {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (service) params.set("service", service.toLowerCase().replace(/ /g, "-"));
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="floating-search-btn md:hidden"
        aria-label="Quick Search"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex floating-search-btn"
        aria-label="Quick Search"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {open && (
        <div className="location-overlay" onClick={() => setOpen(false)}>
          <div className="location-overlay-card" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Quick Search</h3>
            </div>

            <div className="space-y-3 mb-5">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Services</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {city && (
              <div className="bg-surface rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-text-muted text-sm italic">
                  {service || "Professionals"} in {city}
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-border text-text-secondary font-medium hover:bg-surface transition-colors min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSearch}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary-light transition-colors min-h-[48px]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
