"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import architects from "@/data/architects.json";

interface Architect {
  id: string;
  city: string;
  name: string | null;
  registrationNo: string | null;
  firm: string | null;
  address: string | null;
  contact: string | null;
  emailUsername: string | null;
  email: string | null;
}

export default function ArchitectsDirectory() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const list = architects as Architect[];
    if (!query.trim()) return list;
    const q = query.toLowerCase().trim();
    return list.filter((a) =>
      [a.name, a.firm, a.registrationNo, a.address, a.contact, a.email]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  const withName = results.filter((a): a is Architect & { name: string } => Boolean(a.name));

  return (
    <>
      <div className="bg-primary text-white">
        <div className="container">
          <div className="py-8 md:py-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold">Architects Directory</h1>
            </div>
            <p className="text-lg text-blue-100">
              {withName.length} registered architects in {withName.length > 0 ? withName[0].city : "Nagpur"}
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="card mb-8">
            <label htmlFor="architect-search" className="block text-sm font-medium mb-1.5">
              Search by name, firm, registration number, or contact
            </label>
            <div className="relative">
              <svg className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="architect-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Sarwate, Quadra Design Cell, CA/2001/27321"
                className="w-full pl-12 pr-4 py-4 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:border-primary focus:ring-primary"
              />
            </div>
            <p className="text-sm text-text-secondary mt-2">
              {withName.length} architect{withName.length !== 1 ? "s" : ""} found
              {query.trim() ? " for your search" : " in the directory"}
            </p>
          </div>

          {withName.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No architects found</h3>
              <p className="text-text-secondary mb-6">Try a different search term.</p>
              <button onClick={() => setQuery("")} className="btn btn-primary">
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {withName.map((arch, index: number) => (
                <Link
                  key={arch.id}
                  href={`/architects/${arch.id}`}
                  className="card group hover:border-primary/30 fade-in flex flex-col"
                  style={{ animationDelay: `${Math.min(index, 15) * 0.05}s` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                      {arch.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {arch.name}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-1">
                        {arch.firm || arch.city}
                      </p>
                      {arch.registrationNo && (
                        <span className="inline-block mt-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                          {arch.registrationNo}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-text-secondary mb-4 flex-1">
                    {arch.contact && (
                      <span className="inline-flex items-center gap-1.5 line-clamp-1">
                        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {arch.contact}
                      </span>
                    )}
                    {arch.email && (
                      <span className="inline-flex items-center gap-1.5 line-clamp-1">
                        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {arch.email}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 line-clamp-1">
                      <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {arch.city}
                    </span>
                  </div>

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