import { notFound } from "next/navigation";
import Link from "next/link";
import guides from "@/data/guides.json";

export default async function GuideArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g: { slug: string }) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const contentHtml = guide.content
    .split("\n")
    .map((line: string) => {
      if (line.startsWith("## ")) {
        return `<h2 class="text-xl font-semibold mt-8 mb-3">${line.slice(3)}</h2>`;
      }
      if (line.startsWith("### ")) {
        return `<h3 class="text-lg font-semibold mt-6 mb-2">${line.slice(4)}</h3>`;
      }
      if (line.startsWith("- ")) {
        return `<li class="ml-4 text-text-secondary">${line.slice(2)}</li>`;
      }
      if (line.match(/^\d+\. /)) {
        return `<li class="ml-4 text-text-secondary list-decimal">${line.replace(/^\d+\.\s*/, "")}</li>`;
      }
      if (line.trim() === "") {
        return "<br/>";
      }
      return `<p class="text-text-secondary mb-2">${line}</p>`;
    })
    .join("\n");

  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/guide"
            className="inline-flex items-center gap-1 text-primary hover:underline mb-6 text-base"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all guides
          </Link>

          <article>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                {guide.category}
              </span>
              <span className="text-sm text-text-muted">
                {guide.publishedAt}
              </span>
            </div>

            <h1 className="mb-6">{guide.title}</h1>
            <p className="text-lg text-text-secondary mb-8">{guide.excerpt}</p>

            <div
              className="prose-style"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>

          <div className="mt-12 p-6 bg-surface rounded-2xl border border-border">
            <h3 className="text-lg font-semibold mb-2">
              Need Professional Help?
            </h3>
            <p className="text-text-secondary mb-4">
              Find verified professionals in your city to help with your project.
            </p>
            <Link href="/search" className="btn btn-primary">
              Find Professionals Near You
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
