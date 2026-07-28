"use client";
import { useState } from "react";

const cityRates: Record<string, { basic: number; standard: number; premium: number }> = {
  Mumbai: { basic: 1800, standard: 2500, premium: 3500 },
  Delhi: { basic: 1600, standard: 2300, premium: 3200 },
  Bangalore: { basic: 1700, standard: 2400, premium: 3300 },
  Chennai: { basic: 1500, standard: 2100, premium: 3000 },
  Kolkata: { basic: 1400, standard: 2000, premium: 2800 },
  Hyderabad: { basic: 1500, standard: 2200, premium: 3100 },
  Pune: { basic: 1700, standard: 2400, premium: 3400 },
  Ahmedabad: { basic: 1400, standard: 2000, premium: 2800 },
  Jaipur: { basic: 1300, standard: 1900, premium: 2700 },
  Nagpur: { basic: 1300, standard: 1800, premium: 2600 },
};

const qualityLevels = [
  { key: "basic", label: "Basic", desc: "Standard materials, essential finishes" },
  { key: "standard", label: "Standard", desc: "Good quality materials, branded fittings" },
  { key: "premium", label: "Premium", desc: "High-end materials, premium finishes" },
];

const defaultRates = { basic: 1500, standard: 2200, premium: 3000 };

export default function CostCalculator() {
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState("1");
  const [quality, setQuality] = useState("standard");
  const [includeInterior, setIncludeInterior] = useState(false);

  const rates = city ? cityRates[city] || defaultRates : defaultRates;

  const sqft = Number(area) * Number(floors);
  const ratePerSqft = rates[quality as keyof typeof rates] || rates.standard;
  const constructionCost = sqft * ratePerSqft;
  const interiorCost = includeInterior ? constructionCost * 0.4 : 0;
  const totalCost = constructionCost + interiorCost;
  const hasValidInput = Number(area) > 0 && city;

  const formatNumber = (num: number) =>
    num.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-3">Construction Cost Calculator</h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Get an estimated cost for your home construction project
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Project Details</h2>

              <div className="space-y-5">
                <div>
                  <label htmlFor="calc-city" className="block text-sm font-medium mb-1.5">City</label>
                  <select id="calc-city" value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px]">
                    <option value="">Select your city</option>
                    {Object.keys(cityRates).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="calc-area" className="block text-sm font-medium mb-1.5">Area (sq ft per floor)</label>
                  <input id="calc-area" type="number" value={area} onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g., 1500"
                    className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <div>
                  <label htmlFor="calc-floors" className="block text-sm font-medium mb-1.5">Number of Floors</label>
                  <select id="calc-floors" value={floors} onChange={(e) => setFloors(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px]">
                    {[1, 2, 3, 4, 5].map((f) => (
                      <option key={f} value={f}>{f} Floor{f > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Construction Quality</label>
                  <div className="grid grid-cols-3 gap-2">
                    {qualityLevels.map((q) => (
                      <button key={q.key} onClick={() => setQuality(q.key)}
                        className={`p-3 rounded-xl border text-left transition-colors min-h-[60px] ${
                          quality === q.key
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}>
                        <div className="font-medium text-sm">{q.label}</div>
                        <div className="text-xs text-text-secondary mt-0.5">
                          ₹{rates[q.key as keyof typeof rates]}/sqft
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 py-2 cursor-pointer min-h-[44px]">
                  <input type="checkbox" checked={includeInterior} onChange={(e) => setIncludeInterior(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                  <div>
                    <span className="font-medium">Include Interior Design</span>
                    <p className="text-sm text-text-secondary">Adds ~40% to construction cost</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <div className="card bg-primary text-white sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Cost Estimate</h2>
                {hasValidInput ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Total Built-up Area</p>
                      <p className="text-2xl font-bold">{formatNumber(sqft)} sq ft</p>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-blue-100 text-sm mb-1">Construction Cost</p>
                      <p className="text-2xl font-bold">₹ {formatNumber(constructionCost)}</p>
                      <p className="text-blue-100 text-sm mt-1">
                        @ ₹{ratePerSqft}/sqft ({quality} quality)
                      </p>
                    </div>
                    {includeInterior && (
                      <div className="border-t border-white/20 pt-4">
                        <p className="text-blue-100 text-sm mb-1">Interior Design Cost</p>
                        <p className="text-2xl font-bold">+ ₹ {formatNumber(interiorCost)}</p>
                      </div>
                    )}
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-blue-100 text-sm mb-1">Total Estimated Cost</p>
                      <p className="text-3xl font-bold">₹ {formatNumber(totalCost)}</p>
                    </div>
                    <p className="text-blue-100 text-xs">
                      * This is a rough estimate. Actual costs may vary based on
                      materials, labor, and specific requirements.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-blue-100">
                      Enter your project details to see the estimated cost
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 card">
            <h2 className="text-xl font-semibold mb-4">Cost Breakdown by Quality</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 font-semibold">Quality</th>
                    <th className="py-3 pr-4 font-semibold">Rate/sq ft</th>
                    <th className="py-3 pr-4 font-semibold">Materials</th>
                    <th className="py-3 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-text-primary">Basic</td>
                    <td className="py-3 pr-4">₹{formatNumber(defaultRates.basic)} - ₹{formatNumber(Object.values(cityRates).reduce((max, r) => Math.max(max, r.basic), 0))}</td>
                    <td className="py-3 pr-4">Standard bricks, cement, basic fixtures</td>
                    <td className="py-3">Budget-friendly homes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-text-primary">Standard</td>
                    <td className="py-3 pr-4">₹{formatNumber(defaultRates.standard)} - ₹{formatNumber(Object.values(cityRates).reduce((max, r) => Math.max(max, r.standard), 0))}</td>
                    <td className="py-3 pr-4">Branded materials, good quality fittings</td>
                    <td className="py-3">Most residential homes</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-text-primary">Premium</td>
                    <td className="py-3 pr-4">₹{formatNumber(defaultRates.premium)} - ₹{formatNumber(Object.values(cityRates).reduce((max, r) => Math.max(max, r.premium), 0))}</td>
                    <td className="py-3 pr-4">High-end materials, designer finishes</td>
                    <td className="py-3">Luxury homes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
