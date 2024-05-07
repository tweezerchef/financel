// Layout.tsx
"use client";
import Image from "next/image";
import { Burger, Container, Group, Stack, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./MobileNavbar.module.css";
import "@mantine/core/styles.css";
import { Footer } from "./components/layout/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Container
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div style={{ height: 100, position: "relative" }}>
        <Image
          src="/header.png"
          alt="Financel Logo"
          layout="fill"
          objectFit="cover"
          priority
        />
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
          style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
        />
      </div>

      {/* Navigation (Optional, can be omitted or toggled with Burger) */}
      <Group
        style={{
          display: opened ? "flex" : "none",
          flexDirection: "column",
          padding: "10px 0",
        }}
      >
        <UnstyledButton className={classes.control}>Home</UnstyledButton>
        <UnstyledButton className={classes.control}>Blog</UnstyledButton>
        <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
        <UnstyledButton className={classes.control}>Support</UnstyledButton>
      </Group>

      {/* Main Content */}
      {children}

      {/* Footer */}

      <Footer />
    </Container>
  );
}
