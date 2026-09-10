"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ProviderProfile } from "@/components/AuthContext";
import AuthGuard from "@/components/AuthGuard";

const specialties = [
  "Architects", "Interior Designers", "Painters", "Contractors",
  "Civil Engineers", "Electricians", "Plumbers", "Landscapers",
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Nagpur", "Lucknow", "Kochi",
  "Indore", "Bhopal", "Surat", "Nashik", "Visakhapatnam",
];

type Tab = "profile" | "photos" | "experience" | "services";

export default function DashboardPage() {
  const { provider, isLoggedIn, logout, updateProfile, addWorkPhoto, removeWorkPhoto, addWorkExperience, removeWorkExperience } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProviderProfile>>({});
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoForm, setPhotoForm] = useState({ name: "", description: "", url: "" });
  const [showExpForm, setShowExpForm] = useState(false);
  const [expForm, setExpForm] = useState({ role: "", company: "", duration: "", projects: "" });
  const [newService, setNewService] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  if (!isLoggedIn || !provider) return null;

  const showSaved = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setEditing(false);
    showSaved("Profile updated successfully!");
  };

  const handleAddPhoto = () => {
    if (!photoForm.name) return;
    addWorkPhoto({
      name: photoForm.name,
      url: photoForm.url || `/images/projects/work-${Date.now()}.jpg`,
      description: photoForm.description,
    });
    setPhotoForm({ name: "", description: "", url: "" });
    setShowPhotoForm(false);
    showSaved("Photo added successfully!");
  };

  const handleAddExperience = () => {
    if (!expForm.role || !expForm.company) return;
    addWorkExperience({
      role: expForm.role,
      company: expForm.company,
      duration: expForm.duration,
      projects: Number(expForm.projects) || 0,
    });
    setExpForm({ role: "", company: "", duration: "", projects: "" });
    setShowExpForm(false);
    showSaved("Work experience added!");
  };

  const handleAddService = () => {
    if (!newService || provider.services.includes(newService)) return;
    updateProfile({ services: [...provider.services, newService] });
    setNewService("");
    showSaved("Service added!");
  };

  const handleRemoveService = (svc: string) => {
    updateProfile({ services: provider.services.filter((s) => s !== svc) });
    showSaved("Service removed");
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "profile", label: "Profile",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    },
    {
      key: "photos", label: "Work Photos",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
    {
      key: "experience", label: "Experience",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
    {
      key: "services", label: "Services",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
  ];

  return (
    <AuthGuard>
    <div className="section bg-surface min-h-[80vh]">
      <div className="container">
        {saveMsg && (
          <div className="fixed top-24 right-4 z-50 p-4 rounded-xl bg-primary text-white shadow-lg fade-in flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {saveMsg}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <div className="card lg:sticky lg:top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {provider.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{provider.name}</h3>
                <p className="text-text-secondary text-sm">{provider.specialty}</p>
                <p className="text-text-muted text-xs mt-1">{provider.city}</p>
                {!provider.isVerified && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium border border-yellow-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Pending Verification
                  </span>
                )}
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors min-h-[44px] ${
                      activeTab === tab.key
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-text-secondary hover:bg-surface hover:text-primary"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-border">
                <button onClick={() => { logout(); router.push("/"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors min-h-[44px]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!editing ? (
                      <button onClick={() => { setEditForm(provider); setEditing(true); }}
                        className="btn btn-outline text-sm px-4 py-2 min-h-[40px]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(false)}
                          className="text-sm px-4 py-2 rounded-xl border border-border text-text-secondary hover:bg-surface min-h-[40px]">
                          Cancel
                        </button>
                        <button onClick={handleSaveProfile}
                          className="btn btn-primary text-sm px-4 py-2 min-h-[40px]">
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  {!editing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-text-muted mb-1">Full Name</p>
                          <p className="font-medium">{provider.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted mb-1">Email</p>
                          <p className="font-medium">{provider.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted mb-1">Phone</p>
                          <p className="font-medium">{provider.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted mb-1">Specialty</p>
                          <p className="font-medium">{provider.specialty}</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted mb-1">City</p>
                          <p className="font-medium">{provider.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted mb-1">Experience</p>
                          <p className="font-medium">{provider.experience} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted mb-1">Rate Range</p>
                          <p className="font-medium">{provider.rateRange || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted mb-1">Member Since</p>
                          <p className="font-medium">{new Date(provider.joinedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
                        </div>
                      </div>
                      {provider.bio && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-text-muted mb-1">Bio</p>
                          <p className="text-text-secondary leading-relaxed">{provider.bio}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Full Name</label>
                          <input type="text" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Phone</label>
                          <input type="tel" value={editForm.phone || ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Specialty</label>
                          <select value={editForm.specialty || ""} onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">City</label>
                          <select value={editForm.city || ""} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Years of Experience</label>
                          <input type="number" value={editForm.experience || ""} onChange={(e) => setEditForm({ ...editForm, experience: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Rate Range</label>
                          <input type="text" value={editForm.rateRange || ""} onChange={(e) => setEditForm({ ...editForm, rateRange: e.target.value })}
                            placeholder="e.g. ₹500 - ₹2,000/day"
                            className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Bio</label>
                        <textarea value={editForm.bio || ""} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={4} placeholder="Tell homeowners about yourself..."
                          className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "photos" && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Work Photos</h2>
                    <button onClick={() => setShowPhotoForm(!showPhotoForm)}
                      className="btn btn-primary text-sm px-4 py-2 min-h-[40px]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Photo
                    </button>
                  </div>

                  {showPhotoForm && (
                    <div className="p-4 bg-surface rounded-xl mb-6 border border-border">
                      <h3 className="font-medium mb-3">Add Work Photo</h3>
                      <div className="space-y-3">
                        <input type="text" value={photoForm.name} onChange={(e) => setPhotoForm({ ...photoForm, name: e.target.value })}
                          placeholder="Project name (e.g. Modern Kitchen Renovation)"
                          className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                        <textarea value={photoForm.description} onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                          placeholder="Brief description of the work..."
                          rows={2}
                          className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <svg className="w-10 h-10 text-text-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-text-secondary">Click to upload or drag and drop</p>
                          <p className="text-xs text-text-muted mt-1">JPG, PNG up to 5MB</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setShowPhotoForm(false)}
                            className="flex-1 py-2 px-4 rounded-xl border border-border text-text-secondary text-sm hover:bg-surface min-h-[40px]">
                            Cancel
                          </button>
                          <button onClick={handleAddPhoto}
                            className="flex-1 py-2 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light min-h-[40px]">
                            Save Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {provider.workPhotos.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-text-secondary mb-1">No work photos yet</p>
                      <p className="text-text-muted text-sm">Add photos of your projects to showcase your work</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {provider.workPhotos.map((photo) => (
                        <div key={photo.id} className="group relative">
                          <div className="aspect-square bg-surface rounded-xl flex items-center justify-center border border-border overflow-hidden">
                            <svg className="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="mt-2">
                            <p className="font-medium text-sm truncate">{photo.name}</p>
                            {photo.description && <p className="text-xs text-text-muted truncate">{photo.description}</p>}
                          </div>
                          <button onClick={() => removeWorkPhoto(photo.id)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Work Experience</h2>
                    <button onClick={() => setShowExpForm(!showExpForm)}
                      className="btn btn-primary text-sm px-4 py-2 min-h-[40px]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Experience
                    </button>
                  </div>

                  {showExpForm && (
                    <div className="p-4 bg-surface rounded-xl mb-6 border border-border">
                      <h3 className="font-medium mb-3">Add Work Experience</h3>
                      <div className="space-y-3">
                        <input type="text" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                          placeholder="Role (e.g. Senior Architect)"
                          className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input type="text" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                          placeholder="Company name"
                          className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" value={expForm.duration} onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                            placeholder="Duration (e.g. 2019 - Present)"
                            className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                          <input type="number" value={expForm.projects} onChange={(e) => setExpForm({ ...expForm, projects: e.target.value })}
                            placeholder="Projects done"
                            className="w-full px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setShowExpForm(false)}
                            className="flex-1 py-2 px-4 rounded-xl border border-border text-text-secondary text-sm hover:bg-surface min-h-[40px]">
                            Cancel
                          </button>
                          <button onClick={handleAddExperience}
                            className="flex-1 py-2 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light min-h-[40px]">
                            Save Experience
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {provider.workExperience.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-text-secondary mb-1">No work experience added yet</p>
                      <p className="text-text-muted text-sm">Add your professional history to build trust with clients</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {provider.workExperience.map((exp, i) => (
                        <div key={i} className="work-experience-card group relative">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-primary">{exp.role}</h4>
                              <p className="text-sm text-text-secondary">{exp.company}</p>
                              <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {exp.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                {exp.projects} projects
                              </span>
                              <button onClick={() => removeWorkExperience(i)}
                                className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-semibold mb-6">Services Offered</h2>

                  <div className="flex gap-2 mb-6">
                    <select value={newService} onChange={(e) => setNewService(e.target.value)}
                      className="flex-1 px-4 py-3 border border-border rounded-xl text-text-primary bg-white min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                      <option value="">Select a service to add</option>
                      {specialties.filter((s) => !provider.services.includes(s)).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button onClick={handleAddService}
                      className="btn btn-primary text-sm px-5 min-h-[48px]">
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {provider.services.map((svc) => (
                      <div key={svc} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium">{svc}</span>
                        </div>
                        <button onClick={() => handleRemoveService(svc)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {provider.services.length === 0 && (
                      <p className="text-text-muted text-sm text-center py-4">No services added yet</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-text-secondary">Account Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${provider.isVerified ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                        {provider.isVerified ? "✓ Verified" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-text-secondary">Email</span>
                      <span className="font-medium">{provider.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-text-secondary">Member Since</span>
                      <span className="font-medium">{new Date(provider.joinedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
