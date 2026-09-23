"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface CardResult {
  id_kartu: string;
  scan_url: string;
  final_base64: string;
}

export default function AdminBatchForm() {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<{ totalCards: number; activeCards: number } | null>(null);
  
  const [count, setCount] = useState<number>(10);
  const [startIndex, setStartIndex] = useState<number>(1);
  const [status, setStatus] = useState<"idle" | "loading" | "zipping" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSecret) return;

    setStatus("loading");
    setMessage("Authenticating...");

    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminSecret}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to authenticate.");
      }

      setStats(data);
      setIsAuthenticated(true);
      setStatus("idle");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "Invalid Admin Secret.");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("Generating images on the server...");

    try {
      const res = await fetch("/api/admin/generate-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({ count, startIndex }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate batch.");
      }

      const cards: CardResult[] = data.cards;

      if (!cards || cards.length === 0) {
        throw new Error("No cards were generated.");
      }

      setStatus("zipping");
      setMessage("Zipping images...");

      const zip = new JSZip();

      cards.forEach((card) => {
        const base64Data = card.final_base64.replace(/^data:image\/\w+;base64,/, "");
        zip.file(`${card.id_kartu}.jpg`, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `NFC_Cards_Batch_${startIndex}_to_${startIndex + count - 1}.zip`);

      setStatus("success");
      setMessage(`Successfully generated and downloaded ${cards.length} cards!`);
      
      // Update stats after generation
      setStats((prev) => prev ? { ...prev, totalCards: prev.totalCards + cards.length } : prev);
      
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "An unexpected error occurred.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="glass-card p-8 max-w-sm w-full mx-auto mt-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-white/60 text-sm">Enter the secret key to access the dashboard.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-white/70 mb-1.5">
              Admin Secret
            </label>
            <input
              id="secret"
              type="password"
              className="input-field"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              required
              disabled={status === "loading"}
            />
          </div>
          {message && (
            <div className={`p-3 rounded-lg text-sm border bg-red-500/15 border-red-500/30 text-red-300`}>
              {message}
            </div>
          )}
          <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
            {status === "loading" ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 max-w-md w-full mx-auto mt-12">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/60 text-sm">Manage your NFC cards inventory.</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Total Generated</p>
          <p className="text-3xl font-bold text-white">{stats?.totalCards ?? 0}</p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
          <p className="text-indigo-300/70 text-xs font-semibold uppercase tracking-wider mb-1">Active Cards</p>
          <p className="text-3xl font-bold text-indigo-400">{stats?.activeCards ?? 0}</p>
        </div>
      </div>

      <hr className="border-white/10 mb-6" />

      {/* Batch Generator */}
      <h2 className="text-lg font-bold text-white mb-4">Generate Batch</h2>
      <form onSubmit={handleGenerate} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-white/70 mb-1.5">
              Count (Max 500)
            </label>
            <input
              id="count"
              type="number"
              min="1"
              max="500"
              className="input-field"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              required
              disabled={status === "loading" || status === "zipping"}
            />
          </div>
          <div>
            <label htmlFor="start-index" className="block text-sm font-medium text-white/70 mb-1.5">
              Start Index
            </label>
            <input
              id="start-index"
              type="number"
              min="1"
              className="input-field"
              value={startIndex}
              onChange={(e) => setStartIndex(parseInt(e.target.value) || 1)}
              required
              disabled={status === "loading" || status === "zipping"}
            />
          </div>
        </div>

        {message && status !== "idle" && (
          <div
            className={`p-3 rounded-lg text-sm border ${
              status === "error"
                ? "bg-red-500/15 border-red-500/30 text-red-300"
                : status === "success"
                ? "bg-green-500/15 border-green-500/30 text-green-300"
                : "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={status === "loading" || status === "zipping"}
        >
          {status === "loading" ? "Generating..." : status === "zipping" ? "Zipping..." : "Generate & Download ZIP"}
        </button>
      </form>
    </div>
  );
}
