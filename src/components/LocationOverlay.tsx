"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Nagpur", "Lucknow", "Kochi",
  "Indore", "Bhopal", "Surat", "Nashik", "Visakhapatnam", "Patna",
  "Ranchi", "Chandigarh", "Coimbatore", "Mysore", "Thiruvananthapuram",
];

const services = [
  "Architects", "Interior Designers", "Painters", "Contractors",
  "Civil Engineers", "Electricians", "Plumbers", "Landscapers",
];

export default function LocationOverlay() {
  const [show, setShow] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [detecting, setDetecting] = useState(true);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const dismissed = localStorage.getItem("location-overlay-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          const rnd = cities[Math.floor(Math.random() * cities.length)];
          setSelectedCity(rnd);
          setDetecting(false);
        },
        () => {
          setDetecting(false);
        },
        { timeout: 5000 }
      );
    } else {
      setDetecting(false);
    }
  }, []);

  useEffect(() => {
    const parts: string[] = [];
    if (selectedService) parts.push(selectedService);
    else parts.push("Professionals");
    if (selectedCity) parts.push(`in ${selectedCity}`);
    setSearchText(parts.join(" "));
  }, [selectedCity, selectedService]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService.toLowerCase().replace(/ /g, "-"));
    if (selectedCity) params.set("city", selectedCity);
    router.push(`/search?${params.toString()}`);
    dismiss();
  };

  const dismiss = () => {
    localStorage.setItem("location-overlay-dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="location-overlay" onClick={dismiss}>
      <div className="location-overlay-card" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-1">Find Professionals Near You</h3>
          <p className="text-text-secondary text-sm">
            {detecting ? "Detecting your location..." : "Select your city and service to get started"}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Service Needed</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Services</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {searchText && (
          <div className="bg-surface rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-text-muted text-sm italic">{searchText}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={dismiss}
            className="flex-1 py-3 px-4 rounded-xl border border-border text-text-secondary font-medium hover:bg-surface transition-colors min-h-[48px]"
          >
            Skip
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
  );
}
