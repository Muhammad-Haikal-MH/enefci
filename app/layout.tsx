import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TapReview — Smart NFC & QR Review Standees for UMKM",
    template: "%s | TapReview",
  },
  description:
    "Instantly collect more Google Reviews for your business. Tap the NFC chip or scan the QR code — no app required.",
  keywords: ["NFC", "QR code", "Google Reviews", "UMKM", "standee", "ulasan"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "TapReview",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
