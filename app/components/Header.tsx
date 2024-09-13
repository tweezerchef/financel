import { Title, Text, Container, Overlay } from '@mantine/core'
import Image from 'next/image'
import { GuestButton } from './buttons/GuestButton'
import classes from './ui/Header.module.css'

export function Header() {
  return (
    <div className={classes.wrapper}>
      <Image
        src="/loginHeader.webp"
        alt="Financel"
        fill
        sizes="max-width: 400px max-height: 300px"
        quality={100}
        priority
      />
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>Financle</Title>

        <Container>
          <Text size="md" className={classes.description}>
            Financle is where the Brothers Of Finance (gender neutral) come
            together to prove their worth.
          </Text>
        </Container>
        <GuestButton />
      </div>
    </div>
  )
}
