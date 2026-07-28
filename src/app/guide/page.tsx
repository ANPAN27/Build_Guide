import Link from "next/link";
import guides from "@/data/guides.json";

export default function GuidePage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-3">Home Owner Guide</h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need to know about home construction, renovation, and
              maintenance. Expert advice for Indian homeowners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide: { id: string; slug: string; title: string; excerpt: string; category: string; publishedAt: string }, index: number) => (
              <Link
                key={guide.id}
                href={`/guide/${guide.slug}`}
                className="card group hover:border-primary/30 fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-1 mb-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {guide.category}
                  </span>
                  <span className="text-xs text-text-muted px-2.5 py-1">
                    {guide.publishedAt}
                  </span>
                </div>
                <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {guide.title}
                </h2>
                <p className="text-text-secondary text-base">
                  {guide.excerpt}
                </p>
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  Read more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
