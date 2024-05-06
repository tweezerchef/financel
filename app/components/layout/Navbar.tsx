"use client";
import { Burger, Group, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./MobileNavbar.module.css";

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <div>
      <Burger
        opened={opened}
        onClick={toggle}
        hiddenFrom="sm"
        size="sm"
        style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
      />
      {/* Add more client-only interactive elements here as needed */}
    </div>
  );
}
