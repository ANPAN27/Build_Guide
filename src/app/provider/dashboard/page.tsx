"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/components/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";

type Service = { id: string; name: string };
type Portfolio = { id: string; title: string; description?: string | null; imageUrl?: string | null };
type Profile = { id: string; displayName: string; specialty: string; city: string; experienceYears: number; bio: string; rateRange?: string | null; isVerified: boolean; verificationStatus: string; services: Service[]; portfolios: Portfolio[] };

export default function DashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState("");
  const [portfolio, setPortfolio] = useState({ title: "", description: "", imageUrl: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ provider: Profile }>("/providers/me/profile");
      setProfile(data.provider);
    } catch (e) { setError(e instanceof ApiError ? e.message : "Failed to load profile"); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (!profile) return;
    setError(""); setMsg("");
    try {
      const data = await apiFetch<{ provider: Profile }>("/providers/me/profile", {
        method: "PATCH",
        body: JSON.stringify({ displayName: profile.displayName, specialty: profile.specialty, city: profile.city, experienceYears: profile.experienceYears, bio: profile.bio, rateRange: profile.rateRange || null }),
      });
      setProfile(data.provider); setMsg("Profile updated");
    } catch (e) { setError(e instanceof ApiError ? e.message : "Update failed"); }
  };

  const addService = async () => {
    if (!newService.trim()) return;
    try { await apiFetch("/providers/me/services", { method: "POST", body: JSON.stringify({ name: newService.trim() }) }); setNewService(""); await load(); }
    catch (e) { setError(e instanceof ApiError ? e.message : "Failed to add service"); }
  };

  const removeService = async (id: string) => {
    try { await apiFetch(`/providers/me/services/${id}`, { method: "DELETE" }); await load(); }
    catch (e) { setError(e instanceof ApiError ? e.message : "Failed to remove service"); }
  };

  const addPortfolio = async () => {
    if (!portfolio.title.trim()) return;
    try {
      await apiFetch("/providers/me/portfolio", { method: "POST", body: JSON.stringify({ title: portfolio.title, description: portfolio.description || null, imageUrl: portfolio.imageUrl || null }) });
      setPortfolio({ title: "", description: "", imageUrl: "" }); await load();
    } catch (e) { setError(e instanceof ApiError ? e.message : "Failed to add portfolio"); }
  };

  const removePortfolio = async (id: string) => {
    try { await apiFetch(`/providers/me/portfolio/${id}`, { method: "DELETE" }); await load(); }
    catch (e) { setError(e instanceof ApiError ? e.message : "Failed to remove portfolio item"); }
  };

  return (
    <AuthGuard roles={["PROVIDER"]}>
      <div className="section bg-surface min-h-[80vh]"><div className="container">
        <div className="flex items-center justify-between mb-6">
          <h1>Provider Dashboard</h1>
          <button className="btn btn-outline" onClick={async ()=>{ await logout(); router.push("/"); }}>Sign Out</button>
        </div>
        {msg && <div className="p-3 mb-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">{msg}</div>}
        {error && <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        {loading || !profile ? <div className="card">Loading...</div> : (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <p className="text-sm text-text-secondary mb-4">Verification: <span className="font-medium">{profile.verificationStatus}</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={profile.displayName} onChange={e=>setProfile({...profile, displayName:e.target.value})} className="px-4 py-3 border border-border rounded-xl" placeholder="Display name" />
                <input value={profile.specialty} onChange={e=>setProfile({...profile, specialty:e.target.value})} className="px-4 py-3 border border-border rounded-xl" placeholder="Specialty" />
                <input value={profile.city} onChange={e=>setProfile({...profile, city:e.target.value})} className="px-4 py-3 border border-border rounded-xl" placeholder="City" />
                <input type="number" value={profile.experienceYears} onChange={e=>setProfile({...profile, experienceYears:Number(e.target.value)})} className="px-4 py-3 border border-border rounded-xl" placeholder="Experience years" />
                <input value={profile.rateRange || ""} onChange={e=>setProfile({...profile, rateRange:e.target.value})} className="px-4 py-3 border border-border rounded-xl sm:col-span-2" placeholder="Rate range" />
                <textarea value={profile.bio} onChange={e=>setProfile({...profile, bio:e.target.value})} className="px-4 py-3 border border-border rounded-xl sm:col-span-2" rows={4} placeholder="Bio" />
              </div>
              <div className="mt-4"><button onClick={save} className="btn btn-primary">Save Profile</button></div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Services</h2>
              <div className="flex gap-2 mb-4"><input value={newService} onChange={e=>setNewService(e.target.value)} className="flex-1 px-4 py-3 border border-border rounded-xl" placeholder="Add service" /><button onClick={addService} className="btn btn-primary">Add</button></div>
              <div className="space-y-2">{profile.services.map(s=><div key={s.id} className="flex justify-between items-center p-3 border border-border rounded-xl"><span>{s.name}</span><button onClick={()=>removeService(s.id)} className="text-red-600 text-sm">Remove</button></div>)}</div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
              <div className="space-y-3 mb-4">
                <input value={portfolio.title} onChange={e=>setPortfolio({...portfolio, title:e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl" placeholder="Project title" />
                <input value={portfolio.imageUrl} onChange={e=>setPortfolio({...portfolio, imageUrl:e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl" placeholder="Image URL (https://...)" />
                <textarea value={portfolio.description} onChange={e=>setPortfolio({...portfolio, description:e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl" placeholder="Description" />
                <button onClick={addPortfolio} className="btn btn-primary">Add Portfolio Item</button>
              </div>
              <div className="space-y-2">{profile.portfolios.map(p=><div key={p.id} className="flex justify-between items-center p-3 border border-border rounded-xl"><div><div className="font-medium">{p.title}</div><div className="text-sm text-text-secondary">{p.imageUrl || "No image URL"}</div></div><button onClick={()=>removePortfolio(p.id)} className="text-red-600 text-sm">Remove</button></div>)}</div>
            </div>
          </div>
        )}
      </div></div>
    </AuthGuard>
  );
}
