import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWLO Advertising | Premium LED Billboard Advertising in Ethiopia",
  description:
    "AWLO Advertising owns and operates a large digital LED billboard. Reach thousands of potential customers every day through premium LED billboard advertising in Ethiopia.",
  keywords: "LED billboard, outdoor advertising, Ethiopia, digital billboard, AWLO advertising",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
