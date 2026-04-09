import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthIQ – Your AI Health Assistant",
  description:
    "HealthIQ is an AI-powered health assistant built with Google Gemini. Ask questions about symptoms, nutrition, fitness, mental health, and general wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
