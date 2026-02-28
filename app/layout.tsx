import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AiFarcaster - AI-Powered Farcaster Tools",
  description: "Build, deploy, and manage Farcaster frames with AI assistance. Create, publish and monetize Farcaster frames powered by AI on the Base blockchain.",
  openGraph: {
    title: "AiFarcaster - AI-Powered Farcaster Tools",
    description: "Build, deploy, and manage Farcaster frames with AI assistance.",
    type: "website",
    siteName: "AiFarcaster",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiFarcaster - AI-Powered Farcaster Tools",
    description: "Build, deploy, and manage Farcaster frames with AI assistance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
