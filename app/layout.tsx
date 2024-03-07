import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "src/styles/globals.css";

const title = "Virtual Staging using AI";
const description = "Highly Realistic Virtual Staging in a Snap.";
// TODO: Update this image with the correct one
const ogimage = "https://snapstager.com/og-image.png";
const sitename = "snapstager.com";

export const metadata: Metadata = {
  title,
  metadataBase: new URL("https://snapstager.com"),
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: ogimage,
    title,
    description,
    url: "https://snapstager.com",
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ogimage,
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
