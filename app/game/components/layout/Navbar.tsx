"use client";
import { Burger, Group, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Navbar.module.css";

export function Navbar() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <div>
      <Burger
        className={classes.burger}
        aria-label="Toggle navigation"
        opened={opened}
        onClick={toggle}
        size="lg"
      />
     <Group
        className={opened ? classes.menuVisible : classes.menuHidden}
        style={{
          flexDirection: "column",
        }}
      >
        <UnstyledButton className={classes.control}>Home</UnstyledButton>
        <UnstyledButton className={classes.control}>Blog</UnstyledButton>
        <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
        <UnstyledButton className={classes.control}>Support</UnstyledButton>
      </Group>
    </div>
  );
}
