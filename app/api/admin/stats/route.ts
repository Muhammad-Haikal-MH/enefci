import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Fetch stats ───────────────────────────────────────────────
  try {
    const totalCards = await prisma.card.count();
    const activeCards = await prisma.card.count({
      where: { is_active: true },
    });

    return NextResponse.json({ totalCards, activeCards }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
