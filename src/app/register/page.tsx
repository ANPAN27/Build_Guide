"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

const specialties = [
  "Architects", "Interior Designers", "Painters", "Contractors",
  "Civil Engineers", "Electricians", "Plumbers", "Landscapers",
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Nagpur", "Lucknow", "Kochi",
  "Indore", "Bhopal", "Surat", "Nashik", "Visakhapatnam", "Patna",
  "Ranchi", "Chandigarh", "Coimbatore", "Mysore", "Thiruvananthapuram",
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    specialty: "", city: "", experience: "", bio: "", rateRange: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.specialty || !form.city || !form.experience) {
      setError("Please fill in all required fields");
      return;
    }
    const success = register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      specialty: form.specialty,
      city: form.city,
      experience: Number(form.experience),
      bio: form.bio,
      rateRange: form.rateRange,
      workExperience: [],
      workPhotos: [],
      services: [form.specialty],
    });
    if (success) {
      router.push("/dashboard");
    } else {
      setError("An account with this email already exists");
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="mb-2">Join Build Guide</h1>
            <p className="text-text-secondary">
              Create your professional profile and get discovered by homeowners
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-text-muted"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-primary text-white" : "bg-surface text-text-muted"}`}>1</div>
              <span className="text-sm font-medium hidden sm:inline">Personal Info</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-surface-dark"}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-text-muted"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-primary text-white" : "bg-surface text-text-muted"}`}>2</div>
              <span className="text-sm font-medium hidden sm:inline">Professional Info</span>
            </div>
          </div>

          <div className="card">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-5">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Password *</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <button type="button" onClick={() => { setError(""); if (validateStep1()) setStep(2); }}
                  className="btn btn-primary w-full">
                  Continue
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleRegister} className="space-y-5">
                <h2 className="text-lg font-semibold mb-4">Professional Information</h2>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Service / Specialty *</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <select value={form.specialty} onChange={(e) => update("specialty", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                      <option value="">Select your specialty</option>
                      {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">City *</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <select value={form.city} onChange={(e) => update("city", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                      <option value="">Select your city</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Years of Experience *</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input type="number" value={form.experience} onChange={(e) => update("experience", e.target.value)}
                      placeholder="e.g. 5" min="0" max="50"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Rate Range (optional)</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input type="text" value={form.rateRange} onChange={(e) => update("rateRange", e.target.value)}
                      placeholder="e.g. ₹500 - ₹2,000/day"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Bio / About Yourself</label>
                  <textarea value={form.bio} onChange={(e) => update("bio", e.target.value)}
                    rows={4}
                    placeholder="Tell homeowners about your experience, specialization, and what makes you unique..."
                    className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 rounded-xl border border-border text-text-secondary font-medium hover:bg-surface transition-colors min-h-[52px]">
                    Back
                  </button>
                  <button type="submit" className="flex-1 btn btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Create Account
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Already have an account?{" "}
              <Link href="/provider/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-primary hover:underline text-sm inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
