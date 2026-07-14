import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://awloadvertising.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AWLO Advertising | Premium LED Billboard Advertising in Ethiopia",
  description:
    "AWLO Advertising owns and operates a large digital LED billboard. Reach thousands of potential customers every day through premium LED billboard advertising in Ethiopia.",
  keywords:
    "LED billboard, outdoor advertising, Ethiopia, digital billboard, AWLO advertising",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "AWLO Advertising",
    title: "AWLO Advertising | Premium LED Billboard Advertising in Ethiopia",
    description:
      "Reach thousands of potential customers every day through premium LED billboard advertising in Ethiopia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AWLO Advertising – LED Billboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AWLO Advertising | Premium LED Billboard Advertising in Ethiopia",
    description:
      "Reach thousands of potential customers every day through premium LED billboard advertising in Ethiopia.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
