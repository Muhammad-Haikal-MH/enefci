import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ----------------------------------------------------------------
// POST /api/activate
// ----------------------------------------------------------------
// Activates a card for the first time. Called from the setup page
// after the UMKM owner sets their maps URL and a PIN.
//
// Request body (JSON):
//   {
//     id_kartu:      string   — e.g. "UMKM-001-A7X9"
//     maps_url:      string   — URL to Google Maps location
//     password:      string   — plain-text PIN (4–8 chars)
//   }
//
// Response:
//   200 { success: true, redirect_url: string }
//   400 { error: string }
//   404 { error: "Card not found" }
//   409 { error: "Card is already activated" }
// ----------------------------------------------------------------

export async function POST(req: NextRequest) {
  let body: unknown;

  // ── Parse body ───────────────────────────────────────────────
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id_kartu, maps_url, password } =
    body as Record<string, string>;

  // ── Validate required fields ─────────────────────────────────
  if (!id_kartu || !maps_url || !password) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: id_kartu, maps_url, password",
      },
      { status: 400 }
    );
  }

  if (password.length < 4 || password.length > 8) {
    return NextResponse.json(
      { error: "PIN must be between 4 and 8 characters" },
      { status: 400 }
    );
  }

  // ── Look up the card ─────────────────────────────────────────
  const existingCard = await prisma.card.findUnique({
    where: { id_kartu },
    select: { is_active: true },
  });

  if (!existingCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // Prevent double-activation
  if (existingCard.is_active) {
    return NextResponse.json(
      { error: "Card is already activated" },
      { status: 409 }
    );
  }

  // ── Hash the PIN ─────────────────────────────────────────────
  const password_hash = await bcrypt.hash(password, 10);

  // ── Update the database row ───────────────────────────────────
  await prisma.card.update({
    where: { id_kartu },
    data: {
      redirect_url: maps_url,
      password_hash,
      is_active: true,
    },
  });

  return NextResponse.json(
    { success: true, redirect_url: maps_url },
    { status: 200 }
  );
}
