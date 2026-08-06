import Link from "next/link";
import Image from "next/image";

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
      <div className="w-16 h-16 mb-4 flex items-center justify-center">
        <Image
          src={icon}
          alt={`${name} icon`}
          className="w-14 h-14 object-contain"
          width={56}
          height={56}
        />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-text-secondary text-base">{description}</p>
    </Link>
  );
}
