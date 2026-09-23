import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kartu Tidak Ditemukan",
};

export default function NotFoundPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🪪</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Kartu Tidak Ditemukan
        </h1>
        <p className="text-white/60 text-sm mb-6">
          ID kartu yang kamu pindai tidak terdaftar di sistem kami. Pastikan
          kamu menggunakan standee resmi TapReview.
        </p>
        <Link
          href="/"
          className="btn-primary inline-block text-center no-underline"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
