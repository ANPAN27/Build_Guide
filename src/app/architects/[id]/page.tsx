import Link from "next/link";
import { notFound } from "next/navigation";
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

export function generateStaticParams() {
  return (architects as Architect[]).map((a) => ({ id: a.id }));
}

export default async function ArchitectProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const arch = (architects as Architect[]).find((a) => a.id === id);

  if (!arch) {
    notFound();
  }

  const contactItems = [
    { label: "Registration No", value: arch.registrationNo, icon: "reg" },
    { label: "Firm / Office", value: arch.firm, icon: "firm" },
    { label: "Postal Address", value: arch.address, icon: "address" },
    { label: "Contact", value: arch.contact, icon: "phone" },
    { label: "Email", value: arch.email, icon: "email" },
    { label: "Email Username", value: arch.emailUsername, icon: "user" },
  ].filter((c) => c.value);

  return (
    <>
      <div className="bg-white border-b border-border">
        <div className="container">
          <div className="py-4">
            <Link href="/architects" className="text-primary hover:underline text-base inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Architects Directory
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white">
        <div className="container">
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0">
                {arch.name ? arch.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "AR"}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{arch.name || "Architect"}</h1>
                {arch.firm && <p className="text-lg text-blue-100 mb-3">{arch.firm}</p>}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {arch.city}
                  </span>
                  {arch.registrationNo && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      {arch.registrationNo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section bg-surface">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Profile Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {contactItems.map((item) => (
                    <div key={item.label}>
                      <p className="text-sm text-text-muted font-medium mb-1">{item.label}</p>
                      <p className="font-medium break-words">{item.value}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-sm text-text-muted font-medium mb-1">City</p>
                    <p className="font-medium">{arch.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted font-medium mb-1">Record #</p>
                    <p className="font-medium">{arch.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <div className="space-y-3">
                  {arch.contact && (
                    <a href={`tel:${arch.contact.replace(/[^0-9+]/g, "")}`} className="btn btn-primary w-full text-center text-base py-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </a>
                  )}
                  {arch.email && !arch.email.includes("...") && (
                    <a href={`mailto:${arch.email}`} className="btn btn-outline w-full text-center text-base py-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </a>
                  )}
                  {arch.email && arch.email.includes("...") && (
                    <a href="mailto:" className="btn btn-outline w-full text-center text-base py-3 cursor-default">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {arch.email}
                    </a>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-lg mb-4">Directory Info</h3>
                <ul className="space-y-3 text-sm text-text-secondary">
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">✓</span>
                    Registered Architect, {arch.city}
                  </li>
                  {arch.registrationNo && (
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">✓</span>
                      Council Registration: {arch.registrationNo}
                    </li>
                  )}
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">✓</span>
                    Council Record # {arch.id}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}