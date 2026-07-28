import Link from "next/link";

interface ServiceCardProps {
  id: string;
  name: string;
  icon: string;
  description: string;
  slug: string;
}

export default function ServiceCard({
  name,
  icon,
  description,
  slug,
}: ServiceCardProps) {
  return (
    <Link
      href={`/search?service=${slug}`}
      className="card group flex flex-col items-center text-center hover:border-primary/30"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-text-secondary text-base">{description}</p>
    </Link>
  );
}
