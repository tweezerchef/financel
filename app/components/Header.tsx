import Link from "next/link";
import { Title, Text, Container, Button, Overlay } from "@mantine/core";
import classes from "./Header.module.css";
import Image from "next/image";

export function Header() {
  return (
    <div className={classes.wrapper}>
      <Image
        src="/loginHeader.webp"
        alt="Financel"
        fill
        quality={100}
        priority={true}
      />
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>Financle</Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Financle is where the Brothers Of Finance (gender neutral) come
            together to prove their worth.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Link href="/game">
            <Button className={classes.control} variant="white" size="lg">
              Continue as Guest
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
