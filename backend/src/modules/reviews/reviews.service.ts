import { prisma } from "../../lib/prisma.js";
import { Errors } from "../../utils/errors.js";

async function refreshProviderRating(providerId: string) {
  const agg = await prisma.review.aggregate({ where: { providerId, status: "VISIBLE", deletedAt: null }, _avg: { rating: true }, _count: { rating: true } });
  await prisma.providerProfile.update({ where: { id: providerId }, data: { ratingAverage: agg._avg.rating ?? 0, reviewCount: agg._count.rating } });
}

export async function listProviderReviews(providerId: string) {
  const provider = await prisma.providerProfile.findFirst({ where: { id: providerId, deletedAt: null } });
  if (!provider) throw Errors.notFound("Provider not found");
  return prisma.review.findMany({
    where: { providerId, status: "VISIBLE", deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, rating: true, title: true, body: true, createdAt: true, author: { select: { name: true } } },
  });
}

export async function createReview(providerId: string, authorId: string, data: { rating: number; title?: string | null; body: string }) {
  const provider = await prisma.providerProfile.findFirst({ where: { id: providerId, deletedAt: null } });
  if (!provider) throw Errors.notFound("Provider not found");
  if (provider.userId === authorId) throw Errors.badRequest("Cannot review your own profile");
  try {
    const review = await prisma.review.create({ data: { providerId, authorId, rating: data.rating, title: data.title ?? null, body: data.body } });
    await refreshProviderRating(providerId);
    return review;
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "P2002") throw Errors.conflict("You have already reviewed this provider");
    throw e;
  }
}

export async function deleteOwnReview(reviewId: string, authorId: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.deletedAt) throw Errors.notFound("Review not found");
  if (review.authorId !== authorId) throw Errors.forbidden();
  await prisma.review.update({ where: { id: reviewId }, data: { deletedAt: new Date(), status: "REMOVED" } });
  await refreshProviderRating(review.providerId);
}
