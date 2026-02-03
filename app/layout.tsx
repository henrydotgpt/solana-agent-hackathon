import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://paygent.vercel.app"
  ),
  title: {
    default: "Paygent — Payments infrastructure for the AI era",
    template: "%s | Paygent",
  },
  description:
    "Describe your business. Get a complete payment storefront — hosted, live, and accepting money in seconds. 0.75% flat fee. Non-custodial. Built on Solana.",
  keywords: [
    "Solana",
    "payment",
    "storefront",
    "AI",
    "agent",
    "crypto",
    "USDC",
    "QR code",
    "Paygent",
    "Solana Pay",
    "non-custodial",
  ],
  openGraph: {
    title: "Paygent — Payments infrastructure for the AI era",
    description:
      "Describe your business. Get a live payment storefront in 60 seconds. 0.75% flat fee. Non-custodial. Built on Solana.",
    type: "website",
    siteName: "Paygent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paygent — Payments infrastructure for the AI era",
    description:
      "AI-powered payment storefronts on Solana. 0.75% flat fee. Live in 60 seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-background noise-bg`}>
        <Providers>
          {/* Background gradient effects */}
          <div className="fixed inset-0 bg-dark-gradient pointer-events-none" />
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-solana-purple/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-solana-green/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
