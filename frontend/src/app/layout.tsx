import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TuringArena | Human vs AI Trading",
  description: "Can you tell AI from human by their trading decisions? Prove it and earn rewards on Mantle Network.",
  keywords: ["AI", "Trading", "Turing Test", "Mantle", "DeFi", "Web3"],
  openGraph: {
    title: "TuringArena | Human vs AI Trading",
    description: "The first on-chain Turing Test for trading agents",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuringArena",
    description: "Human vs AI Trading on Mantle",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cyber-bg text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
