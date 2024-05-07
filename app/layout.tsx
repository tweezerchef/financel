import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Center } from "@mantine/core";
import "@mantine/core/styles.css";
import styles from "./Layout.module.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
  },
  title: "Financel",
  description: "A game for the Brothers of Finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <main>
          <MantineProvider>
            <div className={styles.rootContainer}>
              <Center maw={500}>{children}</Center>
            </div>
          </MantineProvider>
        </main>
      </body>
    </html>
  );
}
