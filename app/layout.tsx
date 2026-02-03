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
  title: "Paygent — AI-Powered Solana Payment Storefronts",
  description:
    "Tell the agent about your business. Get a complete payment storefront with Solana Pay QR codes, product catalog, and auto-conversion to USDC. No code. No crypto knowledge needed.",
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
  ],
  openGraph: {
    title: "Paygent",
    description:
      "AI-powered Solana payment storefronts for businesses. No code. No crypto knowledge needed.",
    type: "website",
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
