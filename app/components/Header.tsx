import { Title, Text, Container, Center, AspectRatio } from '@mantine/core'
import Image from 'next/image'
import { GuestButton } from './buttons/GuestButton'
import classes from './ui/Header.module.css'

interface HeaderProps {
  onAuthStart: () => void
  isAuthenticating?: boolean
}

export function Header({ onAuthStart, isAuthenticating }: HeaderProps) {
  return (
    <div className={classes.wrapper}>
      <div className={classes.imageContainer}>
        <AspectRatio ratio={500 / 309}>
          <Image
            src="/loginHeader.webp"
            alt="Financel"
            width={500}
            height={309}
            sizes="(max-width: 600px) 90vw, 400px"
            quality={60}
            priority
          />
        </AspectRatio>
      </div>
      {/* <Overlay color="#000" opacity={0.65} zIndex={1} /> */}

      <div className={classes.inner}>
        <Title className={classes.title}>Financle</Title>
        <Container>
          <Text size="md" className={classes.description}>
            Financle is where the Brothers and Sisters Of Finance come together
            to prove their worth.
          </Text>
        </Container>
        <Center>
          <div>
            <GuestButton
              onAuthStart={onAuthStart}
              isAuthenticating={isAuthenticating}
            />
          </div>
        </Center>
      </div>
    </div>
  )
}
