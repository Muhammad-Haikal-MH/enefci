import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TapReview — Standee NFC & QR untuk Ulasan Google Bisnis Kamu",
};

const features = [
  {
    icon: "📶",
    title: "Ketuk, Selesai",
    desc: "Pelanggan cukup ketuk chip NFC atau pindai QR — langsung ke halaman ulasan Google tanpa instal aplikasi.",
  },
  {
    icon: "⚡",
    title: "Redirect Instan",
    desc: "Infrastruktur kami dirancang untuk sub-detik. Tidak ada loading screen yang membuat pelanggan bosan.",
  },
  {
    icon: "🛡️",
    title: "Kartu Aman",
    desc: "Setiap kartu dilindungi ID unik acak. Hanya pemilik bisnis yang bisa mengaktifkan kartu miliknya.",
  },
  {
    icon: "📊",
    title: "Pantau Ulasan",
    desc: "Semakin banyak ulasan Google = semakin tinggi peringkat lokal bisnismu. Mudah dan efektif.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl border-b border-white/5">
        <span
          className="text-lg font-bold"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TapReview
        </span>
        <a
          href="mailto:hello@tapreview.id"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Hubungi Kami
        </a>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #6366f1 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 text-xs text-indigo-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Khusus untuk UMKM Indonesia
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white max-w-3xl leading-tight mb-6">
          Lebih Banyak{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ulasan Google
          </span>{" "}
          dengan Satu Ketukan
        </h1>

        <p className="text-white/60 text-lg max-w-xl mb-10">
          Standee akrilik cantik dengan chip NFC & QR code. Pelangganmu ketuk,
          langsung keluar halaman ulasan Google. Sesimpel itu.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center">
          <a
            href="mailto:hello@tapreview.id?subject=Pesan%20Standee%20TapReview"
            id="cta-order"
            className="btn-primary text-center"
            style={{ width: "auto", padding: "0.875rem 2rem" }}
          >
            Pesan Standee Sekarang →
          </a>
          <Link
            href="/setup/demo"
            id="cta-demo"
            className="text-center px-8 py-3.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors font-medium text-sm"
          >
            Lihat Demo
          </Link>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-white mb-2">
          Cara Kerjanya
        </h2>
        <p className="text-center text-white/50 text-sm mb-10">
          Tiga langkah mudah — tidak butuh keahlian teknis
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Terima Standee",
              desc: "Kamu menerima standee akrilik dengan NFC & QR yang sudah tertanam link unik.",
            },
            {
              step: "02",
              title: "Aktifkan Online",
              desc: "Ketuk NFC-nya sekali, isi nama bisnis & PIN, dan kartu langsung terhubung ke Google.",
            },
            {
              step: "03",
              title: "Pasang & Nikmati",
              desc: "Letakkan di meja kasir. Setiap pelanggan yang ketuk akan diarahkan ke halaman ulasanmu.",
            },
          ].map((item) => (
            <div key={item.step} className="glass-card p-6">
              <div
                className="text-4xl font-black mb-3"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {item.step}
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-white mb-2">
          Kenapa TapReview?
        </h2>
        <p className="text-center text-white/50 text-sm mb-10">
          Dirancang dari awal untuk kemudahan UMKM
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6 flex gap-4">
              <span className="text-3xl shrink-0">{f.icon}</span>
              <div>
                <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-white/30 text-xs">
        © {new Date().getFullYear()} TapReview. Dibuat dengan ❤️ untuk UMKM
        Indonesia.
      </footer>
    </main>
  );
}
