"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { ApiError } from "@/lib/api";

const specialties = ["Architects","Interior Designers","Painters","Contractors","Civil Engineers","Electricians","Plumbers","Landscapers"];
const cities = ["Mumbai","Delhi","Bangalore","Chennai","Kolkata","Hyderabad","Pune","Ahmedabad","Jaipur","Nagpur","Lucknow","Kochi","Indore","Bhopal","Surat","Nashik","Visakhapatnam"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", specialty: "", city: "", experience: "", bio: "", rateRange: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { registerProvider } = useAuth();
  const router = useRouter();
  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.phone || !form.password) { setError("Please fill in all required fields"); return false; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return false; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters and include upper/lowercase and a number"); return false; }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.specialty || !form.city || !form.experience) { setError("Please fill in all required fields"); return; }
    setLoading(true);
    try {
      await registerProvider({
        name: form.name, email: form.email, phone: form.phone, password: form.password,
        specialty: form.specialty, city: form.city, experienceYears: Number(form.experience), bio: form.bio, rateRange: form.rateRange,
      });
      router.push("/provider/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to register");
    } finally { setLoading(false); }
  };

  return (
    <div className="section">
      <div className="container"><div className="max-w-lg mx-auto">
        <div className="text-center mb-8"><h1 className="mb-2">Join Build Guide</h1><p className="text-text-secondary">Create your professional profile</p></div>
        <div className="card">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-5">{error}</div>}
          {step === 1 ? (
            <div className="space-y-5">
              <input value={form.name} onChange={(e)=>update("name",e.target.value)} placeholder="Full name" className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              <input type="email" value={form.email} onChange={(e)=>update("email",e.target.value)} placeholder="Email" className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              <input value={form.phone} onChange={(e)=>update("phone",e.target.value)} placeholder="Phone" className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              <input type="password" value={form.password} onChange={(e)=>update("password",e.target.value)} placeholder="Password (8+ chars, upper/lower/number)" className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              <input type="password" value={form.confirmPassword} onChange={(e)=>update("confirmPassword",e.target.value)} placeholder="Confirm password" className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              <button type="button" onClick={()=>{ setError(""); if(validateStep1()) setStep(2); }} className="btn btn-primary w-full">Continue</button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <select value={form.specialty} onChange={(e)=>update("specialty",e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]"><option value="">Select specialty</option>{specialties.map(s=><option key={s} value={s}>{s}</option>)}</select>
              <select value={form.city} onChange={(e)=>update("city",e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]"><option value="">Select city</option>{cities.map(c=><option key={c} value={c}>{c}</option>)}</select>
              <input type="number" min={0} max={80} value={form.experience} onChange={(e)=>update("experience",e.target.value)} placeholder="Years of experience" className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              <input value={form.rateRange} onChange={(e)=>update("rateRange",e.target.value)} placeholder="Rate range (optional)" className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              <textarea value={form.bio} onChange={(e)=>update("bio",e.target.value)} placeholder="Bio" rows={4} className="w-full px-4 py-3 border border-border rounded-xl" />
              <div className="flex gap-3"><button type="button" onClick={()=>setStep(1)} className="flex-1 btn btn-outline">Back</button><button type="submit" disabled={loading} className="flex-1 btn btn-primary">{loading?"Creating...":"Create Account"}</button></div>
            </form>
          )}
        </div>
        <div className="mt-6 text-center text-sm text-text-secondary">Already have an account? <Link href="/provider/login" className="text-primary font-semibold hover:underline">Sign In</Link></div>
      </div></div>
    </div>
  );
}
