import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030712',
};

export const metadata: Metadata = {
  title: "SuperApps | All-in-One Platform",
  description: "Your ultimate super app with Weather, Crypto, News, Games, and 20+ integrated services powered by open-source APIs. Experience the future of productivity.",
  keywords: "super app, all in one, weather, crypto, news, games, productivity, tools, utilities",
  authors: [{ name: "SuperApps Team" }],
  openGraph: {
    title: "SuperApps | All-in-One Platform",
    description: "20+ apps in one beautiful platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
