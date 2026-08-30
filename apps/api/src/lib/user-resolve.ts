import prisma from "../prisma";

export async function resolveDbUserId(clerkId: string | undefined): Promise<string | null> {
  if (!clerkId) return null;
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function ensureDbUser(clerkId: string, email?: string): Promise<string | null> {
  const existing = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (existing) return existing.id;

  if (!email) return null;
  const created = await prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, email, plan: "FREE" },
    update: { email },
    select: { id: true },
  });
  return created.id;
}
