"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  AppShell,
  Burger,
  Group,
  MantineProvider,
  UnstyledButton,
  ColorSchemeScript,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./MobileNavbar.module.css"; // Ensure your CSS module paths are correct
import "@mantine/core/styles.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AppShell
            header={{ height: 100 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
              collapsed: { desktop: true, mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Header style={{ position: "relative" }}>
              <div
                style={{
                  flex: 1,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <Image
                  src="/header.png"
                  alt="Financel Logo"
                  fill
                  priority={true}
                  style={{
                    objectFit: "cover",
                  }}
                />
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                  style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
                />
              </div>
              <Group
                h="100%"
                px="md"
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Group justify="space-between" style={{ flex: 1 }}>
                  <Group ml="xl" gap={0} visibleFrom="sm">
                    <UnstyledButton className={classes.control}>
                      Home
                    </UnstyledButton>
                    <UnstyledButton className={classes.control}>
                      Blog
                    </UnstyledButton>
                    <UnstyledButton className={classes.control}>
                      Contacts
                    </UnstyledButton>
                    <UnstyledButton className={classes.control}>
                      Support
                    </UnstyledButton>
                  </Group>
                </Group>
              </Group>
            </AppShell.Header>
            <AppShell.Navbar py="md" px={4}>
              <UnstyledButton className={classes.control}>Home</UnstyledButton>
              <UnstyledButton className={classes.control}>Blog</UnstyledButton>
              <UnstyledButton className={classes.control}>
                Contacts
              </UnstyledButton>
              <UnstyledButton className={classes.control}>
                Support
              </UnstyledButton>
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
