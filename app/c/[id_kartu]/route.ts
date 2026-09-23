import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ----------------------------------------------------------------
// GET /c/[id_kartu]
// ----------------------------------------------------------------
// This is the CRITICAL hot path. Every NFC tap and QR scan hits
// this route. It must respond with a redirect as fast as possible.
//
// Flow:
//  - Card NOT found           → 302 → /not-found
//  - Card found, is_active=false → 302 → /setup/[id_kartu]
//  - Card found, is_active=true  → 302 → redirect_url (Google Review)
// ----------------------------------------------------------------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id_kartu: string }> }
) {
  const { id_kartu } = await params;

  // Decode the ID in case it was URL-encoded
  const cardId = decodeURIComponent(id_kartu);

  // Single, indexed primary-key lookup — sub-millisecond on Supabase
  let card = await prisma.card.findUnique({
    where: { id_kartu: cardId },
    // Only select the two fields we need — minimises payload from DB
    select: {
      is_active: true,
      redirect_url: true,
    },
  });

  if (!card && cardId.toLowerCase() === "demo") {
    card = await prisma.card.upsert({
      where: { id_kartu: "demo" },
      update: {},
      create: {
        id_kartu: "demo",
        is_active: false,
      },
      select: {
        is_active: true,
        redirect_url: true,
      },
    });
  }

  // ── Card does not exist ──────────────────────────────────────
  if (!card) {
    return NextResponse.redirect(
      new URL("/not-found", _req.url),
      { status: 302 }
    );
  }

  // ── Card is inactive → send owner to setup wizard ────────────
  if (!card.is_active) {
    return NextResponse.redirect(
      new URL(
        `/setup/${encodeURIComponent(cardId)}`,
        _req.url
      ),
      { status: 302 }
    );
  }

  // ── Card is active → instant redirect to Google Review link ──
  // Fallback to home if redirect_url is somehow null (shouldn't happen)
  const destination =
    card.redirect_url ?? new URL("/", _req.url).toString();

  return NextResponse.redirect(destination, { status: 302 });
}
