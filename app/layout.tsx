import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
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
        className={`${sora.variable} ${dmSans.variable} font-body min-h-screen bg-[#08080C] text-[#E8E8ED] antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
