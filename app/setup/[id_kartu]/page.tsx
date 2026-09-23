import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SetupForm from "@/components/SetupForm";

interface Props {
  params: Promise<{ id_kartu: string }>;
}

// Generate page-level metadata with the card ID
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id_kartu } = await params;
  return {
    title: `Aktivasi Kartu ${decodeURIComponent(id_kartu)}`,
    description:
      "Aktifkan standee NFC/QR kamu dan mulai kumpulkan ulasan Google secara instan.",
  };
}

// This is a Server Component — fetches card data on the server
// so the client receives a pre-validated page, not a loading state.
export default async function SetupPage({ params }: Props) {
  const { id_kartu } = await params;
  const cardId = decodeURIComponent(id_kartu);

  // Verify card exists before rendering the setup UI
  let card = await prisma.card.findUnique({
    where: { id_kartu: cardId },
    select: { is_active: true },
  });

  // Provide a built-in demo card so /setup/demo can always be tested
  if (!card && cardId.toLowerCase() === "demo") {
    card = await prisma.card.upsert({
      where: { id_kartu: "demo" },
      update: {},
      create: {
        id_kartu: "demo",
        is_active: false,
      },
      select: { is_active: true },
    });
  }

  // Card doesn't exist
  if (!card) {
    notFound();
  }

  // Card already activated — shouldn't normally reach here (route.ts handles it)
  // but this is a safety net for direct navigation to /setup/[id]
  if (card.is_active) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4 py-12">
        <div className="glass-card p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-white mb-2">
            Kartu Sudah Aktif
          </h1>
          <p className="text-white/60 text-sm">
            Kartu <span className="text-indigo-300 font-mono">{cardId}</span>{" "}
            sudah diaktifkan sebelumnya.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-12">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="glass-card p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo mark */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            }}
          >
            <span className="text-2xl">📶</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">
            Aktifkan Standee Kamu
          </h1>
          <p className="text-white/50 text-sm">
            Hubungkan standee ini ke bisnis kamu agar pelanggan bisa langsung
            meninggalkan ulasan Google.
          </p>

          {/* Card ID badge */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-white/60">ID Kartu:</span>
            <span className="text-xs font-mono text-indigo-300 font-semibold">
              {cardId}
            </span>
          </div>
        </div>

        {/* Activation form — client component */}
        <SetupForm idKartu={cardId} />

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-white/30">
          Dengan mengaktifkan, kamu setuju dengan{" "}
          <Link
            href="/"
            className="text-indigo-400/70 hover:text-indigo-400 transition-colors underline underline-offset-2"
          >
            Syarat &amp; Ketentuan
          </Link>{" "}
          TapReview.
        </p>
      </div>
    </main>
  );
}
