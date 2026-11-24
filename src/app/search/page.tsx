"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import professionalsStatic from "@/data/professionals.json";

interface ProviderItem {
  id: string; displayName: string; specialty: string; city: string; experienceYears: number;
  ratingAverage: number; reviewCount: number; isVerified: boolean; bio: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    specialty: (searchParams.get("service") || "").replace(/-/g, " "),
    q: searchParams.get("q") || "",
  });
  const [items, setItems] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError("");
      try {
        const qs = new URLSearchParams();
        if (filters.city) qs.set("city", filters.city);
        if (filters.specialty) qs.set("specialty", filters.specialty);
        if (filters.q) qs.set("q", filters.q);
        const data = await apiFetch<{ items: ProviderItem[] }>(`/providers?${qs.toString()}`);
        setItems(data.items);
      } catch {
        // Fallback to static data for resilience during local/dev without backend
        const q = filters.q.toLowerCase();
        const mapped = (professionalsStatic as any[]).filter((p) => {
          if (filters.city && p.city !== filters.city) return false;
          if (filters.specialty && p.specialty.toLowerCase() !== filters.specialty.toLowerCase()) return false;
          if (q && !`${p.name} ${p.specialty} ${p.city} ${p.description}`.toLowerCase().includes(q)) return false;
          return true;
        }).map((p) => ({ id: p.id, displayName: p.name, specialty: p.specialty, city: p.city, experienceYears: p.experience, ratingAverage: p.rating, reviewCount: p.reviewCount, isVerified: !!p.verified, bio: p.description || "" }));
        setItems(mapped);
        setError("Showing local data because the API is unavailable.");
      } finally { setLoading(false); }
    };
    void load();
  }, [filters]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl mb-2">Find Professionals</h1>
        <p className="text-text-secondary text-lg">{loading ? "Loading..." : `${items.length} professional${items.length !== 1 ? "s" : ""} found`}</p>
        {error && <p className="text-sm text-amber-700 mt-2">{error}</p>}
      </div>
      <div className="card mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={filters.q} onChange={(e)=>setFilters({...filters,q:e.target.value})} placeholder="Search name, specialty..." className="px-4 py-3 border border-border rounded-xl" />
        <input value={filters.city} onChange={(e)=>setFilters({...filters,city:e.target.value})} placeholder="City" className="px-4 py-3 border border-border rounded-xl" />
        <input value={filters.specialty} onChange={(e)=>setFilters({...filters,specialty:e.target.value})} placeholder="Specialty" className="px-4 py-3 border border-border rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((pro) => (
          <Link key={pro.id} href={`/professional/${pro.id}`} className="card group hover:border-primary/30 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">{pro.displayName.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{pro.displayName}</h3>{pro.isVerified && <span className="verified-badge text-xs">✓ Verified</span>}</div>
                <p className="text-sm text-text-secondary">{pro.specialty} • {pro.city}</p>
                <p className="text-sm text-text-secondary">{pro.experienceYears} years • {pro.ratingAverage.toFixed(1)} ({pro.reviewCount})</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4 line-clamp-2">{pro.bio}</p>
            <div className="mt-auto pt-3 border-t border-border"><span className="btn btn-primary w-full text-center text-base py-3">View Profile</span></div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function SearchPage() {
  return <div className="section"><div className="container"><Suspense fallback={<div>Loading...</div>}><SearchResults /></Suspense></div></div>;
}
