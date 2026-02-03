import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://paygent.vercel.app"
  ),
  title: {
    default: "Paygent — Accept payments. Skip the setup.",
    template: "%s | Paygent",
  },
  description:
    "Describe your business. Get a payment storefront in 60 seconds. 0.75% flat fee. Non-custodial. Built on Solana.",
  keywords: [
    "Solana",
    "payment",
    "storefront",
    "AI",
    "crypto",
    "USDC",
    "Paygent",
    "Solana Pay",
  ],
  openGraph: {
    title: "Paygent — Accept payments. Skip the setup.",
    description:
      "AI-powered payment storefronts on Solana. 0.75% flat fee. Live in 60 seconds.",
    type: "website",
    siteName: "Paygent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paygent — Accept payments. Skip the setup.",
    description:
      "AI-powered payment storefronts on Solana. 0.75% flat fee.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans min-h-screen bg-[#050505] text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
