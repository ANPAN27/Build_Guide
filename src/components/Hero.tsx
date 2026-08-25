"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const router = useRouter();

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Nagpur", "Lucknow", "Kochi",
    "Indore", "Bhopal", "Surat", "Nashik", "Visakhapatnam", "Patna",
    "Ranchi", "Chandigarh", "Coimbatore", "Mysore", "Thiruvananthapuram",
  ];

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService);
    if (selectedCity) params.set("city", selectedCity);
    router.push(`/search?${params.toString()}`);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          const rnd = cities[Math.floor(Math.random() * cities.length)];
          setSelectedCity(rnd);
          setShowCityModal(false);
        },
        () => alert("Location access denied. Please select a city manually.")
      );
    }
  };

  const handleServiceClick = (service: string) => {
    const params = new URLSearchParams();
    params.set("service", service);
    if (selectedCity) params.set("city", selectedCity);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <section className="bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center py-16 lg:py-24">
            <h1 className="mb-4 lg:mb-6">
              Find Trusted Home Professionals Near You
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with verified architects, painters, interior designers, and
              contractors in your city
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <label htmlFor="hero-city" className="block text-left text-sm font-medium text-text-primary mb-1.5">
                    City
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCityModal(true)}
                    className="w-full flex items-center gap-2 px-4 py-3 border border-border rounded-xl text-left text-text-primary hover:border-primary/50 transition-colors bg-white min-h-[52px]"
                  >
                    <svg className="w-5 h-5 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className={selectedCity ? "text-text-primary" : "text-text-muted"}>
                      {selectedCity || "Select City"}
                    </span>
                  </button>
                </div>

                <div className="flex-1">
                  <label htmlFor="hero-service" className="block text-left text-sm font-medium text-text-primary mb-1.5">
                    Service Needed
                  </label>
                  <select
                    id="hero-service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white min-h-[52px]"
                  >
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

                <div className="flex items-end">
                  <button type="submit" className="btn btn-primary w-full md:w-auto px-8">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-text-secondary">Popular:</span>
                {["Architects", "Painters", "Interior Designers", "Contractors"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleServiceClick(s.toLowerCase().replace(" ", "-"))}
                    className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-dark text-primary font-medium transition-colors min-h-[36px]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </form>

<<<<<<< HEAD
=======
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-100 text-sm">Verified Professionals</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-blue-100 text-sm">Cities Covered</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-blue-100 text-sm">Happy Customers</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-blue-100 text-sm">Average Rating</div>
              </div>
            </div>
>>>>>>> a1da4b0 (updated website)
          </div>
        </div>
      </section>

      {showCityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCityModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-2">Where are you building or renovating?</h3>
            <p className="text-text-secondary mb-4">Select your city or use your current location.</p>

            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white min-h-[48px]"
              />
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-colors mb-4 min-h-[52px] font-medium text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 1010 10M12 2v4m0-4l-3 3m3-3l3 3" />
              </svg>
              Use Current Location
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-text-muted">or select a city</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityModal(false);
                    setCitySearch("");
                  }}
                  className={`px-4 py-3 rounded-xl border text-left transition-colors min-h-[48px] font-medium ${
                    selectedCity === city
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 text-text-primary"
                  }`}
                >
                  {city}
                </button>
              ))}
              {filteredCities.length === 0 && (
                <p className="col-span-2 text-center text-text-muted py-4">No cities found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
