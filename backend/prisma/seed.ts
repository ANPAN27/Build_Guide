import { PrismaClient, UserRole, VerificationStatus } from "@prisma/client";
import argon2 from "argon2";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    ["Architects", "architects"], ["Interior Designers", "interior-designers"], ["Painters", "painters"],
    ["Contractors", "contractors"], ["Civil Engineers", "civil-engineers"], ["Electricians", "electricians"],
    ["Plumbers", "plumbers"], ["Landscapers", "landscapers"],
  ];
  for (const [name, slug] of categories as [string,string][]) {
    await prisma.professionalCategory.upsert({ where: { slug }, update: { name }, create: { name, slug } });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await argon2.hash(adminPassword, { type: argon2.argon2id });
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: { role: UserRole.ADMIN },
      create: {
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: UserRole.ADMIN,
        name: "Administrator",
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
    console.log("Seeded admin account from environment variables");
  } else {
    console.log("Skipping admin seed; set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one");
  }

  // Seed sample providers from existing JSON if present (no passwords)
  const dataPath = path.resolve(process.cwd(), "../src/data/professionals.json");
  if (fs.existsSync(dataPath)) {
    const raw = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const items = Array.isArray(raw) ? raw.slice(0, 20) : [];
    for (const p of items) {
      const email = `seed-${p.id}@example.invalid`;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) continue;
      const passwordHash = await argon2.hash(`Seeded!${p.id}ChangeMe`, { type: argon2.argon2id });
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: { email, passwordHash, role: UserRole.PROVIDER, name: p.name, isEmailVerified: true, emailVerifiedAt: new Date() },
        });
        const profile = await tx.providerProfile.create({
          data: {
            userId: user.id, displayName: p.name, specialty: p.specialty || "Contractors", city: p.city || "Mumbai",
            experienceYears: Number(p.experience) || 0, bio: p.description || "", isVerified: !!p.verified,
            verificationStatus: p.verified ? VerificationStatus.APPROVED : VerificationStatus.PENDING,
            verifiedAt: p.verified ? new Date() : null, ratingAverage: Number(p.rating) || 0, reviewCount: Number(p.reviewCount) || 0,
            phone: p.contact?.phone, whatsapp: p.contact?.whatsapp, publicEmail: p.contact?.email, address: p.location?.address,
          },
        });
        await tx.providerService.create({ data: { providerId: profile.id, name: p.specialty || "General" } });
      });
    }
    console.log(`Seeded ${items.length} sample providers`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
