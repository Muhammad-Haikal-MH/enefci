import type { Metadata } from "next";
import AdminBatchForm from "@/components/AdminBatchForm";

export const metadata: Metadata = {
  title: "Admin Dashboard - Batch Generate",
  description: "Generate batch NFC cards and download as a ZIP.",
};

export default function AdminPage() {
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
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <AdminBatchForm />
    </main>
  );
}
