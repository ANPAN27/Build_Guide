import Link from "next/link";

const tips = [
  {
    title: "How to Choose an Architect",
    desc: "Essential tips for selecting an architect who understands your vision and budget.",
    icon: "📋",
    slug: "how-to-choose-architect",
  },
  {
    title: "Architect vs Civil Engineer",
    desc: "Understand the difference and know who to hire for your project.",
    icon: "📐",
    slug: "architect-vs-civil-engineer",
  },
  {
    title: "Best Paint Types for Your Home",
    desc: "Comprehensive guide to different paint types, finishes, and applications.",
    icon: "🎨",
    slug: "types-of-paint",
  },
  {
    title: "Building Permission Guide",
    desc: "Step-by-step guide to obtaining building permissions in Indian cities.",
    icon: "📄",
    slug: "building-permissions",
  },
  {
    title: "Vastu Tips for Home Construction",
    desc: "Traditional Vastu principles for modern home design and construction.",
    icon: "🏠",
    slug: "vastu-tips",
  },
  {
    title: "How to Select a Contractor",
    desc: "Essential tips for hiring a reliable contractor for your project.",
    icon: "🔨",
    slug: "how-to-choose-contractor",
  },
];

export default function ConstructionTips() {
  return (
    <section className="section bg-surface">
      <div className="container">
        <div className="text-center mb-12">
          <h2>Construction Tips & Guides</h2>
          <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
            Expert advice to help you make informed decisions for your home project
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <Link
              key={tip.slug}
              href={`/guide/${tip.slug}`}
              className="card group hover:border-primary/30"
            >
              <div className="text-3xl mb-3">{tip.icon}</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {tip.title}
              </h3>
              <p className="text-text-secondary text-base">{tip.desc}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/guide" className="btn btn-outline">
            View All Guides
          </Link>
        </div>
      </div>
    </section>
  );
}
