import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { ok } from "../../utils/http.js";
import { parseBody } from "../../utils/validate.js";

const cityRates: Record<string, { basic: number; standard: number; premium: number }> = {
  Mumbai: { basic: 1800, standard: 2500, premium: 3500 },
  Delhi: { basic: 1600, standard: 2300, premium: 3200 },
  Bangalore: { basic: 1700, standard: 2400, premium: 3300 },
  Chennai: { basic: 1500, standard: 2100, premium: 3000 },
  Kolkata: { basic: 1400, standard: 2000, premium: 2800 },
  Hyderabad: { basic: 1500, standard: 2200, premium: 3100 },
  Pune: { basic: 1700, standard: 2400, premium: 3400 },
  Ahmedabad: { basic: 1400, standard: 2000, premium: 2800 },
  Jaipur: { basic: 1300, standard: 1900, premium: 2700 },
  Nagpur: { basic: 1300, standard: 1800, premium: 2600 },
  Lucknow: { basic: 1350, standard: 1850, premium: 2650 },
  Kochi: { basic: 1550, standard: 2150, premium: 3050 },
  Indore: { basic: 1250, standard: 1750, premium: 2550 },
  Bhopal: { basic: 1200, standard: 1700, premium: 2500 },
  Surat: { basic: 1350, standard: 1900, premium: 2700 },
  Nashik: { basic: 1300, standard: 1800, premium: 2600 },
  Visakhapatnam: { basic: 1400, standard: 1950, premium: 2750 },
};
const defaultRates = { basic: 1500, standard: 2200, premium: 3000 };

const estimateSchema = z.object({
  city: z.string().trim().min(2).max(100),
  areaSqFt: z.coerce.number().positive().max(100000),
  floors: z.coerce.number().int().min(1).max(20),
  quality: z.enum(["basic", "standard", "premium"]),
  includeInterior: z.coerce.boolean().default(false),
}).strict();

export async function estimateRoutes(app: FastifyInstance) {
  app.post("/estimates", async (request, reply) => {
    const body = parseBody(estimateSchema, request.body);
    const rates = cityRates[body.city] ?? defaultRates;
    const ratePerSqFt = rates[body.quality];
    const builtUpArea = body.areaSqFt * body.floors;
    const constructionCost = builtUpArea * ratePerSqFt;
    const interiorCost = body.includeInterior ? constructionCost * 0.4 : 0;
    const totalEstimate = constructionCost + interiorCost;
    const breakdown = { ratePerSqFt, builtUpArea, constructionCost, interiorCost, totalEstimate };
    await prisma.constructionEstimate.create({
      data: {
        userId: request.authUser?.id ?? null,
        city: body.city, areaSqFt: body.areaSqFt, floors: body.floors, quality: body.quality,
        includeInterior: body.includeInterior, totalEstimate, breakdown,
      },
    });
    return ok(reply, { estimate: breakdown });
  });
}
