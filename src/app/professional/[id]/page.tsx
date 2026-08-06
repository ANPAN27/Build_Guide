"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import professionals from "@/data/professionals.json";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  city: string;
  experience: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  type: string;
  photo: string;
  gallery: string[];
  description: string;
  contact: { phone: string; whatsapp: string; email: string };
  location: { lat: number; lng: number; address: string };
}

const reviews = [
  { name: "Anil Sharma", rating: 5, text: "Excellent work! Completed the project on time and within budget. Highly recommend.", date: "2 months ago" },
  { name: "Priya Patel", rating: 5, text: "Very professional and attentive to details. Our home looks beautiful.", date: "1 month ago" },
  { name: "Ravi Kumar", rating: 4, text: "Good experience overall. Communicative and skilled team.", date: "3 months ago" },
];

export default function ProfessionalProfile() {
  const params = useParams();
  const pro = (professionals as Professional[]).find((p) => p.id === params.id);

  if (!pro) {
    return (
      <div className="section">
        <div className="container text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h2>Professional Not Found</h2>
          <p className="text-text-secondary mt-3 mb-6">The professional you are looking for does not exist.</p>
          <Link href="/search" className="btn btn-primary">
            Browse Professionals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-border">
        <div className="container">
          <div className="py-4">
            <Link href="/search" className="text-primary hover:underline text-base inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to results
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white">
        <div className="container">
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0">
                {pro.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-2xl md:text-4xl font-bold">{pro.name}</h1>
                  {pro.verified && <span className="bg-verified text-white px-3 py-1 rounded-full text-sm font-semibold">✓ Verified</span>}
                </div>
                <p className="text-lg text-blue-100 mb-3">{pro.specialty}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
                  <span>🕐 {pro.experience} years experience</span>
                  <span>📍 {pro.location.address}</span>
                  <span className="capitalize">🏠 {pro.type}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
              <a href={`tel:${pro.contact.phone}`} className="btn bg-secondary text-white border-secondary hover:bg-secondary-light text-lg py-4 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              <a href={`https://wa.me/${pro.contact.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="btn bg-[#25d366] text-white border-[#25d366] hover:brightness-110 text-lg py-4 shadow-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="section bg-surface">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-text-secondary leading-relaxed">{pro.description}</p>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Project Gallery</h2>
                <div className="grid grid-cols-3 gap-3">
                  {pro.gallery.map((img: string, i: number) => (
                    <div key={i} className="aspect-square bg-surface-dark rounded-xl flex items-center justify-center text-text-muted text-sm">
                      🖼️ Photo {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Customer Reviews</h2>
                  <span className="flex items-center gap-1 text-star font-semibold">
                    {pro.rating} ★
                  </span>
                </div>
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <div key={i} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.name}</span>
                        <span className="text-sm text-text-muted">{review.date}</span>
                      </div>
                      <div className="stars text-sm mb-1">
                        {Array(review.rating).fill("★").join("")}
                      </div>
                      <p className="text-text-secondary">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{pro.contact.phone}</p>
                      <p className="text-xs text-green-600 font-medium">✓ Phone Verified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{pro.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{pro.location.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg mb-4">Trust Signals</h3>
                <div className="space-y-3">
                  {pro.verified && (
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">✓</span>
                      <span>Verified Professional</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold">✓</span>
                    <span>Phone Verified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold">✓</span>
                    <span>GST Registered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold">✓</span>
                    <span>{pro.experience}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold">✓</span>
                    <span>{pro.reviewCount}+ customer reviews</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="aspect-video bg-surface-dark rounded-xl flex items-center justify-center text-text-muted">
                  🗺️ Map View
                </div>
                <p className="text-sm text-text-secondary mt-2">{pro.location.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-border p-3 z-40 flex gap-3 shadow-lg">
        <a href={`tel:${pro.contact.phone}`} className="btn btn-primary flex-1 text-base py-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Now
        </a>
        <a href={`https://wa.me/${pro.contact.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
          className="btn bg-[#25d366] text-white border-[#25d366] hover:brightness-110 flex-1 text-base py-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </>
  );
}
