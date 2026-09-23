import { PrismaClient } from "@prisma/client";

// ----------------------------------------------------------------
// Prisma Client Singleton
// ----------------------------------------------------------------
// In development, Next.js hot-reloads modules, which would create
// a new PrismaClient instance on every reload and exhaust the
// database connection pool. We store the client on the global
// object to reuse it across hot reloads.
// In production, module-level singletons work fine.
// ----------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
