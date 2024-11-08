import { Title, Text, Container, AspectRatio } from '@mantine/core'
import Image from 'next/image'
// import { GuestButtonWrapper } from './GuestButtonWrapper'
import classes from './ui/Header.module.css'

export function Header() {
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
            quality={50}
            priority
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,BASE64_BLUR_HERE"
            style={{
              width: '100%',
              height: 'auto',
              contentVisibility: 'auto',
              display: 'block',
              objectFit: 'cover',
              backgroundColor: '#f0f0f0',
            }}
          />
        </AspectRatio>
      </div>

      <div className={classes.inner}>
        <Title className={classes.title}>Financle</Title>
        <Container>
          <Text size="md" className={classes.description}>
            Financle is where the Brothers and Sisters Of Finance come together
            to prove their worth.
          </Text>
        </Container>
        {/* <Center>
          <GuestButtonWrapper />
        </Center> */}
      </div>
    </div>
  )
}
