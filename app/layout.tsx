import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "src/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "src/styles/theme";
import { Notifications } from "@mantine/notifications";

const title = " SpaceShift | AI-Driven Staging for the Perfect Look";
const description =
  "Stage your room virtually using AI for only $1 per image.";
// TODO: Update this image with the correct one
const ogimage = "https://snapstager.com/og-image.png";
const sitename = "snapstager.com";

export const metadata: Metadata = {
  title,
  metadataBase: new URL("https://snapstager.com"),
  description,
  icons: {
    icon: "/iso.ico",
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
    <html lang="en" className="h-full">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="h-full">
        <MantineProvider theme={theme}>
          {children}
          <Notifications position="bottom-right" />
        </MantineProvider>
        <Analytics />
      </body>
    </html>
  );
}
