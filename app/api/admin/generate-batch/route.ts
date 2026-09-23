import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma";
import { generateCardId, buildCardUrl } from "@/lib/utils";

// ----------------------------------------------------------------
// POST /api/admin/generate-batch
// ----------------------------------------------------------------
// Hidden utility endpoint to pre-populate the database with blank
// card rows and return composited card images (Template + QR).
//
// Protection: Bearer token in Authorization header must match
//             the ADMIN_SECRET environment variable.
//
// Request body (JSON):
//   {
//     count?:       number  — How many cards to generate (default 100, max 500)
//     startIndex?:  number  — Starting sequential number (default 1)
//   }
//
// Response:
//   200 { generated: number, cards: Array<CardResult> }
//   401 { error: "Unauthorized" }
//   400 { error: string }
//
// CardResult:
//   {
//     id_kartu:   string   — e.g. "UMKM-001-A7X9"
//     scan_url:   string   — e.g. "https://my-domain.com/c/UMKM-001-A7X9"
//     final_base64: string — data:image/jpeg;base64,... (Ready to print)
//   }
// ----------------------------------------------------------------

export async function POST(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse body ───────────────────────────────────────────────
  let body: { count?: number; startIndex?: number } = {};
  try {
    body = (await req.json()) as { count?: number; startIndex?: number };
  } catch {
    // Body is optional — defaults apply
  }

  const count = Math.min(body.count ?? 100, 500); // hard cap at 500
  const startIndex = body.startIndex ?? 1;

  if (count < 1 || startIndex < 1) {
    return NextResponse.json(
      { error: "count and startIndex must be positive integers" },
      { status: 400 }
    );
  }

  // ── Determine template path ──────────────────────────────────
  // Checks public/card/card.jpeg, app/card/card.jpeg, or public/template.jpg
  let templatePath = path.join(process.cwd(), "public", "card", "card.jpeg");
  if (!fs.existsSync(templatePath)) {
    templatePath = path.join(process.cwd(), "app", "card", "card.jpeg");
  }
  if (!fs.existsSync(templatePath)) {
    templatePath = path.join(process.cwd(), "public", "template.jpg");
  }

  if (!fs.existsSync(templatePath)) {
    return NextResponse.json(
      { error: "Template image not found (checked public/card/card.jpeg and app/card/card.jpeg)" },
      { status: 500 }
    );
  }

  const templateBuffer = fs.readFileSync(templatePath);

  // ── Generate card IDs & insert rows ──────────────────────────
  type CardResult = {
    id_kartu: string;
    scan_url: string;
    final_base64: string;
  };

  const results: CardResult[] = [];
  const rowsToInsert: { id_kartu: string }[] = [];

  for (let i = 0; i < count; i++) {
    const id_kartu = generateCardId(startIndex + i);
    const scan_url = buildCardUrl(id_kartu);

    // Generate QR code as a buffer
    const qrBuffer = await QRCode.toBuffer(scan_url, {
      errorCorrectionLevel: "H",
      width: 400,
      margin: 1, // smaller margin to fit well
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Resize the QR code to exactly cover the drawn guideline box (395x372)
    // A slight stretch is used but it remains perfectly scannable.
    const resizedQrBuffer = await sharp(qrBuffer)
      .resize(395, 372, { fit: "fill" })
      .toBuffer();

    // Composite QR code onto template
    const compositedBuffer = await sharp(templateBuffer)
      .composite([
        {
          input: resizedQrBuffer,
          top: 190,
          left: 66,
        },
      ])
      .jpeg()
      .toBuffer();

    const final_base64 = `data:image/jpeg;base64,${compositedBuffer.toString("base64")}`;

    results.push({ id_kartu, scan_url, final_base64 });
    rowsToInsert.push({ id_kartu });
  }

  // Insert all rows — skipDuplicates prevents crash if some IDs already exist
  const { count: inserted } = await prisma.card.createMany({
    data: rowsToInsert,
    skipDuplicates: true,
  });

  return NextResponse.json(
    {
      generated: inserted,
      skipped: count - inserted,
      cards: results,
    },
    { status: 200 }
  );
}
