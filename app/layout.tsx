import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Droplets - Interactive Rainforest Experience",
  description: "An immersive rainforest experience with day/night transitions and dynamic soundscapes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
