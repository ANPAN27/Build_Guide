import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { Errors } from "../../utils/errors.js";

export async function listProviders(query: {
  q?: string; city?: string; specialty?: string; verified?: string; minExperience?: number;
  sort: "rating" | "experience" | "newest"; page: number; limit: number;
}) {
  const where: Prisma.ProviderProfileWhereInput = { deletedAt: null };
  if (query.city) where.city = { equals: query.city, mode: "insensitive" };
  if (query.specialty) where.specialty = { equals: query.specialty, mode: "insensitive" };
  if (query.verified === "true") where.isVerified = true;
  if (query.verified === "false") where.isVerified = false;
  if (query.minExperience !== undefined) where.experienceYears = { gte: query.minExperience };
  if (query.q) {
    where.OR = [
      { displayName: { contains: query.q, mode: "insensitive" } },
      { specialty: { contains: query.q, mode: "insensitive" } },
      { city: { contains: query.q, mode: "insensitive" } },
      { bio: { contains: query.q, mode: "insensitive" } },
    ];
  }
  const orderBy: Prisma.ProviderProfileOrderByWithRelationInput[] =
    query.sort === "experience" ? [{ experienceYears: "desc" }, { ratingAverage: "desc" }]
    : query.sort === "newest" ? [{ createdAt: "desc" }]
    : [{ ratingAverage: "desc" }, { reviewCount: "desc" }];

  const [total, items] = await Promise.all([
    prisma.providerProfile.count({ where }),
    prisma.providerProfile.findMany({
      where, orderBy, skip: (query.page - 1) * query.limit, take: query.limit,
      include: { services: { select: { id: true, name: true } }, portfolios: { select: { id: true, title: true, imageUrl: true }, take: 1 } },
    }),
  ]);

  return {
    items: items.map(publicProvider),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  };
}

export async function getProviderById(id: string) {
  const provider = await prisma.providerProfile.findFirst({
    where: { id, deletedAt: null },
    include: {
      services: { select: { id: true, name: true, description: true } },
      portfolios: { orderBy: { createdAt: "desc" }, select: { id: true, title: true, description: true, imageUrl: true, createdAt: true } },
      reviews: { where: { status: "VISIBLE", deletedAt: null }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, rating: true, title: true, body: true, createdAt: true, author: { select: { name: true } } } },
    },
  });
  if (!provider) throw Errors.notFound("Provider not found");
  return publicProviderDetail(provider);
}

export async function getMyProviderProfile(userId: string) {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
    include: { services: true, portfolios: { orderBy: { createdAt: "desc" } }, verifications: { orderBy: { createdAt: "desc" }, take: 5 } },
  });
  if (!provider) throw Errors.notFound("Provider profile not found");
  return provider;
}

type ProviderUpdateInput = {
  displayName?: string; specialty?: string; city?: string; experienceYears?: number; bio?: string;
  rateRange?: string | null; phone?: string | null; whatsapp?: string | null; publicEmail?: string | null; website?: string | null; address?: string | null;
};

export async function updateMyProviderProfile(userId: string, data: Record<string, unknown>) {
  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!provider) throw Errors.notFound("Provider profile not found");
  const d = data as ProviderUpdateInput;
  const { displayName, specialty, city, experienceYears, bio, rateRange, phone, whatsapp, publicEmail, website, address } = d;
  return prisma.providerProfile.update({
    where: { id: provider.id },
    data: {
      ...(displayName !== undefined ? { displayName } : {}),
      ...(specialty !== undefined ? { specialty } : {}),
      ...(city !== undefined ? { city } : {}),
      ...(experienceYears !== undefined ? { experienceYears } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(rateRange !== undefined ? { rateRange } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(whatsapp !== undefined ? { whatsapp } : {}),
      ...(publicEmail !== undefined ? { publicEmail } : {}),
      ...(website !== undefined ? { website } : {}),
      ...(address !== undefined ? { address } : {}),
    },
    include: { services: true, portfolios: true },
  });
}

export async function addService(userId: string, name: string, description?: string | null) {
  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!provider) throw Errors.notFound("Provider profile not found");
  return prisma.providerService.create({ data: { providerId: provider.id, name, description: description ?? null } });
}

export async function removeService(userId: string, serviceId: string) {
  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!provider) throw Errors.notFound("Provider profile not found");
  const svc = await prisma.providerService.findUnique({ where: { id: serviceId } });
  if (!svc || svc.providerId !== provider.id) throw Errors.notFound("Service not found");
  await prisma.providerService.delete({ where: { id: serviceId } });
}

export async function addPortfolio(userId: string, data: { title: string; description?: string | null; imageUrl?: string | null }) {
  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!provider) throw Errors.notFound("Provider profile not found");
  return prisma.providerPortfolio.create({ data: { providerId: provider.id, title: data.title, description: data.description ?? null, imageUrl: data.imageUrl ?? null } });
}

export async function removePortfolio(userId: string, portfolioId: string) {
  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!provider) throw Errors.notFound("Provider profile not found");
  const item = await prisma.providerPortfolio.findUnique({ where: { id: portfolioId } });
  if (!item || item.providerId !== provider.id) throw Errors.notFound("Portfolio item not found");
  await prisma.providerPortfolio.delete({ where: { id: portfolioId } });
}

type PublicProvider = {
  id: string; displayName: string; specialty: string; city: string; experienceYears: number; bio: string; rateRange: string | null;
  isVerified: boolean; verificationStatus: string; ratingAverage: unknown; reviewCount: number;
  services: { id: string; name: string; description?: string | null }[];
  portfolios: { id: string; title: string; description?: string | null; imageUrl?: string | null; createdAt?: Date }[];
  phone?: string | null; whatsapp?: string | null; publicEmail?: string | null; website?: string | null; address?: string | null;
  reviews?: { id: string; rating: number; title: string | null; body: string; createdAt: Date; author: { name: string } }[];
};

function publicProvider(p: PublicProvider) {
  return {
    id: p.id, displayName: p.displayName, specialty: p.specialty, city: p.city,
    experienceYears: p.experienceYears, bio: p.bio, rateRange: p.rateRange,
    isVerified: p.isVerified, verificationStatus: p.verificationStatus,
    ratingAverage: Number(p.ratingAverage), reviewCount: p.reviewCount,
    services: p.services, portfolios: p.portfolios,
  };
}

function publicProviderDetail(p: PublicProvider) {
  return {
    ...publicProvider(p),
    phone: p.phone ?? null, whatsapp: p.whatsapp ?? null, publicEmail: p.publicEmail ?? null, website: p.website ?? null, address: p.address ?? null,
    reviews: (p.reviews ?? []).map((r) => ({ id: r.id, rating: r.rating, title: r.title, body: r.body, createdAt: r.createdAt, authorName: r.author.name })),
  };
}
