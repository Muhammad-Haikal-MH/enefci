"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SetupFormProps {
  idKartu: string;
}

type Step = "form" | "submitting" | "success" | "error";

export default function SetupForm({ idKartu }: SetupFormProps) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [mapsUrl, setMapsUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  // ── Handlers ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // ── Client-side validation ────────────────────────────────
    if (!mapsUrl.trim() || !mapsUrl.startsWith("http")) {
      setErrorMsg("Harap masukkan URL Google Maps yang valid (dimulai dengan http).");
      return;
    }

    if (password.length < 4) {
      setErrorMsg("PIN harus minimal 4 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("PIN dan konfirmasi PIN tidak cocok.");
      return;
    }

    // ── Submit to API ─────────────────────────────────────────
    setStep("submitting");

    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_kartu: idKartu,
          maps_url: mapsUrl.trim(),
          password,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        redirect_url?: string;
        error?: string;
      };

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? "Terjadi kesalahan. Silakan coba lagi.");
        setStep("error");
        return;
      }

      setRedirectUrl(data.redirect_url ?? "");
      setStep("success");
    } catch {
      setErrorMsg("Gagal terhubung ke server. Periksa koneksi internet kamu.");
      setStep("error");
    }
  };

  // ── Success Screen ───────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Kartu Berhasil Diaktifkan!
        </h2>
        <p className="text-white/60 text-sm mb-1">
          Sekarang siapapun yang mengetuk atau memindai standee kamu akan
          langsung diarahkan ke link lokasi Google Maps kamu.
        </p>
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block mt-6 text-center no-underline"
        >
          Coba Buka Link ↗
        </a>
      </div>
    );
  }

  // ── Main Form ────────────────────────────────────────────────
  const isSubmitting = step === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Google Maps URL Input */}
      <div>
        <label
          htmlFor="maps-url"
          className="block text-sm font-medium text-white/70 mb-1.5"
        >
          Link Google Maps Lokasi Bisnis <span className="text-indigo-400">*</span>
        </label>
        <input
          id="maps-url"
          type="url"
          placeholder="https://maps.app.goo.gl/..."
          className="input-field"
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-white/40">
          Paste link lokasi bisnismu dari aplikasi Google Maps.
        </p>
      </div>

      {/* PIN Input */}
      <div>
        <label
          htmlFor="pin-input"
          className="block text-sm font-medium text-white/70 mb-1.5"
        >
          Buat PIN <span className="text-indigo-400">*</span>
        </label>
        <input
          id="pin-input"
          type="password"
          placeholder="Minimal 4 karakter"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={4}
          maxLength={8}
          required
          disabled={isSubmitting}
          autoComplete="new-password"
        />
        <p className="mt-1 text-xs text-white/40">
          PIN digunakan untuk mengedit kartu kamu di masa mendatang.
        </p>
      </div>

      {/* Confirm PIN */}
      <div>
        <label
          htmlFor="pin-confirm"
          className="block text-sm font-medium text-white/70 mb-1.5"
        >
          Konfirmasi PIN <span className="text-indigo-400">*</span>
        </label>
        <input
          id="pin-confirm"
          type="password"
          placeholder="Ulangi PIN kamu"
          className="input-field"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={4}
          maxLength={8}
          required
          disabled={isSubmitting}
          autoComplete="new-password"
        />
      </div>

      {/* Error message */}
      {(step === "error" || errorMsg) && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-500/15 border border-red-500/30 px-3 py-2.5"
        >
          <span className="text-red-400 mt-0.5 shrink-0">⚠</span>
          <p className="text-sm text-red-300">{errorMsg}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        id="activate-btn"
        type="submit"
        className="btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Mengaktifkan...
          </span>
        ) : (
          "Aktifkan Kartu Saya ✨"
        )}
      </button>
    </form>
  );
}
